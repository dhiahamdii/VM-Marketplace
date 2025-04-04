"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DataPoint {
  date: string
  value: number
}

interface VMUsageChartProps {
  data: DataPoint[]
  yAxisLabel: string
  color: string
}

export default function VMUsageChart({ data, yAxisLabel, color }: VMUsageChartProps) {
  return (
    <ChartContainer
      className="h-full w-full"
      customTooltip={
        <ChartTooltip>
          <ChartTooltipContent
            content={({ payload, label }) => {
              if (!payload?.length) {
                return null
              }

              return (
                <div className="p-2">
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-sm font-medium text-muted-foreground">{payload[0].value}%</div>
                </div>
              )
            }}
          />
        </ChartTooltip>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            padding={{ left: 10, right: 10 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fontSize: 12 },
            }}
          />
          <Tooltip
            cursor={{ stroke: "#f3f4f6", strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="border shadow-sm">
                    <CardContent className="p-2">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-sm font-medium">{payload[0].value}%</div>
                    </CardContent>
                  </Card>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
            activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}


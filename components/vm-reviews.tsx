"use client"

import { useState } from "react"
import { Star, ThumbsUp, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample review data
const reviewsData = [
  {
    id: 1,
    vmId: 1,
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "2023-10-15",
    title: "Excellent performance and reliability",
    content:
      "I've been using this VM for my web development projects for the past month and I'm extremely satisfied. The performance is excellent and I haven't experienced any downtime. The pre-installed packages saved me a lot of setup time.",
    helpful: 24,
    replies: 2,
  },
  {
    id: 2,
    vmId: 1,
    user: {
      name: "Sarah Miller",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 4,
    date: "2023-09-28",
    title: "Good value for money",
    content:
      "This VM offers good performance for the price. I'm using it for hosting a small business website and it handles the traffic well. The only reason I'm not giving 5 stars is because I had some minor issues with the initial setup, but customer support was helpful.",
    helpful: 18,
    replies: 1,
  },
  {
    id: 3,
    vmId: 1,
    user: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "2023-11-02",
    title: "Perfect for development work",
    content:
      "I needed a reliable VM for my development work and this one exceeded my expectations. The performance is consistent and the pre-configured environment saved me hours of setup time. Highly recommended for developers!",
    helpful: 32,
    replies: 0,
  },
]

interface VMReviewsProps {
  vmId: number
}

export default function VMReviews({ vmId }: VMReviewsProps) {
  const [sortOption, setSortOption] = useState("recent")
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(5)

  // Filter reviews for this VM
  const vmReviews = reviewsData.filter((review) => review.vmId === vmId)

  // Sort reviews based on selected option
  const sortedReviews = [...vmReviews].sort((a, b) => {
    switch (sortOption) {
      case "recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "helpful":
        return b.helpful - a.helpful
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const handleSubmitReview = () => {
    // In a real app, this would send the review to an API
    alert(`Review submitted with rating: ${newRating} and content: ${newReview}`)
    setNewReview("")
    setNewRating(5)
  }

  // Calculate average rating
  const averageRating = vmReviews.reduce((acc, review) => acc + review.rating, 0) / vmReviews.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="ml-2 font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500 ml-1">({vmReviews.length} reviews)</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm">Sort by:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={review.user.avatar} alt={review.user.name} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="space-y-1 flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <h4 className="font-medium">{review.user.name}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>

                <h3 className="font-medium mt-2">{review.title}</h3>
                <p className="text-gray-700">{review.content}</p>

                <div className="flex items-center gap-4 mt-2">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful ({review.helpful})</span>
                  </Button>

                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Reply ({review.replies})</span>
                  </Button>
                </div>
              </div>
            </div>

            <Separator />
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="font-medium">Write a Review</h3>

        <div className="space-y-2">
          <div className="flex items-center">
            <span className="mr-2">Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 cursor-pointer ${star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setNewRating(star)}
                />
              ))}
            </div>
          </div>

          <Textarea
            placeholder="Share your experience with this VM..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            rows={4}
          />
        </div>

        <Button onClick={handleSubmitReview}>Submit Review</Button>
      </div>
    </div>
  )
}


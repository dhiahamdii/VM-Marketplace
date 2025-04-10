import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password
          })

          if (response.data && response.data.access_token) {
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
              accessToken: response.data.access_token
            }
          }
          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.accessToken = token.accessToken as string | undefined
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
} 
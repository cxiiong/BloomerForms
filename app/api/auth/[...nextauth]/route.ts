import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const GET = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Attach the user's email to the session for access checks
      session.user = session.user || {}
      session.user.email = token.email
      return session
    },
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
})

export const POST = GET
export const runtime = "nodejs"
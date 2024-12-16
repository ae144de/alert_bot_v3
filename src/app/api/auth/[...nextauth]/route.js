// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.user = {
          name: profile.name,
          email: profile.email,
          image: profile.picture
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }

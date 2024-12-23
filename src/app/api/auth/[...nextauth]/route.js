// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import { encode, decode } from "next-auth/jwt"

const handler = NextAuth({
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    
  ],
  session: { strategy: 'jwt' },
  jwt: {
    // You can define a custom secret or rely on NEXTAUTH_SECRET
    secret: process.env.NEXTAUTH_SECRET,
    // maxAge: 60 * 60 * 48,
    
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // jwt() is called whenever a token is created/updated.
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // session() callback is called whenever a session is checked(e.g. getSession())
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    }
  }
})

export { handler as GET, handler as POST }

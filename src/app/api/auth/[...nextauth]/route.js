// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import { encode, decode } from "next-auth/jwt"
import jwt from 'jsonwebtoken';

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
    async jwt({ token, account, profile, user }) {
      // jwt() is called whenever a token is created/updated.
      // if (account?.access_token) {
      //   token.accessToken = account.access_token;
      // }
      // return token;
      // If user just signed in, store user details in the token
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // session() callback is called whenever a session is checked(e.g. getSession())
      // if (token?.accessToken) {
      //   session.accessToken = token.accessToken;
      // }
      // return session;
      // Expose the *entire* NextAuth token in the session,
      // so you can pass it to Flask.
      const signedJWT = jwt.sign(token, process.env.NEXTAUTH_SECRET, {
        algorithm: "HS256",
      });
      session.myCustomToken = signedJWT;
      return session;
    }
  }
})

export { handler as GET, handler as POST }

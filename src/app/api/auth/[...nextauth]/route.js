import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import { encode, decode } from "next-auth/jwt"
import jwt from 'jsonwebtoken';
import { db } from "@/app/user/firebaseAdmin";

const handler = NextAuth({
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    
  ],
  session: { strategy: 'jwt' },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    
  },
  
  callbacks: {
    
     
    async jwt({ token, account, profile, user }) {
      
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      
      const signedJWT = jwt.sign(token, process.env.NEXTAUTH_SECRET, {
        algorithm: "HS256",
      });
      session.myCustomToken = signedJWT;

      session.email = token.email;
      session.name = token.name;

      
      return session;
    }
  }
})

export { handler as GET, handler as POST }

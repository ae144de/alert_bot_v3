// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import { encode, decode } from "next-auth/jwt"

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
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
      if (account) {
        token.accessToken = account.access_token;
      }
      return token
    },
    async session({ session, token }) {
      // if (token?.user) {
      //   session.user = token.user
      // }
      // const acc_token = token.accessToken;
      // secret = process.env.NEXTAUTH_SECRET;
      // const encoded_token = await encode({acc_token, secret});
      //   session.accessToken = token.accessToken;
        // Send properties to the client, like an access_token from a provider.
        // session.accessToken = token.accessToken;
        // session.user.email = token.email;
        // session.user.name = token.name;
        // session.user.image = token.picture;
        session.user.id = token.sub;
        session.accessToken = token.accessToken;
        return session;
        // return session
    }
  }
})

export { handler as GET, handler as POST }

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
  jwt: {
    // You can define a custom secret or rely on NEXTAUTH_SECRET
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 48,
    
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // token.user = {
        //   name: profile.name,
        //   email: profile.email,
        //   image: profile.picture
        // }
        token.accessToken = account.access_token;
        token.email = profile.email;
        token.name = profile.name || profile.username;
        token.picture = profile.picture || profile.avatar;
      }
      return token
    },
    async session({ session, token }) {
    //   if (token?.user) {
    //     session.user = token.user
    //   }
        // Send properties to the client, like an access_token from a provider.
        session.accessToken = token.accessToken;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        return session
    }
  }
})

export { handler as GET, handler as POST }

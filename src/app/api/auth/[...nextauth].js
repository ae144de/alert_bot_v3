import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          }),      
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            // If user just logged in:
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
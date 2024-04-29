import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import Google from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import Users from '../../../../models/users'
import connectMongoDB from '../../../lib/mongodb';


export const options: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        Google({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "your-cool-username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "your-awesome-password"
                }
            },
            async authorize(credentials) {
                // This is where you need to retrieve user data
                // to verify with credentials
                // Docs: https://next-auth.js.org/configuration/providers/credentials
                console.log(credentials)
                await connectMongoDB();
                
                if (credentials) {
                    const db_user = await Users.findOne({
                        username: credentials.username
                    })
                }
                const user = { id: "42", email: "test@test-localStorage.com",  name: "Dave", password: "nextauth" }

                if (credentials?.username === user.name && credentials?.password === user.password) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log(user)
            console.log(profile)
            console.log(account)

            await connectMongoDB(); // Ensure database connection
            const { id, email, name} = user;
            let userData = {}

            const dbUserData = await Users.findOne({email: email})
            if (dbUserData){
                const { githubId, googleId, username, password, displayName } = dbUserData

                if (account?.provider === 'github'){
                    userData = {
                        githubId: githubId !== id ? id : githubId,
                        googleId: googleId,
                        username: username ? username : name,
                        password: password,
                        displayName: displayName ? displayName : name,
                        email: email,
                    }
                }
                else if (account?.provider === 'google') {
                    userData = {
                        githubId: githubId,
                        googleId: googleId !== id ? id : googleId,
                        username: username ? username : name,
                        password: password,
                        displayName: displayName ? displayName : name,
                        email: email,
                    }
                }

                await Users.findOneAndUpdate({ email }, userData, { upsert: true, new: true });
            }
            else {
                if (account?.provider === 'github'){
                    userData = {
                        githubId: id,
                        googleId: "",
                        username: name,
                        password: "",
                        displayName: name,
                        email: email,
                    }
                }
                else if (account?.provider === 'google') {
                    userData = {
                        githubId: "",
                        googleId: id,
                        username: name,
                        password: "",
                        displayName: name,
                        email: email,
                    }
                }

                await Users.insertMany(userData)
            }
            
            return true; // True continues the sign-in process
        },
        jwt({ token, user }) {
          if (user) { // User is available during sign-in
            token.id = user.id
          }
          return token
        },
        session({ session, token }) {
          session.user.id = token.id
          return session
        },
      },
}
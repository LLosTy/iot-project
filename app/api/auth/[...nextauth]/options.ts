import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import Google from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import Users from '../../../../_models/users'
import connectMongoDB from '../../../../_lib/mongodb';
import bcrypt from 'bcryptjs';
import { ConnectingAirportsOutlined } from '@mui/icons-material'


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
                await connectMongoDB();
                
                if (credentials) {
                    const db_user = await Users.findOne({
                        username: credentials.username
                    })

                    if (db_user && bcrypt.compareSync(credentials.password, db_user.password)) {
                        return db_user
                    }
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
            await connectMongoDB(); // Ensure database connection
            const { id, email, name} = user;
            let userData = {
                email,
                username: name,
                displayName: name,
                githubId: "",
                googleId: "",
            }

            // Determine fields to update based on provider
            if (account?.provider !== undefined){
                if (account.provider === 'github') {
                    userData.githubId = String(user.id);
                } else if (account.provider === 'google') {
                    userData.googleId = String(user.id);
                }
            }

            // Update or insert user data
            const updatedUser = await Users.findOneAndUpdate(
                { email },
                userData,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            // Ensure the user ID is properly set
            user.id = updatedUser._id.toString();
            console.log(`${user.name} logged to the account`)
            return true;
        },
        jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.id = user.id
            }
            return token
        },
        session({ session, token }) {
        // console.log("token:",token);
            if (session?.user && token.id) {
                // @ts-ignore
                session.user.id = token.id;
            }

            return session;
        }
    },
}
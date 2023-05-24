import axios from "axios";
import NextAuth, { User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { Router, useRouter } from "next/router";
import { User as apiUser } from "@/types/user";

const SECRET = "Slhj+BwXY7qiUMEnHm1O1zB8j2kWDspTqhtBJ/9i48M=";
const token = jwt.sign({ role: 'next-server' }, SECRET);

let springBootUrl = "http://localhost:8080/api/v1";
let githubClientId = "24e93df90f0bfa4f5516";
let githubSecret = "c564e1f260e6d8aed553c2c91f8e3fb4f6bb86df";
let googleClientId = "314258814893-b1htlcmstf75cponsvgg47678po8u61t.apps.googleusercontent.com";
let googleSecret = "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";

if(process.env.NEXT_PUBLIC_PROD){
    console.log("USING PRODUCTION ENVIRONMENT VARIABLES");
    springBootUrl = process.env.NEXT_PUBLIC_SPRING_BOOT_URL;
    githubClientId = process.env.GITHUB_CLIENT_ID;
    githubSecret = process.env.GITHUB_SECRET;
    googleClientId = process.env.GOOGLE_CLIENT_ID;
    googleSecret = process.env.GOOGLE_SECRET;
}

const api = axios.create({
    baseURL: springBootUrl,
    headers: { Authorization: `Bearer ${token}` }
});


export default NextAuth({
    secret: SECRET,
    providers: [
        GoogleProvider({
           clientId: googleClientId,
           clientSecret: googleSecret 
        }),
        GithubProvider({
            clientId: githubClientId,
            clientSecret: githubSecret
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30, // 1 month
        updateAge: 60 * 15 // refresh every 15 minutes
    },
    pages: {
        newUser: '/complete-profile'
    },
    callbacks: {
        jwt: ({ token, user, account, isNewUser }) => {
            if(isNewUser){
                // TODO(Trystan): Do the thing that implements the new user flow.
                
            }

            if(user){
                token.userId = Number.parseInt(user.id);
            }

            return token;
        },
        session: ({ session, token }) => {
            session.accessToken = jwt.sign({
                    userId: token.userId,
                    role: "user"
                },
                SECRET,
                { expiresIn: '15m' }
            );

            session.user.id = token.userId;

            return session;
        }
    },
    adapter: {
        // @ts-ignore
        createUser: async ({ name, email, image }) => {
            const createUserRequest = { fullName: name, email };
            const createUserResponse = await api.post<apiUser>("/users", createUserRequest);
            const user: User = {
                id: createUserResponse.data.id + '',
                name: createUserResponse.data.fullName,
                email: createUserResponse.data.email
            };
            return { ...user, emailVerified: null };
        },
        // @ts-ignore
        getUser: async (id) => {
            let user: User;
            try{
                const searchResponse = await api.get<apiUser>(`/users/${id}`);
                user = {
                    id: searchResponse.data.id + '',
                    name: searchResponse.data.fullName,
                    email: searchResponse.data.email
                };
            } catch(e) {
                if(e.response.status === 404){
                    return null;
                } else {
                    throw e;
                }
            }

            return { ...user, emailVerified: null };
        },
        // @ts-ignore
        getUserByEmail: async (email) => {
            let user: User;
            try{
                const searchResponse = await api.get<apiUser>(`/users?email=${email}`);
                user = {
                    id: searchResponse.data.id + '',
                    name: searchResponse.data.fullName,
                    email: searchResponse.data.email
                };
            } catch(e) {
                if(e.response.status === 404){
                    return null;
                } else {
                    throw e;
                }
            }

            return { ...user, emailVerified: null };
        },
        getUserByAccount: async ({ providerAccountId, provider }) => {
            let user;
            try{
                const searchResponse = await api.get<apiUser>(`/users?providerName=${provider}&providerAccountId=${providerAccountId}`);
                user = {
                    id: searchResponse.data.id,
                    name: searchResponse.data.fullName,
                    email: searchResponse.data.email
                };
            } catch(e) {
                if(e.response.status === 404){
                    return null;
                } else {
                    throw e;
                }
            }

            return { ...user, emailVerified: null };
        },
        linkAccount: async ({ type, provider, providerAccountId, userId }) => {
            const createProivderRequest = { type, name: provider, accountId: providerAccountId };
            await api.post(`/users/${userId}/providers`, createProivderRequest);
        },
        // @ts-ignore
        createSession: () => {},
        // @ts-ignore
        getSessionAndUser: () => {},
        // @ts-ignore
        updateSession: () => {},
        // @ts-ignore
        deleteSession: () => {},
        // @ts-ignore
        updateUser: () => {},
    }
})
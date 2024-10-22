import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import type {User} from '@/types/User'
import {LoginData} from "@/libs/@dexodus/admin-constructor/src/LoginForm/LoginForm";
import getUserDataFromToken from "@/app/lib/actions/getUserDataFromToken";

async function getUser(data: LoginData): Promise<User | undefined> {
    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL_FROM_SERVER}/login/authentication_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        const user: User = await result.json();

        if ('code' in user) {
            return undefined;
        }

        const userInfo = getUserDataFromToken(user.token);

        const myProfileResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL_FROM_SERVER}/my-profile`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            cache: 'no-cache',
        })
        const profile = await myProfileResult.json();
        console.log('profile', profile);

        return {...user, ...userInfo, name: userInfo.username, roles: userInfo.roles, profile} as User;
    } catch (error) {
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const user = await getUser({
                    login: credentials.login as string,
                    password: credentials.password as string,
                } as LoginData);

                return user ?? null;
            },
        }),
    ],
    callbacks: {
        async jwt(config) {
            if (config.trigger === 'signIn') {
                config.token = {...config.token, ...config.user};
            }
            return config.token
        },
        async session(config) {
            // @ts-ignore
            config.session.user = {...config.session.user, ...config.token}
            return config.session
        }
    },
});

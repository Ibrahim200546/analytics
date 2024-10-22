import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            exp: number;
            iat: number;
            id: string;
            jti: string;
            name: string;
            profile: {
                id: number;
                email: string;
                roles: string[];
            };
            roles: string[];
            sub: string;
            token: string;
            username: string;
        }
    }
}

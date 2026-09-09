import {CredentialsSignin} from "next-auth";
import Credentials from "next-auth/providers/credentials"
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";

class AuthenticationServiceUnavailable extends CredentialsSignin {
    code = "service_unavailable";
}

const jwtProvider = Credentials({
    async authorize(data) {
        try {
            const apiFetch = await getApiFetch();

            const authenticationTokenResponse = await apiFetch(`/login/authentication_token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (
                authenticationTokenResponse.status === 401 ||
                authenticationTokenResponse.status === 403
            ) {
                console.error("Authentication token request failed", {
                    status: authenticationTokenResponse.status,
                });
                return null;
            }

            if (!authenticationTokenResponse.ok) {
                throw new AuthenticationServiceUnavailable();
            }

            const token = (await authenticationTokenResponse.json()).token;

            const myUserResponse = await apiFetch('/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!myUserResponse.ok) {
                throw new AuthenticationServiceUnavailable();
            }

            const user = await myUserResponse.json();

            return {...user, token: token};
        } catch (error) {
            console.error("JWT authorization request failed", error);

            if (error instanceof CredentialsSignin) {
                throw error;
            }

            throw new AuthenticationServiceUnavailable();
        }
    },
});

export default jwtProvider;

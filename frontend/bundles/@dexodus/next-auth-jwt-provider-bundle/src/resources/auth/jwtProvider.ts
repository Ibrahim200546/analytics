import Credentials from "next-auth/providers/credentials"
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";

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

            if (!authenticationTokenResponse.ok) {
                console.error("Authentication token request failed", {
                    status: authenticationTokenResponse.status,
                });
                return null;
            }

            const token = (await authenticationTokenResponse.json()).token;

            const myUserResponse = await apiFetch('/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!myUserResponse.ok) {
                console.error("Authenticated user request failed", {
                    status: myUserResponse.status,
                });
                return null;
            }

            const user = await myUserResponse.json();

            return {...user, token: token};
        } catch (error) {
            console.error("JWT authorization request failed", error);
            return null;
        }
    },
});

export default jwtProvider;

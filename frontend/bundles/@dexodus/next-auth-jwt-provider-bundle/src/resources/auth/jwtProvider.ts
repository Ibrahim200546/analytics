import Credentials from "next-auth/providers/credentials"
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";

const jwtProvider = Credentials({
    async authorize(data) {
        const apiFetch = await getApiFetch();

        const authenticationTokenResponse = await apiFetch(`/login/authentication_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!authenticationTokenResponse.ok) {
            throw new Error(`Authentication token is failed. Error: ${await authenticationTokenResponse.text()}`)
        }

        const token = (await authenticationTokenResponse.json()).token;

        const myUserResponse = await apiFetch('/api/users/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!myUserResponse.ok) {
            throw new Error('Failed to load user')
        }

        const user = await myUserResponse.json();

        return {...user, token: token};
    },
});

export default jwtProvider;

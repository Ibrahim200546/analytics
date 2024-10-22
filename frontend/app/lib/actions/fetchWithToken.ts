import {auth} from "@/auth";

export default async function fetchWithToken(...args: any[]) {
    const session = await auth() as any;
    const user = session?.user;
    const authorizationHeaders = user ? {Authorization: `Bearer ${user.token}`}: {};

    if (args.length < 2) {
        args.push({});
    }

    args[1].headers = {...(args[1].headers ?? {}), ...authorizationHeaders};
    // @ts-ignore
    return await fetch(...args);
}

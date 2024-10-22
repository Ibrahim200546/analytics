export default function getFetchWithToken(session: any) {
    return (...args: any[]) => {
        if (args.length < 2) {
            args.push({});
        }

        args[1].headers = {...(args[1].headers ?? {}), Authorization: `Bearer ${session.user.token}`};
        // @ts-ignore
        return fetch(...args);
    }
}

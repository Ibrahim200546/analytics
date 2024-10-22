import {useSession} from "next-auth/react";
import getFetchWithToken from "@/app/lib/actions/getFetchWithToken";

const useFetch = () => {
    const {data: session} = useSession();

    return getFetchWithToken(session);
}

export default useFetch;

import apiFetch, {ApiFetchFunction} from "@/libs/@dexodus/api-fetch/src/apiFetch";
import {useSession} from "next-auth/react";

const useApiFetch = (): ApiFetchFunction => {
    const session = useSession();
    const authorization = session?.data?.user?.token ? `Bearer ${session?.data?.user?.token}` : undefined;

    return (input, init) => apiFetch(input, init, authorization);
}

export default useApiFetch;

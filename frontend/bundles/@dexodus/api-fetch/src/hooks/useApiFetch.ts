import apiFetch, {ApiFetchFunction} from "../apiFetch";
import {useSession} from "next-auth/react";
import {useCallback} from "react";

const useApiFetch = (): ApiFetchFunction => {
    const session = useSession();
    const authorization = session?.data?.user?.token ? `Bearer ${session?.data?.user?.token}` : undefined;

    return useCallback(
        (input, init) => apiFetch(input, init, authorization),
        [authorization],
    );
}

export default useApiFetch;

import apiFetch, {ApiFetchFunction} from "@/libs/@dexodus/api-fetch/src/apiFetch";
import {auth} from "@/auth";

const getApiFetch = async (): Promise<ApiFetchFunction> => {
    const session = await auth();
    const authorization = session?.user?.token ? `Bearer ${session?.user?.token}` : undefined;

    return (input, init) => apiFetch(input, init, authorization);
}

export default getApiFetch;

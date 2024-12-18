import apiFetch, {ApiFetchFunction} from "../apiFetch";
import {auth} from "@/auth";

const getApiFetch = async (): Promise<ApiFetchFunction> => {
    let session = undefined;

    try {
        session = await auth();
    } catch (error) {
    }

    const authorization = session?.user?.token ? `Bearer ${session?.user?.token}` : undefined;

    return (input, init) => apiFetch(input, init, authorization);
}

export default getApiFetch;

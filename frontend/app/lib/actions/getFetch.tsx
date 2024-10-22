import getFetchWithToken from "@/app/lib/actions/getFetchWithToken";
import getSession from "@/app/lib/actions/getSession";

const getFetch = async () => {
    const session = await getSession();

    return getFetchWithToken(session);
}

export default getFetch;

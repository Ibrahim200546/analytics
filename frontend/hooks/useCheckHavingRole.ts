import User from "@/apiTypes/App/Entity/User";
import {useSession} from "next-auth/react";

type UserRole = User["roles"][number];

const useCheckHavingRole = (role: UserRole): boolean => {
    const {data} = useSession();

    return data?.user?.roles.includes(role) === true;
}

export default useCheckHavingRole;

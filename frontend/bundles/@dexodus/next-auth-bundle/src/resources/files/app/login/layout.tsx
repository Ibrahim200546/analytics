import {auth} from "@/auth";
import {redirect} from "next/navigation";

const Layout = async ({children}) => {
    const session = await auth();

    if (session) {
        return redirect('/admin');
    }

    return children;
}

export default Layout;

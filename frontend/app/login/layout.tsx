import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "ISMI - Авторизация",
    description: "Авторизация ISMI",
};

const Layout = async ({children}) => {
    const session = await auth();

    if (session) {
        return redirect('/admin');
    }

    return children;
}

export default Layout;

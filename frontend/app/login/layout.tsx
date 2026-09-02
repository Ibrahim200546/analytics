import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {Metadata} from "next";
import type {ReactNode} from "react";

export const metadata: Metadata = {
    title: "ISMI - Авторизация",
    description: "Авторизация ISMI",
};

const Layout = async ({children}: {children: ReactNode}) => {
    const session = await auth();

    if (session) {
        return redirect('/admin');
    }

    return children;
}

export default Layout;

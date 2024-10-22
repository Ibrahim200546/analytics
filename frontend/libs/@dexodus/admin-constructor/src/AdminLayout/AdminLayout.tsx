import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import SideBar from "@/libs/@dexodus/admin-constructor/src/SideBar";
import TopBar from "@/libs/@dexodus/admin-constructor/src/TopBar";
import Content from "@/libs/@dexodus/admin-constructor/src/Content/Content";
import AdminConstructorStoreProvider from "@/libs/@dexodus/admin-constructor/src/store/AdminConstructorStoreProvider";
import styles from "./AdminLayout.module.scss";
import TextTranslation from "@/libs/@dexodus/translation/src/server/TextTranslation";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";
import classnames from "classnames";
import { headers } from 'next/headers';
import PageLoadingProgressbar from "@/libs/@dexodus/admin-constructor/src/PageLoadingProgressbar";
import { redirect } from "next/navigation";
import getApiFetch from "@/libs/@dexodus/api-fetch/src/server/getApiFetch";
import SetDefaultNavigation from "@/libs/@dexodus/admin-constructor/src/SetDefaultNavigation";
import {ToastContainer} from "react-toastify";
import "react-toastify/scss/main.scss"

interface AdminLayoutProps {
    children: React.ReactNode;
    params: {
        slug: string[];
    };
}

const AdminLayout: React.FC<AdminLayoutProps> = async ({children, params}) => {
    const headersList = headers();
    const headerUrl = headersList.get('x-current-url') || "";
    let slug = headerUrl.startsWith('/admin/') ? headerUrl.slice(7).split('/') : [];

    const session = await auth();

    if (!session?.user || new Date(session?.expires) < new Date()) {
        return redirect('/login');
    }

    const apiFetch = await getApiFetch();
    const data = await apiFetch(`/admin-constructor/navigation`);

    if (!data.ok) {
        console.log('error with loading navigation: ', await data.text());
        return redirect('/login');
    }

    const json = await data.json();
    slug = params?.slug ?? slug;

    return (
        <div className={classnames(styles.adminLayout)}>
            <SessionProvider session={session}>
                <AdminConstructorStoreProvider>
                    <SetDefaultNavigation path={slug.join('.')}/>
                    <TopBar currentPageName={<TextTranslation label={`navigation.${slug.join('.')}`}/>}/>
                    <div style={{
                        display: 'flex'
                    }}>
                        <SideBar navigation={json} slug={slug}/>
                        <Content>
                            {children}
                        </Content>
                    </div>
                </AdminConstructorStoreProvider>
            </SessionProvider>
            <ToastContainer/>
        </div>
    );
};


export default AdminLayout;

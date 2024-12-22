import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import SideBar from "../SideBar";
import TopBar from "../TopBar";
import Content from "../Content/Content";
import AdminConstructorStoreProvider from "../store/AdminConstructorStoreProvider";
import styles from "./AdminLayout.module.scss";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";
import classnames from "classnames";
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import SetDefaultNavigation from "../SetDefaultNavigation";
import {ToastContainer} from "react-toastify";

interface AdminLayoutProps {
    children: React.ReactNode;
    params: {
        slug: string[];
    };
}

const AdminLayout = async ({children, params}) => {
    const headersList = await headers();
    const headerUrl = headersList.get('x-current-url') || "";
    let slug = headerUrl.startsWith('/admin/') ? headerUrl.slice(7).split('/') : [];

    const session = await auth();
    const apiFetch = await getApiFetch();
    const data = await apiFetch(`/admin-constructor/navigation`);

    if (session === null) {
        return redirect('/login');
    }

    if (!data.ok) {
        console.log('error with loading navigation: ', await data.text());
        throw new Error('Error with loading navigation')
    }

    const json = await data.json();
    slug = params?.slug ?? slug;

    return (
        <div className={classnames(styles.adminLayout)}>
            <SessionProvider session={session}>
                <AdminConstructorStoreProvider>
                    <SetDefaultNavigation path={slug.join('.')}/>
                    <TopBar/>
                    <div style={{display: 'flex'}}>
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

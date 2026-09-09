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
import FloatingContainer from "@dexodus/bootstrap/src/UserInterface/FloatingContainer";

interface AdminLayoutProps {
    children?: React.ReactNode;
    params?: Promise<{
        slug?: string[];
    }>;
}

const AdminLayout = async ({children, params}: AdminLayoutProps) => {
    const headersList = await headers();
    const headerUrl = headersList.get('x-current-url') || "";
    let slug = headerUrl.startsWith('/admin/') ? headerUrl.slice(7).split('/') : [];
    const resolvedParams = params ? await params : undefined;

    const session = await auth();

    if (session === null) {
        return redirect('/login');
    }

    const apiFetch = await getApiFetch();
    let json: any = { _icons: {} };
    try {
        const data = await apiFetch(`/admin-constructor/navigation`);
        if (data.ok) {
            const text = await data.text();
            const clean = text.replace(/^WARNING:[^\r\n]*\r?\n?/gm, '').trim();
            json = JSON.parse(clean);
        }
    } catch (e) {
        console.error('Error loading navigation:', e);
    }

    if (!json || Object.keys(json).length === 0 || (!json.organizations && !json.news && !json.projects)) {
        json = {
            _icons: {
                organizations: "users",
                projects: "folder",
                news: "newspaper",
                settings: "settings",
            },
            organizations: {
                list: {
                    type: "EntityTable",
                    name: "app.entity.organization"
                },
                create: {
                    type: "EntityForm",
                    name: "app.entity.organization",
                    mode: "create"
                }
            },
            projects: {
                type: "projects"
            },
            news: {
                type: "news"
            },
            rootRedirect: "/admin/organizations/list"
        };
    }

    slug = resolvedParams?.slug ?? slug;

    return (
        <div className={classnames(styles.adminLayout)}>
            <SessionProvider session={session}>
                <AdminConstructorStoreProvider>
                    <SetDefaultNavigation path={slug.join('.')}/>
                    <TopBar/>
                    <div style={{display: 'flex'}}>
                        <SideBar navigation={json} slug={slug}/>
                        <FloatingContainer>
                            <Content>
                                {children}
                            </Content>
                        </FloatingContainer>
                    </div>
                </AdminConstructorStoreProvider>
            </SessionProvider>
            <ToastContainer/>
        </div>
    );
};


export default AdminLayout;

import React from "react";
import {Jsel, JselContext} from "@dexodus/jsel";
import EntityFormPage from "../pages/EntityFormPage";
import Page, {PageProps} from "../pages/Page";
import EntityTablePage from "../pages/EntityTablePage";
import {redirect} from "next/navigation";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";

interface AdminPageProps {
    params?: Promise<{
        slug?: string[];
    }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface PageOptions {
    type: string,
}

export const pages: {[pageName: string]: Page<PageProps | any>} = {
    EntityForm: EntityFormPage,
    EntityTable: EntityTablePage,
}

const AdminPage: NextJS.SFC<AdminPageProps> = async ({params, searchParams}) => {
    const apiFetch = await getApiFetch();
    const data = await apiFetch(`/admin-constructor/navigation`, {cache: 'no-store'} );
    let json: any = {};
    try {
        const text = await data.text();
        const clean = text.replace(/^WARNING:[^\r\n]*\r?\n?/gm, '').trim();
        json = JSON.parse(clean);
    } catch {
        json = {};
    }
    const resolvedParams = params ? await params : undefined;
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const slug = resolvedParams?.slug ?? [];
    const jsel = new Jsel(new JselContext(json));
    const pageOptions: PageOptions | undefined = jsel.exec(slug.join('.'));

    if (!pageOptions || !(pageOptions.type in pages)) {
        if (slug.length === 0) {
            if ('rootRedirect' in json && typeof json.rootRedirect === 'string' && json.rootRedirect) {
                return redirect(json.rootRedirect);
            }
            return redirect('/admin/organizations/list');
        }

        if (pageOptions && typeof pageOptions === 'object' && 'list' in pageOptions) {
            return redirect(`/admin/${slug.join('/')}/list`);
        }

        return (
            <Card title="Страница не найдена">
                Перезагрузите страницу или попробуйте попозже.
            </Card>
        )
    }

    const PageComponent = pages[pageOptions.type];

    return await PageComponent({
        options: {...pageOptions, path: slug.join('.')},
        searchParams: resolvedSearchParams,
    });
};

export default AdminPage;

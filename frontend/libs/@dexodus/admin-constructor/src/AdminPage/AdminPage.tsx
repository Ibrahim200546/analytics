import React from "react";
import {Jsel, JselContext} from "@dexodus/jsel";
import EntityFormPage from "@/libs/@dexodus/admin-constructor/src/pages/EntityFormPage";
import Page, {PageProps} from "@/libs/@dexodus/admin-constructor/src/pages/Page";
import EntityTablePage from "@/libs/@dexodus/admin-constructor/src/pages/EntityTablePage";
import {redirect} from "next/navigation";
import getApiFetch from "@/libs/@dexodus/api-fetch/src/server/getApiFetch";
import Card from "@/libs/@dexodus/bootstrap/UserInterface/Card";

interface AdminPageProps {
    params: {
        slug: string[];
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export interface PageOptions {
    type: string,
}

export const pages: {[pageName: string]: Page<PageProps | any>} = {
    EntityForm: EntityFormPage,
    EntityTable: EntityTablePage,
}

const AdminPage: React.FC<AdminPageProps> = async ({params, searchParams}) => {
    const apiFetch = await getApiFetch();
    const data = await apiFetch(`/admin-constructor/navigation`, {cache: 'no-store'} );
    const json = await data.json();
    const slug = params?.slug ?? [];
    const jsel = new Jsel(new JselContext(json));
    const pageOptions: PageOptions | undefined = jsel.exec(slug.join('.'));

    console.log('searchParams in page', searchParams);

    if (!pageOptions || !(pageOptions.type in pages)) {
        if (!params.slug && 'rootRedirect' in json && typeof json.rootRedirect === 'string') {
            return redirect(json.rootRedirect);
        }

        return (
            <Card title="Страница не найдена">
                Перезагрузите страницу или попробуйте попозже.
            </Card>
        )
    }

    const PageComponent = pages[pageOptions.type];

    return (
        <PageComponent options={{...pageOptions, path: slug.join('.')}} searchParams={searchParams}/>
    );
};

export default AdminPage;

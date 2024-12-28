import React from "react";
import styles from "./page.module.scss";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import ArticleList from "@/components/ArticleList";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import {redirect} from "next/navigation";
import HydraCollection from "@/types/HydraCollection";
import Article from "@/apiTypes/Dexodus/SmiParserBundle/Entity/Article";
import PageGasket from "@dexodus/admin-constructor/src/pages/PageGasket";
import {cookies} from "next/headers";
import {auth} from "@/auth";
import HtmlView from "@dexodus/bootstrap/src/UserInterface/HtmlView";
import User from "@/apiTypes/App/Entity/User";
import Organization from "@/apiTypes/App/Entity/Organization";
import ProjectArticle from "@/apiTypes/App/Entity/ProjectArticle";

interface PageProps {
}

const Page: NextJS.SFC<PageProps> = async ({}) => {
    const apiFetch = await getApiFetch();
    const cookiesStore = await cookies();
    const {user} = (await auth()) as {user: User};
    let organizationId = undefined;

    if (!user) {
        return <></>
    }

    if (user.roles.includes('ROLE_SUPERVISOR')) {
        organizationId = cookiesStore.get(`supervisor-${user?.id}-organization-id` as any)?.value;
    } else if (user.roles.includes('ROLE_EMPLOYEE')) {
        organizationId = cookiesStore.get(`employee-${user?.id}-organization-id` as any)?.value;

        if (!organizationId) {
            const myOrganizationResponse = await apiFetch('/api/organizations/my');
            const myOrganization: Organization = await myOrganizationResponse.json();
            organizationId = `${myOrganization.id}`;
            // cookiesStore.set(`employee-${user?.id}-organization-id` as any, organizationId);
        }
    }

    if (!organizationId) {
        return (
            <Card title="Нету доступа">
                Для доступа к этой странице, необходимо выбрать организацию
            </Card>
        )
    }

    const projectId = cookiesStore.get(`news-${user?.id}-${organizationId}-project-id` as any)?.value;

    const fetches = [projectId ? apiFetch(`/api/project-articles/${projectId}`) : new Promise(resolve => resolve({
        ok: true,
        json: async () => ({
            "hydra:totalItems": 0,
            "hydra:member": [],
        } as HydraCollection<ProjectArticle>)
    }))]

    if (projectId) {
        fetches.push(apiFetch(`/api/projects/${projectId}`))
    }

    const responses = await Promise.all(fetches);

    for (const response of responses) {
        if (!response.ok) {
            const errorMessage = await response.text();
            return <HtmlView html={errorMessage}/>;
            // return redirect('/something-went-wrong');
        }
    }

    const [projectArticlesHydraCollection, project] = await Promise.all(responses.map(response => response.json()));

    return (
        <div className={styles.page}>
            <Card title='Новости' fullWidth={true}>
                <PageGasket title="Новости">
                    <ArticleList project={project} organizationId={organizationId} projectArticlesHydraCollection={projectArticlesHydraCollection}/>
                </PageGasket>
            </Card>
        </div>
    );
};

export default Page;

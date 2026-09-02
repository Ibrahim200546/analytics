import React from "react";
import styles from "./page.module.scss";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import ArticleList from "@/components/ArticleList";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import HydraCollection from "@/types/HydraCollection";
import PageGasket from "@dexodus/admin-constructor/src/pages/PageGasket";
import {cookies} from "next/headers";
import {auth} from "@/auth";
import HtmlView from "@dexodus/bootstrap/src/UserInterface/HtmlView";
import Organization from "@/apiTypes/App/Entity/Organization";
import Project from "@/apiTypes/App/Entity/Project";
import ProjectArticle from "@/apiTypes/App/Entity/ProjectArticle";

type PageProps = Record<string, never>;

const Page: NextJS.SFC<PageProps> = async ({}) => {
    const apiFetch = await getApiFetch();
    const cookiesStore = await cookies();
    const session = await auth();
    const user = session?.user;
    let organizationId = undefined;

    if (!user) {
        return <></>
    }

    if (user.roles.includes('ROLE_SUPERVISOR')) {
        organizationId = cookiesStore.get(`supervisor-${user?.id}-organization-id`)?.value;
    } else if (user.roles.includes('ROLE_EMPLOYEE')) {
        organizationId = cookiesStore.get(`employee-${user?.id}-organization-id`)?.value;

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

    const projectId = cookiesStore.get(`news-${user?.id}-${organizationId}-project-id`)?.value;

    let projectArticlesHydraCollection: HydraCollection<ProjectArticle> = {
        '@context': '',
        '@id': '',
        '@type': 'hydra:Collection',
        'hydra:totalItems': 0,
        'hydra:member': [],
        'hydra:view': {
            '@id': '',
            '@type': 'hydra:PartialCollectionView',
            'hydra:first': '',
            'hydra:last': '',
            'hydra:next': '',
        },
    };
    let project: Project | undefined;

    if (projectId) {
        const responses = await Promise.all([
            apiFetch("/api/project-articles/" + projectId),
            apiFetch("/api/projects/" + projectId),
        ]);

        for (const response of responses) {
            if (!response.ok) {
                const errorMessage = await response.text();
                return <HtmlView html={errorMessage}/>;
            }
        }

        [projectArticlesHydraCollection, project] = await Promise.all(
            responses.map(response => response.json()),
        );
    }

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

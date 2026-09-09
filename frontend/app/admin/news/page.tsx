import React from "react";
import Link from "next/link";
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

export const dynamic = 'force-dynamic';

type PageProps = Record<string, never>;

const Page: NextJS.SFC<PageProps> = async ({}) => {
    try {
        const apiFetch = await getApiFetch();
        const cookiesStore = await cookies();
        const session = await auth();
        const user = session?.user;
        const roles = Array.isArray(user?.roles) ? user.roles : [];
        let organizationId = undefined;

        if (!user) {
            return <></>;
        }

        if (roles.includes('ROLE_ADMIN')) {
            organizationId = cookiesStore.get(`admin-${user?.id}-organization-id`)?.value;
            if (!organizationId) {
                try {
                    const orgsRes = await apiFetch('/api/organizations?page=1');
                    if (orgsRes.ok) {
                        const orgsData = await orgsRes.json();
                        const firstOrg = orgsData['hydra:member']?.[0];
                        if (firstOrg) {
                            organizationId = `${firstOrg.id}`;
                        }
                    }
                } catch (e) {
                    console.error('Error fetching admin organization', e);
                }
            }
        } else if (roles.includes('ROLE_SUPERVISOR')) {
            organizationId = cookiesStore.get(`supervisor-${user?.id}-organization-id`)?.value;
        } else if (roles.includes('ROLE_EMPLOYEE')) {
            organizationId = cookiesStore.get(`employee-${user?.id}-organization-id`)?.value;

            if (!organizationId) {
                try {
                    const myOrganizationResponse = await apiFetch('/api/organizations/my');
                    if (myOrganizationResponse.ok) {
                        const myOrganization: Organization = await myOrganizationResponse.json();
                        organizationId = `${myOrganization.id}`;
                    }
                } catch (e) {
                    console.error('Error fetching my organization', e);
                }
            }
        }

        if (!organizationId) {
            return (
                <Card title="Материалы" fullWidth={true}>
                    <div style={{padding: "1rem"}}>
                        <h3>Организация не выбрана</h3>
                        <p>Для просмотра материалов перейдите в раздел <Link href="/admin/organizations/list" className="text-primary underline">Организации</Link>.</p>
                    </div>
                </Card>
            );
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
            try {
                const [articlesRes, projectRes] = await Promise.all([
                    apiFetch("/api/project-articles/" + projectId),
                    apiFetch("/api/projects/" + projectId),
                ]);

                if (articlesRes.ok) {
                    projectArticlesHydraCollection = await articlesRes.json();
                }
                if (projectRes.ok) {
                    project = await projectRes.json();
                }
            } catch (e) {
                console.error('Error fetching project articles:', e);
            }
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
    } catch (err: any) {
        if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.digest?.startsWith('NEXT_REDIRECT')) {
            throw err;
        }
        console.error('Error in News Page:', err);
        return (
            <Card title="Новости" fullWidth={true}>
                <div style={{padding: "1rem"}}>Раздел новостей временно недоступен.</div>
            </Card>
        );
    }
};

export default Page;

import React from "react";
import Link from "next/link";
import ProjectListCard from "@/components/ProjectListCard";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import {auth} from "@/auth";
import Organization from "@/apiTypes/App/Entity/Organization";
import {EntityTableStructure} from "@dexodus/table/src/adapter/EntityTableAdapter";

type PageProps = Record<string, never>;

const Page: NextJS.SFC<PageProps> = async ({}) => {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        return <></>
    }

    if (!user.roles.includes('ROLE_EMPLOYEE') && !user.roles.includes('ROLE_SUPERVISOR') && !user.roles.includes('ROLE_ADMIN')) {
        return (
            <Card title="Нет доступа">
                Для просмотра проектов необходима соответствующая роль.
            </Card>
        );
    }

    const apiFetch = await getApiFetch();
    let organization: Organization | null = null;
    let projectStructure: EntityTableStructure | null = null;

    try {
        const myOrgRes = await apiFetch('/api/organizations/my');
        if (myOrgRes.ok) {
            organization = await myOrgRes.json();
        } else {
            const allOrgsRes = await apiFetch('/api/organizations?page=1');
            if (allOrgsRes.ok) {
                const allOrgsData = await allOrgsRes.json();
                organization = allOrgsData['hydra:member']?.[0] || null;
            }
        }

        const structureRes = await apiFetch('/entity-table/structure/app.entity.project');
        if (structureRes.ok) {
            projectStructure = await structureRes.json();
        }
    } catch (e) {
        console.error('Error fetching project data', e);
    }

    if (!organization) {
        return (
            <Card title="Проекты" fullWidth={true}>
                <div style={{padding: "1rem"}}>
                    <h3>Организация не найдена</h3>
                    <p>Для создания и управления проектами необходимо создать организацию.</p>
                    <Link href="/admin/organizations/create" className="btn btn-primary" style={{marginTop: "0.5rem", display: "inline-block"}}>
                        + Создать организацию
                    </Link>
                </div>
            </Card>
        );
    }

    if (!projectStructure) {
        return (
            <Card title="Проекты" fullWidth={true}>
                <div style={{padding: "1rem"}}>
                    <p>Загрузка структуры проектов...</p>
                </div>
            </Card>
        );
    }

    return (
        <ProjectListCard organization={organization} projectStructure={projectStructure}/>
    );
};

export default Page;

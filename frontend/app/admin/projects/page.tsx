import React from "react";
import ProjectListCard from "@/components/ProjectListCard";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import HtmlView from "@dexodus/bootstrap/src/UserInterface/HtmlView";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import {auth} from "@/auth";

type PageProps = Record<string, never>;

const Page: NextJS.SFC<PageProps> = async ({}) => {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        return <></>
    }

    if (!user.roles.includes('ROLE_EMPLOYEE') && !user.roles.includes('ROLE_SUPERVISOR')) {
        return (
            <Card title="Нет доступа">
                Для просмотра проектов необходима роль сотрудника или руководителя.
            </Card>
        );
    }

    const apiFetch = await getApiFetch();
    const responses = await Promise.all([
        apiFetch('/api/organizations/my'),
        apiFetch('/entity-table/structure/app.entity.project'),
    ]);

    for (const response of responses) {
        if (!response.ok) {
            const errorMessage = await response.text();
            console.log(errorMessage);
            return <HtmlView html={errorMessage}/>;
        }
    }

    const [organization, projectStructure] = await Promise.all(responses.map(response => response.json()));

    return (
        <ProjectListCard organization={organization} projectStructure={projectStructure}/>
    );
};

export default Page;

import React from "react";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import OrganizationPage from "@/components/OrganizationPage";
import PageGasket from "@dexodus/admin-constructor/src/pages/PageGasket";
import {cookies} from "next/headers";
import {auth} from "@/auth";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import HtmlView from "@dexodus/bootstrap/src/UserInterface/HtmlView";

interface PageProps {
    params: {
        id: string[];
    };
}

const Page: NextJS.SFC<PageProps> = async () => {
    const session = await auth();
    const user = session?.user;
    const cookiesStore = await cookies();

    if (!user) {
        return <></>
    }

    if (!cookiesStore.has(`supervisor-${user?.id}-organization-id`)) {
        return (
            <Card title="Нету доступа">
                Для доступа к этой странице, необходимо выбрать организацию
            </Card>
        )
    }

    const organizationId = cookiesStore.get(`supervisor-${user?.id}-organization-id`)?.value;
    const apiFetch = await getApiFetch();
    const responses = await Promise.all([
        apiFetch(`/api/organizations/${organizationId}.jsonld`),
        apiFetch(`/entity-table/structure/app.entity.project`),
        apiFetch(`/entity-table/structure/app.entity.user:employee`),
        apiFetch(`/entity-table/structure/app.entity.organization-account`),
        apiFetch(`/entity-form/structure/dexodus.telegram-parser-bundle.entity.telegram-account`),
    ]);

    for (const response of responses) {
        if (!response.ok) {
            const errorMessage = await response.text();
            console.log(errorMessage);
            return <HtmlView html={errorMessage}/>;
            // return redirect('/something-went-wrong');
        }
    }

    const [organization, projectStructure, employeeStructure, organizationAccountStructure, telegramAccountStructure] = await Promise.all(responses.map(response => response.json()));

    return (
        <PageGasket title={`Организация "${organization.name}"`}>
            <OrganizationPage
                organization={organization}
                projectStructure={projectStructure}
                employeeStructure={employeeStructure}
                organizationAccountStructure={organizationAccountStructure}
                telegramAccountStructure={telegramAccountStructure}
            />
        </PageGasket>
    );
};

export default Page;

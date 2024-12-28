import React from "react";
import styles from "./page.module.scss";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import {redirect} from "next/navigation";
import OrganizationPage from "@/components/OrganizationPage";
import PageGasket from "@dexodus/admin-constructor/src/pages/PageGasket";

interface PageProps {
    params: {
        id: string[];
    };
}

const Page: NextJS.SFC<PageProps> = async ({params}) => {
    const organizationId = parseInt(params.id[0]);
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
            return redirect('/something-went-wrong');
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

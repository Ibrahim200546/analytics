import React from "react";
import Link from "next/link";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import OrganizationPage from "@/components/OrganizationPage";
import PageGasket from "@dexodus/admin-constructor/src/pages/PageGasket";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";

interface PageProps {
    params: Promise<{
        id: string[];
    }> | {
        id: string[];
    };
}

const Page: NextJS.SFC<PageProps> = async ({params}) => {
    const resolvedParams = await Promise.resolve(params);
    const organizationId = parseInt(resolvedParams.id[0]);
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
            return (
                <Card title="Ошибка загрузки" fullWidth={true}>
                    <div style={{padding: "1rem"}}>
                        <h3>Не удалось загрузить данные организации #{organizationId}</h3>
                        <p>Проверьте доступ или вернитесь к <Link href="/admin/organizations/list" className="text-primary underline">списку организаций</Link>.</p>
                    </div>
                </Card>
            );
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

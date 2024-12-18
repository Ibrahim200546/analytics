import React from "react";
import Page, {PageProps} from "../pages/Page";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import TableCard from "../TableCard";
import PageGasket from "@dexodus/admin-constructor/src/pages/PageGasket";
import {getI18n} from "react-i18next";
import {useTranslation} from "@/libs/@dexodus/translation/src/server/hooks/useTranslation";

interface EntityTablePageProps extends PageProps {
    options: {
        name: string;
        path: string;
    };
}

const EntityTablePage: Page<EntityTablePageProps> = async ({options}) => {
    const apiFetch = await getApiFetch();
    const {t} = await useTranslation();

    const getStructure = async () => {
        const fetchResult = await apiFetch(`/entity-table/structure/${options.name}`, {cache: 'no-store'} );

        return await fetchResult.json();
    }

    return (
        <PageGasket title={t(`navigation.${options.path}`)}>
            <TableCard
                cardTitle={`navigation.${options.path}`}
                entityTableStructure={await getStructure()}
                entityTableName={options.name}
                isDev={process.env.APP_ENV === 'dev'}
            />
        </PageGasket>
    );
};

export default EntityTablePage;

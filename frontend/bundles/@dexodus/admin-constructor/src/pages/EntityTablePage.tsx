import React from "react";
import Page, {PageProps} from "../pages/Page";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import TableCard from "../TableCard";
import PageGasket from "@dexodus/admin-constructor/src/pages/PageGasket";
import {getI18n} from "react-i18next";
import {useTranslation} from "@/libs/@dexodus/translation/src/server/hooks/useTranslation";
import {EntityTableStructure, FilterType} from "@dexodus/table/src/adapter/EntityTableAdapter";

interface EntityTablePageProps extends PageProps {
    options: {
        name: string;
        path: string;
    };
}

const defaultOrganizationStructure: EntityTableStructure = {
    name: "app.entity.organization",
    entity: "Organization",
    path: "/api/organizations",
    columns: [
        {
            dataKey: "id",
            getDataAction: "entity.id",
            priority: 1,
            title: "ID",
            filters: [
                { type: FilterType.SORT, query: "order[id]=" }
            ]
        },
        {
            dataKey: "name",
            getDataAction: "entity.name",
            priority: 2,
            title: "Название",
            filters: [
                { type: FilterType.SORT, query: "order[name]=" },
                { type: FilterType.SEARCH, query: "name={data0}" }
            ]
        },
    ],
    actions: [
        {
            type: "link",
            title: "Открыть",
            path: "/admin/organizations/view/{entity.id}"
        } as any
    ]
};

const EntityTablePage: Page<EntityTablePageProps> = async ({options}) => {
    const {t} = await useTranslation();

    const getStructure = async (): Promise<EntityTableStructure> => {
        try {
            const apiFetch = await getApiFetch();
            const fetchResult = await apiFetch(`/entity-table/structure/${options.name}`, {cache: 'no-store'} );
            if (fetchResult.ok) {
                const text = await fetchResult.text();
                const clean = text.replace(/^WARNING:[^\r\n]*\r?\n?/gm, '').trim();
                const parsed = JSON.parse(clean);
                if (parsed && Array.isArray(parsed.columns)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error('Failed to get entity table structure:', e);
        }

        if (options.name === "app.entity.organization") {
            return defaultOrganizationStructure;
        }

        return {
            name: options.name,
            entity: options.name,
            path: `/api/${options.name.split('.').pop()}s`,
            columns: [
                {
                    dataKey: "id",
                    getDataAction: "entity.id",
                    priority: 1,
                    title: "ID",
                    filters: [{ type: FilterType.SORT, query: "order[id]=" }]
                }
            ],
            actions: []
        };
    };

    const structure = await getStructure();

    return (
        <PageGasket title={t(`navigation.${options.path}`)}>
            <TableCard
                cardTitle={`navigation.${options.path}`}
                entityTableStructure={structure}
                entityTableName={options.name}
                isDev={process.env.APP_ENV === 'dev'}
            />
        </PageGasket>
    );
};

export default EntityTablePage;

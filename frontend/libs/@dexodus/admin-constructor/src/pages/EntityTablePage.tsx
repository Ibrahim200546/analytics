import React from "react";
import Page, {PageProps} from "@/libs/@dexodus/admin-constructor/src/pages/Page";
import getApiFetch from "@/libs/@dexodus/api-fetch/src/server/getApiFetch";
import TableCard from "@/libs/@dexodus/admin-constructor/src/TableCard";

interface EntityTablePageProps extends PageProps {
    options: {
        name: string;
        path: string;
    };
}

const EntityTablePage: Page<EntityTablePageProps> = async ({options}) => {
    const apiFetch = await getApiFetch();
    const fetchResult = await apiFetch(`/entity-table/structure/${options.name}`, {cache: 'no-store'} );
    const structure = await fetchResult.json();

    return (
        <TableCard
            cardTitle={`navigation.${options.path}`}
            entityTableStructure={structure}
            entityTableName={options.name}
        />
    );
};

export default EntityTablePage;

"use client";

import React, {useMemo} from "react";
import {EntityTableAdapter, EntityTableStructure} from "@dexodus/table/src/adapter/EntityTableAdapter";
import Table from "@dexodus/table/src/Table";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import {useSession} from "next-auth/react";
import {BallTriangle} from "react-loader-spinner";

const EMPTY_SEARCH_PARAMS = {};

interface TableGasketProps {
    apiUrl: string;
    structureUrl: string;
    structure: EntityTableStructure;
    additionalSearchParams?: {};
    entitiesPath?: string;
}

const TableGasket: React.FC<TableGasketProps> = ({apiUrl, structureUrl, structure, additionalSearchParams = EMPTY_SEARCH_PARAMS, entitiesPath}) => {
    const {data: session, status: sessionStatus} = useSession();
    const userName = session?.user?.email;
    const sessionToken = session?.user?.token;
    const apiFetch = useApiFetch();
    const adapter = useMemo(() => new EntityTableAdapter(apiUrl, structureUrl, structure, apiFetch, entitiesPath, additionalSearchParams), [apiFetch, apiUrl, additionalSearchParams, entitiesPath, structure, structureUrl]);

    if (sessionStatus !== "authenticated" || !sessionToken) {
        return <BallTriangle height={32}/>;
    }

    return <Table key={sessionToken} adapter={adapter} name={`${userName}_${entitiesPath ?? structureUrl}`}/>;
};

export default TableGasket;

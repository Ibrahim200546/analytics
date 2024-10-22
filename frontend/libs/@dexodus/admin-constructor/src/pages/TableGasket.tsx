"use client";

import React, {useRef} from "react";
import {EntityTableAdapter, EntityTableStructure} from "@/libs/@dexodus/table/adapter/EntityTableAdapter";
import Table from "@/libs/@dexodus/table/Table";
import useApiFetch from "@/libs/@dexodus/api-fetch/src/hooks/useApiFetch";
import {useSession} from "next-auth/react";

interface TableGasketProps {
    apiUrl: string;
    structureUrl: string;
    structure: EntityTableStructure;
    additionalSearchParams?: {};
    entitiesPath?: string;
}

const TableGasket: React.FC<TableGasketProps> = ({apiUrl, structureUrl, structure, additionalSearchParams = {}, entitiesPath}) => {
    const {data: session} = useSession();
    const userName = session?.user.profile.email;
    const apiFetch = useApiFetch();
    const adapter = useRef(new EntityTableAdapter(apiUrl, structureUrl, structure, apiFetch, entitiesPath, additionalSearchParams));

    return (
        <Table adapter={adapter.current} name={`${userName}_${entitiesPath ?? structureUrl}`}/>
    )
};

export default TableGasket;

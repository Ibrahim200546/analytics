"use client";

import React, {useEffect, useMemo, useState} from "react";
import styles from "./TableCard.module.scss";
import TextTranslation from "@/libs/@dexodus/translation/src/client/TextTranslation";
import {VscDesktopDownload, VscSettings} from "react-icons/vsc";
import Button, {ButtonSizes, ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import {getApiDomain} from "@dexodus/api-fetch/src/apiFetch";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import {EntityTableAdapter, EntityTableStructure} from "@dexodus/table/src/adapter/EntityTableAdapter";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import {useSession} from "next-auth/react";
import Table from "@dexodus/table/src/Table";
import {Jsel} from "@dexodus/jsel";
import useAdminConstructorDispatch from "@dexodus/admin-constructor/src/hooks/redux/useAdminConstructorDispatch";
import {AdminConstructorSlice} from "@dexodus/admin-constructor/src/redux/adminConstructorReducer";
import {BallTriangle} from "react-loader-spinner";

const EMPTY_SEARCH_PARAMS = {};

interface TableCardProps {
    cardTitle?: string;
    entityTableStructure: EntityTableStructure;
    entityTableName: string;
    entitiesPath?: string;
    additionalSearchParams?: {};
    isDev?: boolean;
    customControls?: React.ReactNode[];
    setRerender?: (rerenderFunction: () => void) => void;
    setJselRef?: (jselRef: React.RefObject<Jsel | null>) => void;
    max?: number;
}

const TableCard: React.FC<TableCardProps> = ({cardTitle, entityTableStructure, entityTableName, entitiesPath, additionalSearchParams = EMPTY_SEARCH_PARAMS, isDev = false, customControls= [], setRerender = () => {}, setJselRef = () => {}, max}) => {
    const {data: session, status: sessionStatus} = useSession();
    const userName = session?.user?.email;
    const sessionToken = session?.user?.token;
    const apiFetch = useApiFetch();
    const [loadedStructure, setLoadedStructure] = useState(entityTableStructure);
    const adapter = useMemo(() => new EntityTableAdapter(
        getApiDomain(),
        "entity-table/structure/" + entityTableName,
        loadedStructure,
        apiFetch,
        entitiesPath && "/api/" + entitiesPath,
        additionalSearchParams,
    ), [apiFetch, additionalSearchParams, entityTableName, entitiesPath, loadedStructure]);
    const [showSettings, setShowSettings] = useState<() => void>(() => {});
    const tableName = userName + "_" + (entitiesPath ? "/api/" + entitiesPath : "entity-table/structure/" + entityTableName);
    const [renderTable, setRenderTable] = useState<boolean>(true);

    useEffect(() => {
        if (!renderTable) {
            setRenderTable(true);
        }
    }, [renderTable]);

    const downloadExport = async () => {
        if (!session?.user?.token) {
            return;
        }

        const response = await apiFetch("/entity-table/export/" + entityTableName);
        if (!response.ok) {
            console.error("Table export failed", response.status);
            return;
        }

        const downloadUrl = window.URL.createObjectURL(await response.blob());
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = entityTableName.replace(/[^a-zA-Z0-9._-]/g, "_") + ".xlsx";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000);
    };

    return (
        <Card
            fullWidth={true}
            title={cardTitle && <TextTranslation label={cardTitle} defaultValue={cardTitle}/>}
            titleActions={(
                <div style={{display: "grid", gridTemplateColumns: "auto auto " + (isDev ? "auto" : "") + customControls.map(() => " auto").join(""), gridColumnGap: "8px"}}>
                    {customControls}
                    {isDev && (
                        <Button
                            onClick={async () => {
                                window.localStorage.removeItem(tableName + "_options");
                                window.sessionStorage.removeItem(tableName + "_options");
                                const fetchResult = await apiFetch("/entity-table/structure/" + entityTableName, {cache: "no-store"} );
                                const loadedStructure = await fetchResult.json();
                                setLoadedStructure(loadedStructure);
                                setRenderTable(false);
                            }}
                            style={ButtonStyle.Danger}
                            size={ButtonSizes.Small}
                            rounded={true}
                            bordered={true}
                        >
                            Перезагрузить
                        </Button>
                    )}
                    <Button
                        onClick={showSettings}
                        icon={<VscSettings/>}
                        className={styles.download}
                        style={ButtonStyle.Violet}
                        size={ButtonSizes.Small}
                        rounded={true}
                        bordered={true}
                    >
                        <TextTranslation label="tableOptions" defaultValue="Настройки таблицы"/>
                    </Button>
                    <Button
                        icon={<VscDesktopDownload/>}
                        onClick={() => downloadExport()}
                        className={styles.download}
                        style={ButtonStyle.Info}
                        size={ButtonSizes.Small}
                        rounded={true}
                        bordered={true}
                    >
                        <TextTranslation label="download" defaultValue="Скачать"/>
                    </Button>
                </div>
            )}
            className={styles.entityTablePage}
        >
            <div className={styles.cardContent}>
                {renderTable && sessionStatus === "authenticated" && sessionToken ? (
                    <Table
                        key={sessionToken}
                        adapter={adapter}
                        name={tableName}
                        setShowSettings={showSettings => setShowSettings(() => showSettings)}
                        setJselRef={setJselRef}
                        setRefresh={setRerender}
                        max={max}
                    />
                ) : <BallTriangle height={32}/>}
            </div>
        </Card>
    );
};

export default TableCard;

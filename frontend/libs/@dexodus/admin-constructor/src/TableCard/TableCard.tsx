"use client";

import React, {useRef, useState} from "react";
import styles from "./TableCard.module.scss";
import TextTranslation from "@/libs/@dexodus/translation/src/client/TextTranslation";
import LinkButton from "@/libs/@dexodus/bootstrap/UserInterface/LinkButton";
import {VscDesktopDownload, VscSettings} from "react-icons/vsc";
import Button, {ButtonSizes, ButtonStyle} from "@/libs/@dexodus/bootstrap/UserInterface/Button";
import {getApiDomain} from "@/libs/@dexodus/api-fetch/src/apiFetch";
import Card from "@/libs/@dexodus/bootstrap/UserInterface/Card";
import {EntityTableAdapter, EntityTableStructure} from "@/libs/@dexodus/table/adapter/EntityTableAdapter";
import useApiFetch from "@/libs/@dexodus/api-fetch/src/hooks/useApiFetch";
import {useSession} from "next-auth/react";
import Table from "@/libs/@dexodus/table/Table";

interface TableCardProps {
    cardTitle?: string;
    entityTableStructure: EntityTableStructure;
    entityTableName: string;
    entitiesPath?: string;
    additionalSearchParams?: {};
}

const TableCard: React.FC<TableCardProps> = ({cardTitle, entityTableStructure, entityTableName, entitiesPath, additionalSearchParams = {}}) => {
    const {data: session} = useSession();
    const userName = session?.user.profile.email;
    const apiFetch = useApiFetch();
    const adapter = useRef(new EntityTableAdapter(getApiDomain(), `entity-table/structure/${entityTableName}`, entityTableStructure, apiFetch, entitiesPath && `/api/${entitiesPath}`, additionalSearchParams));
    const [showSettings, setShowSettings] = useState<() => void>(() => {});

    return (
        <Card
            fullWidth={true}
            title={cardTitle && <TextTranslation label={cardTitle} defaultValue={cardTitle}/>}
            titleActions={(
                <div style={{display: "grid", gridTemplateColumns: "auto auto", gridColumnGap: "8px"}}>
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
                    <LinkButton
                        icon={<VscDesktopDownload/>}
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_API_URL}/entity-table/export/${entityTableName}?access_token=${session?.user.token}`}
                        className={styles.download}
                        style={ButtonStyle.Info}
                        size={ButtonSizes.Small}
                        rounded={true}
                        bordered={true}
                    >
                        <TextTranslation label="download" defaultValue="Скачать"/>
                    </LinkButton>
                </div>
            )}
            className={styles.entityTablePage}
        >
            <div className={styles.cardContent}>
                <Table
                    adapter={adapter.current}
                    name={`${userName}_${entitiesPath ? `/api/${entitiesPath}` : `entity-table/structure/${entityTableName}`}`}
                    setShowSettings={showSettings => setShowSettings(() => showSettings)}
                />
            </div>
        </Card>
    );
};

export default TableCard;

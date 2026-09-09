import React from "react";
import EntityForm from "@dexodus/entity-form/src/EntityForm";
import Page, {PageProps} from "../pages/Page";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import TextTranslation from "@/libs/@dexodus/translation/src/server/TextTranslation";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import {auth} from "@/auth";
import PageGasket from "@dexodus/admin-constructor/src/pages/PageGasket";
import {useTranslation} from "@/libs/@dexodus/translation/src/server/hooks/useTranslation";
import styles from "./EntityFormPage.module.scss";

interface EntityFormPageProps extends PageProps {
    options: {
        name: string;
        mode: string;
        path: string;
    };
}

const EntityFormPage: Page<EntityFormPageProps> = async ({options, searchParams}) => {
    let session = null;
    try {
        session = await auth();
    } catch (e) {
        console.error('Auth error in EntityFormPage:', e);
    }

    let structure: any = { fields: [], paths: {} };
    try {
        const apiFetch = await getApiFetch();
        const mode = (searchParams.id !== undefined && searchParams.idColumn !== undefined) ? 'edit' : options.mode;
        const fetchResult = await apiFetch(`/entity-form/structure/${options.name}/${mode}`);
        if (fetchResult.ok) {
            const text = await fetchResult.text();
            const clean = text.replace(/^WARNING:[^\r\n]*\r?\n?/gm, '').trim();
            structure = JSON.parse(clean);
        }
    } catch (e) {
        console.error('Failed to get form structure:', e);
    }

    let defaultEntity: any = undefined;
    const {t} = await useTranslation();

    if (searchParams.id !== undefined && searchParams.idColumn !== undefined && structure.paths?.get) {
        try {
            const apiFetch = await getApiFetch();
            const getEntityResult = await apiFetch(`${structure.paths.get.replace(`{${searchParams.idColumn}}`, searchParams.id)}`);
            if (getEntityResult.ok) {
                const text = await getEntityResult.text();
                const clean = text.replace(/^WARNING:[^\r\n]*\r?\n?/gm, '').trim();
                defaultEntity = JSON.parse(clean);
                if (defaultEntity && defaultEntity['@id']) {
                    defaultEntity[searchParams.idColumn as string] = parseInt(defaultEntity['@id'].split('/').pop());
                }
            }
        } catch (e) {
            console.error('Failed to get default entity:', e);
        }
    }

    return (
        <Card title={<TextTranslation label={`navigation.${options.path}`}/>} contentClassName={styles.entityFormPage}>
            <PageGasket title={t(`navigation.${options.path}`)}>
                <EntityForm structure={structure} defaultEntity={defaultEntity} token={session?.user?.token}/>
            </PageGasket>
        </Card>
    );
};

export default EntityFormPage;

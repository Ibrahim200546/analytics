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
    const session = await auth();
    const apiFetch = await getApiFetch();
    const fetchResult = await apiFetch(`/entity-form/structure/${options.name}/${(searchParams.id !== undefined && searchParams.idColumn !== undefined) ? 'edit' : options.mode}`);
    const structure = await fetchResult.json();
    let defaultEntity: any = undefined;
    const {t} = await useTranslation();

    if (searchParams.id !== undefined && searchParams.idColumn !== undefined) {
        const getEntityResult = await apiFetch(`${structure.paths.get.replace(`{${searchParams.idColumn}}`, searchParams.id)}`);
        defaultEntity = await getEntityResult.json();
        defaultEntity[searchParams.idColumn as string] = parseInt(defaultEntity['@id'].split('/').pop());
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

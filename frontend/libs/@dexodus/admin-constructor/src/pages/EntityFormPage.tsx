import React from "react";
import EntityForm from "@/libs/@dexodus/entity-form/src/EntityForm";
import Page, {PageProps} from "@/libs/@dexodus/admin-constructor/src/pages/Page";
import Card from "@/libs/@dexodus/bootstrap/UserInterface/Card";
import TextTranslation from "@/libs/@dexodus/translation/src/server/TextTranslation";
import getSession from "@/app/lib/actions/getSession";
import getApiFetch from "@/libs/@dexodus/api-fetch/src/server/getApiFetch";

interface EntityFormPageProps extends PageProps {
    options: {
        name: string;
        mode: string;
        path: string;
    };
}

const EntityFormPage: Page<EntityFormPageProps> = async ({options, searchParams}) => {
    const session = await getSession();
    const apiFetch = await getApiFetch();
    const fetchResult = await apiFetch(`/entity-form/structure/${options.name}/${(searchParams.id !== undefined && searchParams.idColumn !== undefined) ? 'edit' : options.mode}`);
    const structure = await fetchResult.json();
    let defaultEntity: any = undefined;

    if (searchParams.id !== undefined && searchParams.idColumn !== undefined) {
        const getEntityResult = await apiFetch(`${structure.paths.get.replace(`{${searchParams.idColumn}}`, searchParams.id)}`);
        defaultEntity = await getEntityResult.json();
        defaultEntity[searchParams.idColumn as string] = parseInt(defaultEntity['@id'].split('/').pop());
    }

    return (
        <Card title={<TextTranslation label={`navigation.${options.path}`}/>}>
            <EntityForm structure={structure} defaultEntity={defaultEntity} token={session?.user?.token}/>
        </Card>
    );
};

export default EntityFormPage;

import EntityForm, {defaultRenderControls, RenderControlsOptions} from "@dexodus/entity-form/src/EntityForm";
import EntityFormStructure from "@dexodus/entity-form/src/EntityFormStructure";
import React, {useEffect, useState} from "react";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import {useSession} from "next-auth/react";
import User from "@/apiTypes/App/Entity/User";
import {ValidateCallback} from "@dexodus/react-form/src/Form";

interface UseEntityFormOptions {
    structure: string|EntityFormStructure;
    defaultEntity?: any;
    renderControls?: (options: RenderControlsOptions) => React.ReactNode;
    onChange?: (data: any) => void;
}

interface UseEntityFormReturn {
    entityForm: undefined | React.ReactNode;
    validate: ValidateCallback;
}

const useEntityForm = ({structure, defaultEntity, renderControls = defaultRenderControls, onChange = () => {}}: UseEntityFormOptions): UseEntityFormReturn => {
    const [entityFormStructure, setEntityFormStructure] = useState<EntityFormStructure | null>(null);
    const [validateCb, setValidateCb] = useState<ValidateCallback>(() => {});
    const apiFetch = useApiFetch();
    const {data} = useSession() as {data: {user: User & {token: string}}};
    let userToken = undefined;

    if (data) {
        userToken = data.user.token;
    }

    useEffect(() => {
        (async () => {
            if (typeof structure === 'string') {
                const structureResponse = await apiFetch(structure);

                if (!structureResponse.ok) {
                    throw new Error(`Can't fetch entity form structure by url "${structure}"`);
                }

                setEntityFormStructure(await structureResponse.json());
            } else {
                setEntityFormStructure(structure);
            }
        })();
    }, [structure]);

    return {
        entityForm: entityFormStructure ? (
            <EntityForm
                structure={entityFormStructure}
                defaultEntity={defaultEntity}
                token={userToken}
                renderControls={renderControls}
                onChange={onChange}
                setValidateCb={setValidateCb}
            />
        ) : undefined,
        validate: validateCb,
    }
}

export default useEntityForm;

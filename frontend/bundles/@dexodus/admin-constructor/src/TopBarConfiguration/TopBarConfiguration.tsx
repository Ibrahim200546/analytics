"use client";

import React from "react";
import styles from "./TopBarConfiguration.module.scss";
import useForm from "@dexodus/react-form/src/hooks/useForm";
import Field from "@dexodus/react-form/src/fields/Field";
import AsyncDropdownField from "@dexodus/bootstrap/src/UserInterface/Fields/AsyncDropdownField";
import {EventType} from "@dexodus/jsel";
import {getCookie, setCookie} from "@dexodus/bootstrap/src/common/cookies";
import {toast} from "react-toastify";
import Organization from "@/apiTypes/App/Entity/Organization";
import {useSession} from "next-auth/react";
import useCheckHavingRole from "@/hooks/useCheckHavingRole";
import HydraCollection from "@/types/HydraCollection";
import Project from "@/apiTypes/App/Entity/Project";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";

interface TopBarConfigurationProps {
    organization?: Organization;
}

const TopBarConfiguration: React.FC<TopBarConfigurationProps> = ({organization}) => {
    const {data} = useSession();
    const isSupervisor = useCheckHavingRole('ROLE_SUPERVISOR');
    const apiFetch = useApiFetch();

    const onChangeOrganization = async (apiId: string) => {
        const organizationId = apiId.split("/").pop() as string;
        if (getCookie(`supervisor-${data?.user?.id}-organization-id`) === organizationId) {
            return;
        }


        const projectListResponse = await apiFetch(`/api/projects/for-my-organization?organizationId=${organizationId}`);

        if (!projectListResponse.ok) {
            toast("Не удалось поменять организацию", {type: "error"});
        }

        const projectHydraCollection: HydraCollection<Project> = await projectListResponse.json();
        const firstProjectId = projectHydraCollection["hydra:member"][0]?.id;

        if (firstProjectId) {
            setCookie(`news-${data?.user?.id}-${organizationId}-project-id`, firstProjectId.toString());
        }

        setCookie(`supervisor-${data?.user?.id}-organization-id`, organizationId);
        toast("Выбранная организация была успешно изменена", {type: "success"});
        window.location.reload();
    };

    const {component: form} = useForm((
        <Field component={AsyncDropdownField} property="selectedOrganization" label="" componentProps={{
            url: "/api/organizations/my",
            label: "name",
        }}/>
    ), {selectedOrganization: organization ?? ""}, jselRef => {
        jselRef.current?.addEventListener(EventType.ASSIGN, event => {
            if ("value" in event) {
                onChangeOrganization(event.value).then();
            }
        });
    });

    return (
        <div className={styles.topBarConfiguration}>
            {isSupervisor && (
                <>
                    {form}
                </>
            )}
        </div>
    );
};

export default TopBarConfiguration;

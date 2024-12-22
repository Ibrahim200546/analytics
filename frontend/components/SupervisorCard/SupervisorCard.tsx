"use client";

import React, {useState} from "react";
import styles from "./SupervisorCard.module.scss";
import Organization from "@/apiTypes/App/Entity/Organization";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import Button, {ButtonSizes, ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import useModal from "@dexodus/bootstrap/src/UserInterface/Modal/useModal";
import {ModalSize} from "@dexodus/bootstrap/src/UserInterface/Modal/Modal";
import useForm from "@dexodus/react-form/src/hooks/useForm";
import Field from "@dexodus/react-form/src/fields/Field";
import "../../hooks/useUserForm.css";
import notBlank from "@dexodus/react-form/src/validators/notBlank";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useRouter} from "next/navigation";
import AsyncDropdownField from "@dexodus/bootstrap/src/UserInterface/Fields/AsyncDropdownField";
import useUserForm from "@/hooks/useUserForm";
import useConfirmForm from "@/hooks/useConfirmForm";
import useCombineLoading from "@/hooks/useCombineLoading";

interface SupervisorCardProps {
    organization: Organization;
}

const SupervisorCard: React.FC<SupervisorCardProps> = ({organization}) => {
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [loading, setLoading] = useState<boolean>(false);
    const apiFetch = useApiFetch();
    const router = useRouter();
    const supervisor = organization.supervisor;
    const {form: userForm, show: showUserForm, hide: hideUserForm, loading: loadingUserForm, jselRef: userFormJselRef} = useUserForm(mode, {
        saveUrl: mode === "create" ? `/api/users/create-supervisor?organizationId=${organization.id}` : `/api/users/edit-supervisor/${supervisor?.id}`,
        toastWhenSaved: mode === "create" ? "Руководитель был успешно создан" : "Данные руководителя были успешно изменены",
        toastWhenSaveFailed: `Не удалось ${mode === "create" ? "создать" : "изменить данные"} руководителя`,
        modalHeader: (
            <>
                <span>{mode === "create" ? "Создание" : "Изменение данных"} руководителя {mode === "create" ? "для " : ""}организации "</span>
                <span className="brand-color">{organization.name}</span>
                <span>"</span>
            </>
        ),
        actionAfterSaving: () => router.refresh(),
    });

    const {
        data: selectSupervisorData,
        component: selectSupervisorComponent,
        validate: validateSelectSupervisor,
    } = useForm((
        <>
            <Field component={AsyncDropdownField} property="supervisor" label="Руководитель"
                   validators={[notBlank("Необходимо выбрать руководителя")]} componentProps={{
                search: "",
                url: "/api/users/supervisors",
                label: "lastName + \" \" + firstName + \" \" + patronymic + \"(ИИН: \" + iin + \")\"",
            }}/>
        </>
    ));

    const {modal: selectSupervisorModal, show: showSelectSupervisorModal, hide: hideSelectSupervisorModal} = useModal((
        <div>
            {selectSupervisorComponent}
        </div>
    ), (
        <h2>
            <span>Выбор руководителя для организации "</span>
            <span className="brand-color">{organization.name}</span>
            <span>"</span>
        </h2>
    ), ({close}) => (
        <div className={styles.controls}>
            <Button className={styles.control} style={ButtonStyle.Success}
                    onClick={() => validateSelectSupervisor(async () => {
                        setLoading(true);
                        hideSelectSupervisorModal();
                        const changeResponse = await apiFetch(`/api/organizations/set-supervisor/${organization.id}`, {
                            method: "PUT",
                            body: JSON.stringify({
                                supervisor: selectSupervisorData.supervisor,
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });

                        if (changeResponse.ok) {
                            toast(`Руководитель был успешно выбран`, {type: "success"});
                            router.refresh();
                        } else {
                            toast(`Не удалось выбрать руководителя`, {type: "error"});
                        }
                        setLoading(false);
                    })}>
                Выбрать
            </Button>
            <Button className={styles.control} onClick={close}>Закрыть</Button>
        </div>
    ), ModalSize.Large);

    const {form: deleteForm, show: showDeleteForm, loading: loadingDeleteForm} = useConfirmForm({
        modalHeader: (
            <>
                <span>Удаление руководителя из этой организации "</span>
                <span className="brand-color">{organization.name}</span>
                <span>"</span>
            </>
        ),
        modalContent: 'Вы уверены что хотите убрать руководителя в этой организации?',
        confirmButtonContent: 'Убрать руководителя',
        actionAfterConfirm: async () => {
            const removeResponse = await apiFetch(`/api/users/remove-supervisor/${supervisor?.id}?organizationId=${organization.id}`, {
                method: "DELETE",
            });

            if (removeResponse.ok) {
                toast(`Руководитель был успешно убран из этой организации`, {type: "success"});
                router.refresh();
            } else {
                toast(`Не удалось убрать руководителя с организации `, {type: "error"});
            }
        },
    });

    const combinedLoading = useCombineLoading([loadingDeleteForm, loadingUserForm, loading])

    return (
        <Card title="Руководитель" className={styles.supervisorCard}>
            {supervisor ? (
                <div className={styles.cardContent}>
                    <ul>
                        <li><b>ФИО: </b><i>{supervisor.lastName} {supervisor.firstName} {supervisor.patronymic}</i></li>
                        <li><b>ИИН: </b><i>{supervisor.iin}</i></li>
                        <li><b>Эл. почта: </b><i>{supervisor.email}</i></li>
                    </ul>
                    <div className={styles.controls}>
                        <Button isLoading={combinedLoading} className={styles.control} style={ButtonStyle.Success} onClick={() => {
                            setMode("edit");
                            if (userFormJselRef.current) {
                                userFormJselRef.current.assign("data", {...supervisor, plainPassword: ""});
                            }
                            showUserForm();
                        }}>
                            Изменить данные руководителя
                        </Button>
                        <Button isLoading={combinedLoading} className={styles.control} style={ButtonStyle.Danger} onClick={showDeleteForm}>
                            Убрать руководителя с этой организации
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={styles.cardContent}>
                    <p className="secondary-color">Руководитель не назначен</p>
                    <div className={styles.controls}>
                        <Button isLoading={combinedLoading} className={styles.control} style={ButtonStyle.Violet}
                                onClick={() => showSelectSupervisorModal()}>
                            Выбрать уже существующего
                        </Button>
                        <Button isLoading={combinedLoading} className={styles.control} style={ButtonStyle.Success}
                                onClick={() => {
                                    setMode('create');
                                    showUserForm();
                                }}>
                            Создать нового руководителя
                        </Button>
                    </div>
                </div>
            )}
            {userForm}
            {selectSupervisorModal}
            {deleteForm}
        </Card>
    );
};

export default SupervisorCard;

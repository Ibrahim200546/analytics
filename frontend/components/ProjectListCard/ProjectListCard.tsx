"use client";

import React, {useRef, useState} from "react";
import {EntityTableStructure} from "@dexodus/table/src/adapter/EntityTableAdapter";
import TableCard from "@dexodus/admin-constructor/src/TableCard";
import Organization from "@/apiTypes/App/Entity/Organization";
import Button, {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import {AiOutlineFileAdd} from "react-icons/ai";
import useModal from "@dexodus/bootstrap/src/UserInterface/Modal/useModal";
import styles from "./ProjectListCard.module.scss";
import useForm from "@dexodus/react-form/src/hooks/useForm";
import Field from "@dexodus/react-form/src/fields/Field";
import StringField from "@dexodus/bootstrap/src/UserInterface/Fields/StringField";
import notBlank from "@dexodus/react-form/src/validators/notBlank";
import {ModalSize} from "@dexodus/bootstrap/src/UserInterface/Modal/Modal";
import arrayNotEmpty from "@dexodus/react-form/src/validators/arrayNotEmpty";
import TagsField from "@dexodus/bootstrap/src/UserInterface/Fields/TagsField";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Jsel} from "@dexodus/jsel";
import {TailSpin} from "react-loader-spinner";

interface ProjectListCardProps {
    organization: Organization;
    projectStructure: EntityTableStructure;
}

const ProjectListCard: React.FC<ProjectListCardProps> = ({organization, projectStructure}) => {
    const [deleteId, setDeleteId] = useState<number>(-1);
    const [rerenderTable, setRerenderTable] = useState<() => void>(() => {});
    const [loading, setLoading] = useState<boolean>(false);

    const apiFetch = useApiFetch();
    const createDefaultProject = () => ({name: '', tags: []})

    const [mode, setMode] = useState<"create" | "edit">("create");
    const {component: projectForm, data, jselRef, validate} = useForm((
        <>
            <Field component={StringField} property='name' label="Имя проекта" validators={[notBlank('Поле должно быть заполнено')]}/>
            <Field component={TagsField} property='tags' label="Тэги" validators={[arrayNotEmpty('Поле должно быть заполнено')]}/>
        </>
    ), createDefaultProject())

    const {modal: projectModal, show: showProjectModal, hide: hideProjectModal} = useModal((
        <div>
            {loading ? <TailSpin/> : projectForm}
        </div>
    ), (
        <h2>
            <span>{mode === 'create' ? "Добавление" : "Корректировка"}</span>
            <span> проекта для организации "</span>
            <span className="brand-color">{organization.name}</span>
            <span>"</span>
        </h2>
    ), ({close}) => (
        <div className={styles.modalControls}>
            <Button style={ButtonStyle.Success} isLoading={loading} onClick={() => validate(async () => {
                setLoading(true);
                hideProjectModal();
                const createResponse = await apiFetch(mode === 'create' ? '/api/projects' : `/api/projects/${data.id}`, {
                    method: mode === 'create' ? 'POST' : 'PUT',
                    body: JSON.stringify({
                        ...data,
                        organization: `/api/organizations/${organization.id}`
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (createResponse.ok) {
                    toast(`Проект был успешно ${mode === 'create' ? 'создан' : 'изменён'}`, {type: "success"});
                    if (jselRef.current) {
                        jselRef.current.assign('data', createDefaultProject())
                    }
                    rerenderTable();
                } else {
                    toast(`Не удалось ${mode === 'create' ? 'создать' : 'изменить'} проект`, {type: "error"});
                }
                setLoading(false);
            })}>{mode === 'create' ? 'Создать' : 'Изменить'} проект</Button>
            <Button onClick={close} isLoading={loading}>Закрыть</Button>
        </div>
    ), ModalSize.Large);

    const {modal: deleteModal, show: showDeleteModal, hide: hideDeleteModal} = useModal((
        <div>
            Вы уверены что хотите удалить проект без возможности восстановления?
        </div>
    ), (
        <h2>
            <span>Удаление проекта для организации "</span>
            <span className="brand-color">{organization.name}</span>
            <span>"</span>
        </h2>
    ), ({close}) => (
        <div className={styles.modalControls}>
            <Button
                onClick={() => {
                    (async () => {
                        setLoading(true);
                        hideDeleteModal();
                        const deleteProjectResponse = await apiFetch(`/api/projects/${deleteId}`, {
                            method: "DELETE",
                        });
                        if (deleteProjectResponse.ok) {
                            toast(`Проект был удален`, {type: "success"});
                            rerenderTable();
                        } else {
                            toast(`Не удалось удалить проект`, {type: "error"});
                        }
                        setLoading(false);
                    })().then();
                }}
                style={ButtonStyle.Danger}
                isLoading={loading}
            >
                Удалить проект
            </Button>
            <Button onClick={close}>Закрыть</Button>
        </div>
    ), ModalSize.Large)

    return (
        <div className={styles.projectListCard}>
            <TableCard
                max={organization.limitProjects}
                entityTableStructure={projectStructure}
                entityTableName={`admin.projects.${organization.id}`}
                cardTitle="Проекты"
                entitiesPath="projects.jsonld"
                additionalSearchParams={{organization: organization.id}}
                customControls={[
                    <Button isLoading={loading} onClick={() => {
                        showProjectModal();
                        setMode('create');
                        jselRef.current?.assign('data', createDefaultProject());
                    }} icon={<AiOutlineFileAdd/>} style={ButtonStyle.Success} rounded={true} bordered={true}>Добавить новый проект</Button>
                ]}
                setRerender={setRerenderTable}
                setJselRef={tableJselRef => {
                    if (tableJselRef.current) {
                        const tableJsel = tableJselRef.current as Jsel;
                        tableJsel.assign('showEditProjectModal', (id: number) => {
                            (async () => {
                                showProjectModal();
                                setLoading(true);
                                setMode('edit');
                                if (jselRef.current) {
                                    const formJsel = jselRef.current;
                                    formJsel.assign('data', createDefaultProject());
                                    const viewProjectResponse = await apiFetch(`/api/projects/${id}.jsonld`);

                                    if (!viewProjectResponse.ok) {
                                        toast(`Не удалось загрузить проект`, {type: "error"});
                                        setLoading(false);
                                        hideProjectModal();
                                        return;
                                    }

                                    formJsel.assign('data', await viewProjectResponse.json())
                                }
                                setLoading(false);
                            })();
                        })
                        tableJsel.assign('showDeleteProjectModal', (id: number) => {
                            (async () => {
                                showDeleteModal();
                                setDeleteId(id);
                            })();
                        })
                    }
                }}
            />
            {projectModal}
            {deleteModal}
        </div>
    );
};

export default ProjectListCard;

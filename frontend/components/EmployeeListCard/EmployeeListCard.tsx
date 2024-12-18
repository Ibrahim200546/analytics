"use client";

import React, {useState} from "react";
import Organization from "@/apiTypes/App/Entity/Organization";
import TableCard from "@dexodus/admin-constructor/src/TableCard";
import {EntityTableStructure} from "@dexodus/table/src/adapter/EntityTableAdapter";
import Button, {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import {AiOutlineUser} from "react-icons/ai";
import useUserForm, {createEmptyUser} from "@/hooks/useUserForm";
import {Jsel} from "@dexodus/jsel";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCombineLoading from "@/hooks/useCombineLoading";
import useConfirmForm from "@/hooks/useConfirmForm";

interface EmployeeListCardProps {
    organization: Organization;
    employeeStructure: EntityTableStructure;
}

const EmployeeListCard: React.FC<EmployeeListCardProps> = ({organization, employeeStructure}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [currentUserId, setCurrentUserId] = useState<number>(-1);
    const [rerenderTable, setRerenderTable] = useState<() => void>(() => {});
    const apiFetch = useApiFetch();

    const {form: userForm, show: showUserForm, hide: hideUserForm, loading: loadingUserForm, jselRef: userFormJselRef} = useUserForm(mode, {
        saveUrl: mode === "create" ? `/api/users/create-employee?organizationId=${organization.id}` : `/api/users/edit-employee/${currentUserId}`,
        toastWhenSaved: mode === "create" ? "Сотрудник был успешно создан" : "Данные сотрудника были успешно изменены",
        toastWhenSaveFailed: `Не удалось ${mode === "create" ? "создать" : "изменить данные"} сотрудника`,
        modalHeader: (
            <>
                <span>{mode === "create" ? "Создание" : "Изменение данных"} сотрудника {mode === "create" ? "для " : ""}организации "</span>
                <span className="brand-color">{organization.name}</span>
                <span>"</span>
            </>
        ),
        actionAfterSaving: () => rerenderTable(),
    });

    const {form: deleteForm, show: showDeleteForm, loading: loadingDeleteForm} = useConfirmForm({
        modalHeader: (
            <>
                <span>Удаление сотрудника из этой организации "</span>
                <span className="brand-color">{organization.name}</span>
                <span>"</span>
            </>
        ),
        modalContent: 'Вы уверены что хотите удалить сотрудника?',
        confirmButtonContent: 'Удалить сотрудника',
        actionAfterConfirm: async () => {
            const removeResponse = await apiFetch(`/api/users/remove-employee/${currentUserId}`, {
                method: "DELETE",
            });

            if (removeResponse.ok) {
                toast(`Сотрудник был успешно удалён`, {type: "success"});
                rerenderTable();
            } else {
                toast(`Не удалось удалить сотрудника `, {type: "error"});
            }
        },
    });

    const combinedLoading = useCombineLoading([loading, loadingUserForm, loadingDeleteForm]);

    return (
        <div>
            <TableCard
                cardTitle={'Сотрудники'}
                max={organization.limitEmployees}
                entityTableStructure={employeeStructure}
                entityTableName={`admin.organization.${organization.id}.employees`}
                entitiesPath={"users/employees"}
                additionalSearchParams={{organizationId: organization.id}}
                setRerender={setRerenderTable}
                customControls={[
                    <Button
                        isLoading={combinedLoading}
                        onClick={() => {
                            setMode("create");
                            showUserForm();
                        }}
                        icon={<AiOutlineUser/>}
                        style={ButtonStyle.Success}
                        rounded={true}
                        bordered={true}
                    >
                        Добавить нового сотрудника
                    </Button>,
                ]}
                setJselRef={tableJselRef => {
                    if (tableJselRef.current) {
                        const tableJsel = tableJselRef.current as Jsel;
                        tableJsel.assign('showEditModal', (id: number) => {
                            (async () => {
                                showUserForm();
                                setLoading(true);
                                setMode('edit');

                                if (userFormJselRef.current) {
                                    const formJsel = userFormJselRef.current;
                                    formJsel.assign('data', createEmptyUser());
                                    const viewProjectResponse = await apiFetch(`/api/users/employees/${id}`);

                                    if (!viewProjectResponse.ok) {
                                        toast(`Не удалось загрузить данные сотрудника`, {type: "error"});
                                        setLoading(false);
                                        hideUserForm();
                                        return;
                                    }

                                    setCurrentUserId(id);
                                    userFormJselRef.current.assign('data', {...(await viewProjectResponse.json()), plainPassword: ''});
                                }
                                setLoading(false);
                            })();
                        })
                        tableJsel.assign('showDeleteModal', (id: number) => {
                            (async () => {
                                showDeleteForm();
                                setCurrentUserId(id);
                            })();
                        })
                    }
                }}
            />
            {userForm}
            {deleteForm}
        </div>
    );
};

export default EmployeeListCard;

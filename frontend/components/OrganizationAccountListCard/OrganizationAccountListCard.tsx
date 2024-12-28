"use client";

import React, {useState} from "react";
import styles from "./OrganizationAccountListCard.module.scss";
import TableCard from "@dexodus/admin-constructor/src/TableCard";
import {EntityTableStructure} from "@dexodus/table/src/adapter/EntityTableAdapter";
import Organization from "@/apiTypes/App/Entity/Organization";
import Button, {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import {AiOutlineUser} from "react-icons/ai";
import useModal from "@dexodus/bootstrap/src/UserInterface/Modal/useModal";
import useForm from "@dexodus/react-form/src/hooks/useForm";
import Field from "@dexodus/react-form/src/fields/Field";
import DropdownField from "@dexodus/bootstrap/src/UserInterface/Fields/DropdownField";
import CreateTelegramAccountForm from "@/components/CreateTelegramAccountForm";
import {ModalSize} from "@dexodus/bootstrap/src/UserInterface/Modal/Modal";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import EntityFormStructure from "@dexodus/entity-form/src/EntityFormStructure";
import notBlank from "@dexodus/react-form/src/validators/notBlank";

interface OrganizationAccountListCardProps {
    organization: Organization;
    organizationAccountStructure: EntityTableStructure;
    telegramAccountStructure: EntityFormStructure;
}

interface CreateAccountData {
    type?: {key: 'Telegram', value: 'Telegram аккаунт'};
}

const OrganizationAccountListCard: React.FC<OrganizationAccountListCardProps> = ({organization, organizationAccountStructure, telegramAccountStructure}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showQRCode, setShowQRCode] = useState<() => void>(() => {});
    const [rerenderTable, setRerenderTable] = useState<() => void>(() => {});
    const apiFetch = useApiFetch();
    const {component: createAccountForm, data: createAccountData, validate: validateCreateAccountData} = useForm<CreateAccountData>((
        <div>
            <Field component={DropdownField} property="type" label="Тип аккаунта" validators={[notBlank('Поле должно быть заполнено')]} componentProps={{
                options: {
                    Telegram: 'Telegram аккаунт',
                }
            }}/>
        </div>
    ))

    const addAccount = () => {
        if (createAccountData.type?.key === "Telegram") {
            setLoading(true);
            showQRCode();
        }
    }

    const onCreatedTelegramAccount = (id: number, name: string) => {
        (async () => {
            await apiFetch(`/api/organization_accounts`, {
                method: 'POST',
                body: JSON.stringify({
                    organization: `/api/organizations/${organization.id}`,
                    parserName: 'Telegram',
                    accountName: name,
                    options: {telegramAccountId: id},
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            hideCreateAccountModal();
            setLoading(false);
        })();
    }

    const {modal: createAccountModal, show: showCreateAccountModal, hide: hideCreateAccountModal} = useModal((
        <div>
            {createAccountForm}
            {createAccountData.type?.key === "Telegram" && (
                <CreateTelegramAccountForm
                    structure={telegramAccountStructure}
                    setShowQRCode={setShowQRCode}
                    onCreatedTelegramAccount={onCreatedTelegramAccount}
                    onFailure={() => setLoading(false)}
                />
            )}
        </div>
    ), (
        <h2>Добавить новый аккаунт</h2>
    ), ({close}) => (
        <div className={styles.modalControls}>
            <Button style={ButtonStyle.Success} onClick={() => validateCreateAccountData(() => addAccount())} isLoading={loading}>
                Добавить
            </Button>
            <Button onClick={close} isLoading={loading}>
                Закрыть
            </Button>
        </div>
    ), ModalSize.Large);

    return (
        <div className={styles.organizationAccountListCard}>
            <TableCard
                cardTitle="Аккаунты"
                entityTableName={`admin.organization.${organization.id}.organization-account`}
                entityTableStructure={organizationAccountStructure}
                setRerender={setRerenderTable}
                additionalSearchParams={{organization: organization.id}}
                customControls={[
                    <Button
                        onClick={showCreateAccountModal}
                        icon={<AiOutlineUser/>}
                        style={ButtonStyle.Success}
                        rounded={true}
                        bordered={true}
                    >
                        Добавить новый аккаунт
                    </Button>,
                ]}
            />
            {createAccountModal}
        </div>
    );
};

export default OrganizationAccountListCard;

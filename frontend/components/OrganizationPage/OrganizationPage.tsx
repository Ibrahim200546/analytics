"use client";

import React from "react";
import styles from "./OrganizationPage.module.scss";
import Organization from "@/apiTypes/App/Entity/Organization";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import moment from "moment";
import "moment/locale/ru";
import SubscriptionCard from "@/components/SubscriptionCard";
import ProjectListCard from "@/components/ProjectListCard";
import {EntityTableStructure} from "@dexodus/table/src/adapter/EntityTableAdapter";
import EmployeeListCard from "@/components/EmployeeListCard";
import SupervisorCard from "@/components/SupervisorCard";
import useCheckHavingRole from "@/hooks/useCheckHavingRole";
import OrganizationAccountListCard from "@/components/OrganizationAccountListCard";
import EntityFormStructure from "@dexodus/entity-form/src/EntityFormStructure";

interface OrganizationPageProps {
    organization: Organization;
    projectStructure: EntityTableStructure;
    employeeStructure: EntityTableStructure;
    organizationAccountStructure: EntityTableStructure;
    telegramAccountStructure: EntityFormStructure;
}

const OrganizationPage: React.FC<OrganizationPageProps> = ({organization, projectStructure, employeeStructure, organizationAccountStructure, telegramAccountStructure}) => {
    const isAdmin = useCheckHavingRole('ROLE_ADMIN');

    return (
        <div className={styles.organizationPage}>
            <div className={styles.twoCardsInline}>
                <Card title="Информация об организации">
                    <ul>
                        <li>
                            <b>Организация была добавлена:</b> <i>{moment(organization.createdAt).fromNow()}</i>
                        </li>
                        <li>
                            <b>БИН организации:</b> <i>{organization.bin}</i>
                        </li>
                        <li>
                            <b>Расположение:</b> <i>{organization.city?.district?.region?.name}, {organization.city?.district?.name}, {organization.city?.name}</i>
                        </li>
                    </ul>
                </Card>
                <SubscriptionCard subscription={organization.subscription} organization={organization}/>
            </div>
            <ProjectListCard organization={organization} projectStructure={projectStructure}/>
            {isAdmin ? (
                <div className={styles.twoCardsInline}>
                    <SupervisorCard organization={organization}/>
                    <EmployeeListCard organization={organization} employeeStructure={employeeStructure}/>
                </div>
            ) : (
                <div className={styles.oneCardInline}>
                    <EmployeeListCard organization={organization} employeeStructure={employeeStructure}/>
                </div>
            )}
            <OrganizationAccountListCard organization={organization} organizationAccountStructure={organizationAccountStructure} telegramAccountStructure={telegramAccountStructure}/>
        </div>
    );
};

export default OrganizationPage;

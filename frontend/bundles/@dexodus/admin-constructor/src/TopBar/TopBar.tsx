import React from "react";
import styles from "./TopBar.module.scss"
import UserMenu from "../UserMenu";
import {auth, signOut} from "@/auth";
import TobBarTitle from "../TopBarTitle"
import TopBarConfiguration from "../TopBarConfiguration"
import {cookies} from "next/headers";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import Organization from "@/apiTypes/App/Entity/Organization";

interface TopBarProps {
}

const TopBar = async () => {
    const apiFetch = await getApiFetch();
    const cookiesStore = await cookies();
    const session = await auth();
    const user = session?.user;

    const organizationId = cookiesStore.get(`supervisor-${user?.id}-organization-id` as any)?.value;
    let organization: Organization | undefined = undefined;

    if (organizationId) {
        const organizationViewResponse = await apiFetch(`/api/organizations/${organizationId}`);

        if (organizationViewResponse.ok) {
            organization = await organizationViewResponse.json();
        }
    }

    const logout = async () => {
        "use server"
        await signOut();
    }

    return (
        <div className={styles.topBar}>
            <TobBarTitle/>
            <div className={styles.rightPartWrapper}>
                <div className={styles.rightPart}>
                    <UserMenu logout={logout}/>
                    <TopBarConfiguration organization={organization}/>
                </div>
            </div>
        </div>
    );
};

export default TopBar;

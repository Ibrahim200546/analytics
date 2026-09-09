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
    let session = null;
    try {
        session = await auth();
    } catch (e) {
        console.error('Auth error in TopBar:', e);
    }
    const user = session?.user;
    let organization: Organization | undefined = undefined;

    try {
        const apiFetch = await getApiFetch();
        const cookiesStore = await cookies();
        const organizationId = cookiesStore.get(`supervisor-${user?.id}-organization-id` as any)?.value;

        if (organizationId) {
            const organizationViewResponse = await apiFetch(`/api/organizations/${organizationId}`);

            if (organizationViewResponse.ok) {
                const text = await organizationViewResponse.text();
                const clean = text.replace(/^WARNING:[^\r\n]*\r?\n?/gm, '').trim();
                organization = JSON.parse(clean);
            }
        }
    } catch (e) {
        console.error('Error loading organization in TopBar:', e);
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

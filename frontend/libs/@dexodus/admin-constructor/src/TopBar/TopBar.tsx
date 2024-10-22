import React from "react";
import styles from "./TopBar.module.scss"
import UserMenu from "@/libs/@dexodus/admin-constructor/src/UserMenu";
import {auth} from "@/auth";

interface TopBarProps {
    currentPageName?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = async ({currentPageName}) => {
    const session = await auth();

    return (
        <div className={styles.topBar}>
            <span className={styles.currentPageName}>{currentPageName}</span>
            <div className={styles.rightPartWrapper}>
                <div className={styles.rightPart}>
                    <UserMenu/>
                </div>
            </div>
        </div>
    );
};

export default TopBar;

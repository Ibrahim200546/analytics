"use client";

import React from "react";
import styles from "./TopBarTitle.module.scss";
import classnames from "classnames";
import {VscChevronLeft} from "react-icons/vsc";
import {useRouter} from "next/navigation";

interface TopBarTitleProps {
}

const TopBarTitle: React.FC<TopBarTitleProps> = ({}) => {
    const router = useRouter();

    return (
        <div className={styles.topBarTitle}>
            <div className={styles.back} onClick={() => router.back()}>
                <VscChevronLeft/>
            </div>
            <span className={classnames("page-title", styles.title)}></span>
        </div>
    );
};

export default TopBarTitle;

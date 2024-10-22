"use client"

import styles from './SideBar.module.scss'
import Navigation from "@/libs/@dexodus/admin-constructor/src/Navigation";
import React from "react";
import classNames from "classnames";
import useAdminConstructorSelector from "@/libs/@dexodus/admin-constructor/src/hooks/redux/useAdminConstructorSelector";
import ClientTextTranslation from "@/libs/@dexodus/translation/src/client/TextTranslation";
import Link from "next/link";
import {IoLogOutOutline} from "react-icons/io5";
import {useRouter} from "next/navigation";
import {logout} from "@/app/lib/actions/logout";

interface SideBarProps {
    navigation: any;
    slug: string[];
}

const SideBar: React.FC<SideBarProps> = ({navigation, slug}) => {
    const sideBarClosed = useAdminConstructorSelector(state => state.sideBarClosed);
    const navigationPath = useAdminConstructorSelector(state => state.navigationPath);

    const router = useRouter();
    const signOut = () => {
        (async () => {
            await logout();
            router.refresh();
        })()
    }

    return (
        <div className={classNames(styles.sideBar, sideBarClosed && styles.closed)}>
            <Link href="/main" className={styles.projectName}>
                <ClientTextTranslation label={'projectName'} defaultValue={'Exchange Rates'}/>
            </Link>
            <Navigation rootItem={navigation} autoOpenPath={slug.join('.')}/>
            <Link href="/logout" className={styles.logout} onClick={event => {
                event.preventDefault();
                signOut();
            }}>
                <IoLogOutOutline/>
                <ClientTextTranslation label={'logout'} defaultValue={'Выйти'}/>
            </Link>
        </div>
    )
}

export default SideBar;

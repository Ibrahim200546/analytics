'use client'

import React, {useRef, useState} from "react";
import styles from "./UserMenu.module.scss"
import {VscChevronDown, VscChevronUp} from "react-icons/vsc";
import Popup from "@/libs/@dexodus/admin-constructor/src/Popup";
import Link from "next/link";
import {logout} from "@/app/lib/actions/logout";
import useOnClickInDocument from "@/libs/@dexodus/bootstrap/hooks/useOnClickInDocument";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import Image from "next/image";

interface UserMenuProps {
}

const UserMenu: React.FC<UserMenuProps> = () => {
    const [menuOpened, setMenuOpened] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const {data} = useSession();
    useOnClickInDocument([divRef], () => setMenuOpened(false));

    const toggleMenu = () => {
        setMenuOpened(menuOpened => !menuOpened);
    }

    const signOut = () => {
        (async () => {
            await logout();
            window.sessionStorage.clear();
            router.refresh();
        })()
    }

    return (
        <div className={styles.userMenu} onClick={toggleMenu} ref={divRef}>
            <Popup className={styles.popup} hidden={!menuOpened}>
                <button onClick={signOut}>
                    Выйти
                </button>
            </Popup>
            <div className={styles.content}>
                <div className={styles.avatar}>
                    <Image width={50} height={50} src="/images/avatar.png" alt="/images/avatar.png"/>
                </div>
                <div className={styles.name}>
                    <span className={styles.email}>
                        {data?.user?.profile?.email}
                    </span>
                    {data?.user?.profile?.roles?.includes('ROLE_ADMIN') && (
                        <span className={styles.email}>
                            <i>Администратор</i>
                        </span>
                    )}
                </div>
            </div>
            <span className={styles.chevronUp}>
                {menuOpened ? <VscChevronUp/> : <VscChevronDown/>}
            </span>
        </div>
    )
}

export default UserMenu;

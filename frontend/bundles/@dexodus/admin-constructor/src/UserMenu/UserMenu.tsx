'use client'

import React, {useRef, useState} from "react";
import styles from "./UserMenu.module.scss"
import {VscChevronDown, VscChevronUp} from "react-icons/vsc";
import Popup from "../Popup";
import useOnClickInDocument from "@dexodus/bootstrap/src/hooks/useOnClickInDocument";
import {useSession} from "next-auth/react";
import {FaUser} from "react-icons/fa";
import User from "@/apiTypes/App/Entity/User";

interface UserMenuProps {
    logout: () => Promise<void>
}

const UserMenu: React.FC<UserMenuProps> = ({logout}) => {
    const [menuOpened, setMenuOpened] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const {data} = useSession();
    const user = data?.user as (User | undefined);
    useOnClickInDocument([divRef], () => setMenuOpened(false));

    const toggleMenu = () => {
        setMenuOpened(menuOpened => !menuOpened);
    }

    return (
        <div className={styles.userMenu} onClick={toggleMenu} ref={divRef}>
            <Popup className={styles.popup} hidden={!menuOpened}>
                <button onClick={logout}>
                    Выйти
                </button>
            </Popup>
            <div className={styles.content}>
                <div className={styles.avatar}>
                    <FaUser/>
                </div>
                <div className={styles.name}>
                    <span className={styles.fullname}>
                        {user?.lastName} {user?.firstName} {user?.patronymic}
                    </span>
                    <span className={styles.email}>
                        {data?.user?.email}
                    </span>
                    {user?.roles?.includes('ROLE_ADMIN') && (
                        <span className={styles.role}>Администратор</span>
                    )}
                    {user?.roles?.includes('ROLE_SUPERVISOR') && (
                        <span className={styles.role}>Руководитель</span>
                    )}
                    {user?.roles?.includes('ROLE_EMPLOYEE') && (
                        <span className={styles.role}>Сотрудник</span>
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

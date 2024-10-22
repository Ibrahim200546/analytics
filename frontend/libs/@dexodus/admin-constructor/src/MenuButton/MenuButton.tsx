'use client'

import React from "react";
import styles from "./MenuButton.module.scss"
import classNames from "classnames";
import useAdminConstructorDispatch from "@/libs/@dexodus/admin-constructor/src/hooks/redux/useAdminConstructorDispatch";
import useAdminConstructorSelector from "@/libs/@dexodus/admin-constructor/src/hooks/redux/useAdminConstructorSelector";
import {AdminConstructorSlice} from "@/libs/@dexodus/admin-constructor/src/redux/adminConstructorReducer";
interface MenuButtonProps {
    className?: string;
    color?: string;
    size: number;
}

const MenuButton: React.FC<MenuButtonProps> = (
    {className, size, color = '#000'}
) => {
    const dispatch = useAdminConstructorDispatch();
    const closed = useAdminConstructorSelector(state => state.sideBarClosed);
    const onClick = () => {
        dispatch(AdminConstructorSlice.actions.AdminConstructorChangeSideBarClosed(!closed));
    }

    return (
        <div className={classNames(className, styles.menuButton)} style={{width: size, height: size * 0.7}} onClick={() => onClick()}>
            <div className={classNames(styles.line, styles.line1, !closed && styles.closed)} style={{background: color}}/>
            <div className={classNames(styles.line, styles.line2, !closed && styles.closed)} style={{background: color}}/>
            <div className={classNames(styles.line, styles.line3, !closed && styles.closed)} style={{background: color}}/>
        </div>
    )
}

export default MenuButton;

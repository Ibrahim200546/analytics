"use client";

import React, {useEffect} from "react";
import styles from "./SetDefaultNavigation.module.scss";
import useAdminConstructorDispatch from "@/libs/@dexodus/admin-constructor/src/hooks/redux/useAdminConstructorDispatch";
import {AdminConstructorSlice} from "@/libs/@dexodus/admin-constructor/src/redux/adminConstructorReducer";

interface SetDefaultNavigationProps {
    path: string;
}

const SetDefaultNavigation: React.FC<SetDefaultNavigationProps> = ({path}) => {
    const dispatch = useAdminConstructorDispatch();

    useEffect(() => {
       dispatch(AdminConstructorSlice.actions.AdminConstructorChangeNavigation(path));
       dispatch(AdminConstructorSlice.actions.AdminConstructorChangeCurrentPage(path));
    });

    return (
        <></>
    );
};

export default SetDefaultNavigation;

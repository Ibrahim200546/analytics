"use client";

import React, {useEffect} from "react";
import useAdminConstructorDispatch from "../hooks/redux/useAdminConstructorDispatch";
import {AdminConstructorSlice} from "../redux/adminConstructorReducer";

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

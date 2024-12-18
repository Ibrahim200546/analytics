'use client'

import React, {useRef} from "react";
import {AdminConstructorStore, makeStore} from "../store/store";
import {Provider} from "react-redux";

interface AdminConstructorStoreProviderProps {
    children: React.ReactNode;
}

const AdminConstructorStoreProvider: React.FC<AdminConstructorStoreProviderProps> = ({children}) => {
    const storeRef = useRef<AdminConstructorStore>();

    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}

export default AdminConstructorStoreProvider;

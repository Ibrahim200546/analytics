import {configureStore} from "@reduxjs/toolkit";
import adminConstructorReducer from "@/libs/@dexodus/admin-constructor/src/redux/adminConstructorReducer";

export const makeStore = () => {
    return configureStore({
        reducer: adminConstructorReducer
    })
}

export type AdminConstructorStore = ReturnType<typeof makeStore>
export type AdminConstructorState = ReturnType<AdminConstructorStore['getState']>

export type AdminConstructorDispatch = AdminConstructorStore['dispatch']

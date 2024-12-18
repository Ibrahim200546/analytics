import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import React from "react";

interface AdminConstructorState {
    sideBarClosed: boolean;
    navigationPath: string;
    currentPage: string;
    topBarTitle: React.ReactNode;
}

export const initialState: AdminConstructorState = {
    sideBarClosed: false,
    navigationPath: '',
    currentPage: '',
    topBarTitle: '',
}

export const AdminConstructorSlice = createSlice({
    name: 'admin_constructor',
    initialState,
    reducers: {
        AdminConstructorChangeSideBarClosed(state, action: PayloadAction<boolean>){
            state.sideBarClosed = action.payload;
        },
        AdminConstructorChangeNavigation(state, action: PayloadAction<string>){
            state.navigationPath = action.payload;
        },
        AdminConstructorChangeCurrentPage(state, action: PayloadAction<string>){
            state.currentPage = action.payload;
        },
        AdminConstructorChangeTopBarTitle(state, action: PayloadAction<React.ReactNode>){
            state.topBarTitle = action.payload;
        },
    }
})

export default AdminConstructorSlice.reducer;

import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AdminConstructorState {
    sideBarClosed: boolean;
    navigationPath: string;
    currentPage: string;
}

export const initialState: AdminConstructorState = {
    sideBarClosed: false,
    navigationPath: '',
    currentPage: '',
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
    }
})

export default AdminConstructorSlice.reducer;

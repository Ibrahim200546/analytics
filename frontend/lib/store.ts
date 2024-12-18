import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper';

// @ts-ignore
const reducers: {[sliceName: string]: string} = {"translation":"@dexodus/native-translation-bundle/src/store/slices/translationSlice"};

export const makeStore = () => {
    return configureStore({
        reducer: Object.entries(reducers).reduce((acc, [sliceName, slicePath]) => ({
            ...acc,
            [sliceName]: require(slicePath),
        }), {}),
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const wrapper = createWrapper(makeStore);

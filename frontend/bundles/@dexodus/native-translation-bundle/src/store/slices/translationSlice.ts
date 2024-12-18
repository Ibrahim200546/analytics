import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TranslationState {
    translations: {
        [namespace: string]: {
            [key: string]: string;
        }
    };
}

const initialState: TranslationState = {
    translations: {
        default: {
            'hello': 'Hello world :)'
        }
    }
};

const translationSlice = createSlice({
    name: 'translation',
    initialState,
    reducers: {
        addTranslation: (state: TranslationState, action: PayloadAction<{namespace: string, key: string, value: string}>) => {
            // @ts-ignore
            const payload = action.payload as {namespace: string, key: string, value: string};

            if (!(payload.namespace in state.translations)) {
                state.translations[payload.namespace] = {};
            }

            state.translations[payload.namespace][payload.key] = payload.value;
        },
    },
});

export const { addTranslation } = translationSlice.actions;

export default translationSlice;

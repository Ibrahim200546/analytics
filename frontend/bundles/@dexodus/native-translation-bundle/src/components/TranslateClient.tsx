'use client';

import {TranslateComponent} from "./Translate";
import {useAppSelector} from "@/lib/hooks";

const TranslateClient: TranslateComponent = () => {
    return useAppSelector(state => state.translations['default']['hello']);
}

export default TranslateClient;

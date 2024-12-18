import {Container} from "@/bundler";

export const init = (container: Container) => {
    container.parameters['@dexodus.redux-toolkit-bundle.reducers']['translation'] = "@dexodus/native-translation-bundle/src/store/slices/translationSlice";
}

import {useContext, useEffect} from "react";
import {FormContext, FormContextValue} from "../Form";

const useFormContext = (property: string, defaultValue: any): FormContextValue => {
    const formContextValue = useContext(FormContext);

    if (!formContextValue) {
        throw new Error("This field need use in Form component");
    }

    const {jselRef, reRender, context, options} = formContextValue;
    const fieldPath = property.startsWith("[") && property.endsWith("]")
        ? `${context}${property}`
        : `${context}.${property}`;

    useEffect(() => {
        if (jselRef.current?.exec(fieldPath) === undefined) {
            jselRef.current?.assign(fieldPath, defaultValue);
            reRender();
        }
    }, []);

    return {jselRef, reRender, context: fieldPath, options};
};

export default useFormContext;

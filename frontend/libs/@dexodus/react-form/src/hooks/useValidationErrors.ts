import React, {useEffect, useState} from "react";
import applyValidators from "../validators/applyValidators";
import {FormContextValueOptions} from "../Form";
import {Jsel} from "@dexodus/jsel";
import ValidatorInterface from "../validators/ValidatorInterface";

const useValidationErrors = (
    options: FormContextValueOptions,
    jselRef: React.MutableRefObject<Jsel>,
    fieldPath: string,
    validators: Array<ValidatorInterface> | undefined,
) => {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        const value = jselRef.current?.exec(fieldPath);

        if (options.enableValidation && value !== undefined) {
            const data = jselRef.current.exec(options.rootProperty);
            (async () => {
                const errors = await applyValidators(validators ?? [], data, value);
                setValidationErrors(errors);
                options.setErrorsMap(errorsMap => ({...errorsMap, [fieldPath]: errors.length > 0}));
            })();
        } else {
            setValidationErrors([]);
            options.setErrorsMap(errorsMap => ({...errorsMap, [fieldPath]: null}));
        }
    }, [options.enableValidation, jselRef.current?.exec(fieldPath) === undefined, JSON.stringify(jselRef.current?.exec(fieldPath))]);

    return validationErrors;
}

export default useValidationErrors;

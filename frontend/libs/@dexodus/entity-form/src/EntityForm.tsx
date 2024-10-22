"use client";

import React, {useState} from "react";
import {ArrayField, Field, ObjectField} from "@/libs/@dexodus/react-form";
import EntityFormStructure, {EntityFormEventType} from "@/libs/@dexodus/entity-form/src/EntityFormStructure";
import EntityFormField from "@/libs/@dexodus/entity-form/src/EntityFormField";
import MultipleDropdownField from "@/libs/@dexodus/entity-form-common-fields/src/MultipleDropdownField";
import FieldComponent, {FieldComponentProps} from "@/libs/@dexodus/react-form/src/fields/FieldComponent";
import GeneralField, {GeneralFieldProps} from "@/libs/@dexodus/react-form/src/fields/GeneralField";
import StringField from "@/libs/@dexodus/bootstrap/UserInterface/Fields/StringField";
import Button, {ButtonStyle} from "@/libs/@dexodus/bootstrap/UserInterface/Button";
import styles from "./EntityForm.module.scss";
import DateTimePickerField from "@/libs/@dexodus/bootstrap/UserInterface/Fields/DateTimePickerField";
import AsyncDropdownField from "@/libs/@dexodus/bootstrap/UserInterface/Fields/AsyncDropdownField";
import ColorPickerField from "@/libs/@dexodus/bootstrap/UserInterface/Fields";
import DropdownField from "@/libs/@dexodus/bootstrap/UserInterface/Fields/DropdownField";
import AsyncMultipleDropdownField from "@/libs/@dexodus/entity-form-common-fields/src/AsyncMultipleDropdownField";
import FileField from "@/libs/@dexodus/bootstrap/UserInterface/Fields/FileField";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NumberField from "@/libs/@dexodus/bootstrap/UserInterface/Fields/NumberField";
import HiddenField from "@/libs/@dexodus/entity-form-common-fields/src/HiddenField";
import CheckboxField from "@/libs/@dexodus/entity-form-common-fields/src/CheckboxField";
import LabelField from "@/libs/@dexodus/entity-form-common-fields/src/LabelField";
import ButtonField from "@/libs/@dexodus/entity-form-common-fields/src/ButtonField";
import useForm from "@/libs/@dexodus/react-form/src/hooks/useForm";
import {useRouter} from "next/navigation";
import useApiFetch from "@/libs/@dexodus/api-fetch/src/hooks/useApiFetch";
import PhoneField from "@/libs/@dexodus/bootstrap/UserInterface/Fields/PhoneField";
import DateField from "@/libs/@dexodus/bootstrap/UserInterface/Fields/DateField";

export type EntityFormFieldComponents = { [fieldComponentName: string]: FieldComponent<FieldComponentProps | any> };

export type EntityFormGeneralFieldComponents = { [fieldComponentName: string]: GeneralField<GeneralFieldProps | any> };

interface EntityFormProps {
    structure: EntityFormStructure;
    fieldComponents?: EntityFormFieldComponents;
    generalFieldComponents?: EntityFormGeneralFieldComponents;
    defaultEntity?: any;
    token?: string;
}

export const entityFormDefaultFields: EntityFormFieldComponents = {
    DateField,
    DateTimePickerField,
    TextField: StringField,
    MultipleDropdownField,
    AsyncMultipleDropdownField,
    AsyncDropdownField,
    ColorPickerField,
    DropdownField,
    FileDropzoneField: FileField,
    NumberField,
    HiddenField,
    CheckboxField,
    LabelField,
    ButtonField,
    PhoneField,
};
export const entityFormDefaultGeneralFields: EntityFormGeneralFieldComponents = {
    Field,
    ObjectField,
    CollectionField: ArrayField,
};

const EntityForm: React.FC<EntityFormProps> = (
    {
        structure,
        fieldComponents = entityFormDefaultFields,
        generalFieldComponents = entityFormDefaultGeneralFields,
        defaultEntity = {},
        token = undefined,
    },
) => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const mode = (defaultEntity[structure.idColumn] ?? undefined) === undefined ? "create" : "edit";
    const savePath = structure.paths[mode]?.replace(`{${structure.idColumn}}`, defaultEntity[structure.idColumn] ?? "");
    const apiFetch = useApiFetch();

    const {component, jselRef: formJselRef, data: entity, validate} = useForm(jselRef => {
        return (
            <EntityFormField
                fields={jselRef.current?.exec('fields')}
                fieldComponents={fieldComponents}
                generalFieldComponents={generalFieldComponents}
            />
        )
    }, defaultEntity, (jselRef) => {
        jselRef.current?.assign('fields', structure.fields);
        jselRef.current?.assign('routerPush', (route: string) => {
            router.push(route);
        });
        jselRef.current?.assign('addField', (field: EntityFormField, path: string) => {
            if (!jselRef.current) {
                return;
            }

            const fields: EntityFormField[] = jselRef.current.exec('fields');
            const addInFields = (fields: EntityFormField[], pathParts: string[]): EntityFormField[] => {
                if (!pathParts.length && fields.find(candidateField => candidateField.path === field.path)) {
                    return fields;
                }

                if (!pathParts.length) {
                    return [...fields, field];
                }

                return fields.map(candidateField => {
                    if (candidateField.path === pathParts[0]) {
                        pathParts.shift();
                        return {
                            ...candidateField,
                            fields: addInFields(candidateField.fields ?? [], pathParts),
                        };
                    }

                    return candidateField;
                })
            }

            const newFields = addInFields(fields, path.split('.'));
            jselRef.current.assign('fields', newFields);
        });
    })

    const save = () => {
        validate(async () => {
            setLoading(true);

            try {
                for (const event of structure.events) {
                    if (event.name !== EntityFormEventType.ON_BEFORE_SEND) {
                        continue;
                    }

                    formJselRef.current?.exec(event.action);
                }

                const result = await apiFetch(`${savePath}`, {
                    method: mode === "create" ? "POST" : "PUT",
                    body: JSON.stringify(formJselRef.current?.exec('data')),
                    headers: {
                        "Content-Type": "application/json",
                        ...(token === undefined ? {} : {'Authorization': `Bearer ${token}`})
                    },
                });

                if (!result.ok) {
                    throw new Error();
                }

                for (const event of structure.events) {
                    if (mode === 'create' && event.name === EntityFormEventType.ON_AFTER_CREATE) {
                        formJselRef.current?.exec(event.action);
                    }

                    if (mode === 'edit' && event.name === EntityFormEventType.ON_AFTER_EDIT) {
                        formJselRef.current?.exec(event.action);
                    }
                }

                toast("Успешно сохранено", {type: 'success'})
            } catch (error) {
                toast("Произошла ошибка при сохранении", {type: 'error'})
            }

            setLoading(false);
        });
    };

    return (
        <div className={styles.entityForm}>
            {component}
            <Button
                isLoading={loading}
                style={ButtonStyle.Success}
                onClick={() => save()}
                className={styles.entityForm__save}
            >
                {mode === "create" ? "Создать" : "Редактировать"}
            </Button>
        </div>
    );
};

export default EntityForm;

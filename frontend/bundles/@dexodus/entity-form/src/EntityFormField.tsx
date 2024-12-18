import React from "react";
import {EntityFormField} from "@dexodus/entity-form/src/EntityFormStructure";
import {EntityFormFieldComponents, EntityFormGeneralFieldComponents} from "@dexodus/entity-form/src/EntityForm";
import {ArrayField, Field, JselValidator, ObjectField, ValidatorInterface} from "@dexodus/react-form";
import SectionArranger from "@dexodus/section/src/SectionArranger";
import {Section} from "@dexodus/section/src/types";

interface EntityFormFieldProps {
    fields: EntityFormField[];
    fieldComponents: EntityFormFieldComponents;
    generalFieldComponents: EntityFormGeneralFieldComponents;
}

const EntityFormField: React.FC<EntityFormFieldProps> = ({fields, fieldComponents, generalFieldComponents}) => {
    if (!('Field' in generalFieldComponents)) {
        throw new Error('Entity form required general field component "Field", but it not set')
    }

    return (
        <SectionArranger sections={
            fields.map(field => {
                const validators: ValidatorInterface[] = field.validators?.map(validator => {
                    if (validator.type !== 'jsel') {
                        throw new Error('Expected only JSEL validator type');
                    }

                    return new JselValidator(validator.rules, validator.errorMessage);
                }) ?? [];

                if (field.component in generalFieldComponents) {
                    const GeneralField = generalFieldComponents[field.component] as typeof ArrayField | typeof ObjectField;

                    if (!Array.isArray(field.fields)) {
                        throw new Error(`Entity form expected fields in field with component "${field.component}"`);
                    }

                    return {
                        groupKey: field.sectionGroupKey,
                        component: (
                            <GeneralField property={field.path} label={field.title} validators={validators} events={field.events} hidden={field.hidden ?? false}>
                                <EntityFormField fields={field.fields} fieldComponents={fieldComponents} generalFieldComponents={generalFieldComponents}/>
                            </GeneralField>
                        )
                    } as Section;
                } else {
                    const GeneralField = generalFieldComponents.Field as typeof Field;

                    if (!(field.component in fieldComponents)) {
                        throw new Error(`Entity form required field component "${field.component}", but it not set`)
                    }

                    const FieldComponent = fieldComponents[field.component];

                    return {
                        groupKey: field.sectionGroupKey,
                        component: <GeneralField component={FieldComponent} property={field.path} label={field.title} componentProps={field.componentArguments} validators={validators} events={field.events} hidden={field.hidden ?? false}/>
                    } as Section;
                }
            })
        }/>
    )
}

export default EntityFormField;

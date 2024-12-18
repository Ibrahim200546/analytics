"use client";

import React from "react";
import styles from "./AsyncDropdownField.module.scss";
import {default as AsyncDropdownFieldParent} from "@dexodus/entity-form-common-fields/src/AsyncDropdownField";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";
import classnames from "classnames";
interface AsyncDropdownFieldProps extends FieldComponentProps {
    search?: string,
    url: string,
    label: string,
    additionalQueryParameters: {[name: string]: string},
}

const AsyncDropdownField: FieldComponent<AsyncDropdownFieldProps> = (props) => {
    return (
        <div className={styles.asyncDropdownField}>
            <AsyncDropdownFieldParent {...props} className={classnames(props.className, styles.asyncDropdownField__input)}/>
        </div>
    );
};

export default AsyncDropdownField;

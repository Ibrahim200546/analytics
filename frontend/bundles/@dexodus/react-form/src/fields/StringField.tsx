import React from "react";
import FieldComponent, {FieldComponentProps} from "./FieldComponent";

interface StringFieldProps extends FieldComponentProps {

}

const StringField: FieldComponent<StringFieldProps> = ({value, onChange, className}) => {
    return (
        <input
            className={className}
            type="text"
            value={value}
            onChange={event => onChange(event.target.value)}
        />
    )
}

export default StringField;

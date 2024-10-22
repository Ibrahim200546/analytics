import FieldComponent, {FieldComponentProps} from "@/libs/@dexodus/react-form/src/fields/FieldComponent";
import {useEffect} from "react";

interface CheckboxFieldProps extends FieldComponentProps {
    defaultValue?: boolean;
}

const CheckboxField: FieldComponent<CheckboxFieldProps> = ({value, onChange, defaultValue}) => {
    console.log('value', value);

    useEffect(() => {
        if (typeof value !== 'boolean' && typeof defaultValue !== 'boolean') {
            onChange(false);
        } else if (typeof defaultValue === 'boolean') {
            onChange(defaultValue);
        }
    }, []);

    return (
        <input type="checkbox" checked={value} onChange={event => {
            onChange(event.target.checked)
        }}/>
    );
};

export default CheckboxField;

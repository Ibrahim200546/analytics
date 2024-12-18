import Select from "@dexodus/common-fields/src/Select";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";

interface MultipleDropdownFieldProps extends FieldComponentProps {
}

const MultipleDropdownField: FieldComponent<MultipleDropdownFieldProps> = (
    {
        value,
        options,
        onChange,
    },
) => {
    return (
        <Select
            isMulti={true}
            placeholder="Выбрать"
            options={
                Object.entries(options).map(([value, label]) => ({
                    label,
                    value,
                }))
            }
            onChange={onChange}
        />
    );
};

export default MultipleDropdownField;

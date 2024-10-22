import FieldComponent, {FieldComponentProps} from "@/libs/@dexodus/react-form/src/fields/FieldComponent";
import Button from "@/libs/@dexodus/bootstrap/UserInterface/Button";

interface ButtonFieldProps extends FieldComponentProps {
}

const ButtonField: FieldComponent<ButtonFieldProps> = ({onChange, value}) => {
    return <Button onClick={() => {
        const nextValue = (typeof value === 'number') ? value + 1 : 0;
        onChange(nextValue);
    }}>Применить действие</Button>;
};

export default ButtonField;

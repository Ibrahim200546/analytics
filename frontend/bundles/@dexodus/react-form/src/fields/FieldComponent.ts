import React from "react";

export interface FieldComponentProps {
    [propertyName: string]: any;
    value: any;
    onChange: (value: any) => void;
    className?: string,
}

type FieldComponent<Props extends FieldComponentProps> = React.FC<Props>;

export default FieldComponent;

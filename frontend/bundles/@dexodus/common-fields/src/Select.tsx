import { PropsWithChildren, ReactElement } from 'react';
import Select, { components, GroupBase, StylesConfig } from 'react-select';
import { CreatableProps } from 'react-select/creatable';

type ReactSelectCreatableProps<
    OptionType,
    Group extends GroupBase<OptionType>,
    IsMulti extends boolean
> = CreatableProps<OptionType, IsMulti, Group> & {
    customStyles?: StylesConfig;
    hasError?: boolean;
    icon?: ReactElement;
};

type ReactSelectCreatableType = <
    OptionType,
    Group extends GroupBase<OptionType>,
    IsMulti extends boolean = false
>(
    props: ReactSelectCreatableProps<OptionType, Group, IsMulti>
) => ReactElement;

const ReactSelect: ReactSelectCreatableType = (props) => {
    return (
        <Select
            {...props}
            components={{
                Control,
                ...props.components,
            }}
            className={`${props.className}`}
            styles={{
                ...((props.customStyles ?? {}) as any),
                control: (provided, state: any) => {
                    delete provided.borderColor;
                    delete provided.boxShadow;
                    const defaultStyles: any = {
                        ...provided,
                        padding: '12px 30px',
                        borderRadius: '4px',
                        border: '1px solid var(--input-border-color) !important',
                        outline: '0',
                        fontSize: '16px',
                        color: 'var(--text-color)',
                        backgroundColor: 'transparent',
                        transition: 'box-shadow .3s, border-color .3s',
                    };
                    if (state.isFocused && state.menuIsOpen) {
                        defaultStyles.boxShadow = `0 0 0 0.2rem var(--focus-color-25)`;
                    } else if (props.hasError) {
                        defaultStyles.boxShadow = `0 0 5px 1px var(--danger-color)`;
                    }
                    if (props.customStyles?.control) {
                        return props.customStyles.control(defaultStyles, state);
                    }

                    return defaultStyles;
                },
                indicatorSeparator: () => ({
                    display: 'none',
                }),
                input: (provided, state: any) => {
                    const defaultStyles = {};
                    if (props.customStyles?.input) {
                        return props.customStyles.input(defaultStyles, state);
                    }

                    return defaultStyles;
                },
                singleValue: (provided, state: any) => {
                    const defaultStyles: any = {
                        position: 'absolute',
                        left: '8px',
                    };
                    if (props.customStyles?.singleValue) {
                        return props.customStyles.singleValue(
                            defaultStyles,
                            state
                        );
                    }

                    return defaultStyles;
                },
                placeholder: (provided, state: any) => {
                    const defaultStyles: any = {
                        position: 'absolute',
                        left: '8px',
                    };
                    if (props.customStyles?.placeholder) {
                        return props.customStyles.placeholder(
                            defaultStyles,
                            state
                        );
                    }

                    return defaultStyles;
                },
                indicatorsContainer: () => ({
                    width: 0,
                    height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #666687',
                }),
                valueContainer: (defaultStyles = {}, state: any) => {
                    if (props.customStyles?.valueContainer) {
                        return props.customStyles.valueContainer(
                            defaultStyles,
                            state
                        );
                    }

                    return defaultStyles;
                },
                menu: (provided: any) => ({
                    ...provided,
                    zIndex: 10000005,
                }),
                option: (provided, state) => {
                    delete provided.backgroundColor;
                    provided[':active'] = {
                        backgroundColor: 'var(--main-color) !important',
                        color: '#fff',
                    };
                    provided[':hover'] = {
                        backgroundColor: 'rgba(76, 174, 116, 0.2)',
                    };
                    if (state.isSelected) {
                        provided.backgroundColor =
                            'var(--main-color) !important';
                        provided.color = '#fff';
                    }

                    return provided;
                },
                multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: 'var(--main-color)',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '5px 10px',
                }),
                multiValueLabel: (provided) => ({
                    ...provided,
                    color: '#fff',
                }),
            }}
        />
    );
};

const Control = ({ children, ...controlProps }: PropsWithChildren<any>) => (
    <components.Control {...controlProps}>
        {controlProps.selectProps.icon && (
            <span
                style={{
                    marginRight: 8,
                    color: controlProps.selectProps.hasError
                        ? '#dc3545'
                        : undefined,
                }}
            >
                {controlProps.selectProps.icon}
            </span>
        )}
        {children}
    </components.Control>
);

export default ReactSelect;

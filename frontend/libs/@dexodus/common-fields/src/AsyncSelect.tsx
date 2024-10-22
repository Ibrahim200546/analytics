import { PropsWithChildren } from 'react';
import {
    AsyncPaginate,
    ComponentProps,
    UseAsyncPaginateParams,
} from 'react-select-async-paginate';
import type { ReactElement } from 'react';
import { GroupBase, components, StylesConfig } from 'react-select';
import type { CreatableProps } from 'react-select/creatable';

type AsyncPaginateCreatableProps<
    OptionType,
    Group extends GroupBase<OptionType>,
    Additional,
    IsMulti extends boolean
> = CreatableProps<OptionType, IsMulti, Group> &
    UseAsyncPaginateParams<OptionType, Group, Additional> &
    ComponentProps<OptionType, Group, IsMulti> & {
        customStyles?: StylesConfig;
        hasError?: boolean;
        icon?: ReactElement;
        onSubmit?: () => void;
    };

type AsyncPaginateCreatableType = <
    OptionType,
    Group extends GroupBase<OptionType>,
    Additional,
    IsMulti extends boolean = false
>(
    props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>
) => ReactElement;

const ReactSelectAsyncPaginate: AsyncPaginateCreatableType = (props) => (
    <AsyncPaginate
        closeMenuOnSelect={!props.isMulti}
        hideSelectedOptions={false}
        styles={{
            ...(props.customStyles as any),
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
                const defaultStyles: any = {};
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
                    return props.customStyles.singleValue(defaultStyles, state);
                }

                return defaultStyles;
            },
            multiValue: (provided) => ({
                ...provided,
                backgroundColor: 'var(--main-color)',
                color: '#fff',
                borderRadius: '6px',
                padding: '5px 10px 5px 10px',
            }),
            multiValueLabel: (provided) => ({
                ...provided,
                color: '#fff',
            }),
            placeholder: (provided, state: any) => {
                const defaultStyles: any = {
                    position: 'absolute',
                    left: '8px',
                };
                if (props.customStyles?.placeholder) {
                    return props.customStyles.placeholder(defaultStyles, state);
                }

                return defaultStyles;
            },
            valueContainer: (defaultStyles = {}, state: any) => {
                if (props.customStyles?.valueContainer) {
                    return props.customStyles.valueContainer(
                        defaultStyles,
                        state
                    );
                }

                return defaultStyles;
            },
            multiValueRemove: (defaultStyles, state: any) => {
                if (props.customStyles?.valueContainer) {
                    return props.customStyles.valueContainer(
                        defaultStyles,
                        state
                    );
                }

                return {
                    ...defaultStyles,
                    cursor: 'pointer',
                };
            },
            indicatorsContainer: () => ({
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #666687',
            }),
            option: (provided, state: any) => {
                delete provided.backgroundColor;
                provided[':active'] = {
                    backgroundColor: 'var(--main-color) !important',
                    color: '#fff',
                };
                provided[':hover'] = {
                    backgroundColor: 'rgba(76, 174, 116, 0.2)',
                };
                if (state.isSelected) {
                    provided.backgroundColor = 'var(--main-color) !important';
                    provided.color = '#fff';
                }
                if (props.customStyles?.option) {
                    return props.customStyles.option(provided, state);
                }

                return provided;
            },
            menu: (provided, state: any) => {
                if (props.customStyles?.menu) {
                    return props.customStyles.menu(provided, state);
                }

                return {
                    ...provided,
                    zIndex: 10000005,
                };
            },
        }}
        {...props}
        components={{
            Control,
            ...props.components,
        }}
    />
);

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

export default ReactSelectAsyncPaginate;

import AsyncSelect from "@dexodus/common-fields/src/AsyncSelect";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";
import {Jsel, JselContext} from "@dexodus/jsel";
import TextTranslation from "@/libs/@dexodus/translation/src/client/TextTranslation";
import {useEffect, useState} from "react";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";

interface AsyncDropdownFieldProps extends FieldComponentProps {
    search?: string,
    url: string,
    label: string,
    additionalQueryParameters: {[name: string]: string},
}

interface Option {
    value: string;
    label: string;
}

const mapItemToOption = (item: any, itemToLabelRules: string) => {
    const itemId = '@id' in item ? item["@id"] : item.id;

    let label = itemId;
    if (itemToLabelRules) {
        const jsel = new Jsel(new JselContext(item));
        label = jsel.exec(itemToLabelRules);
    }
    return {
        value: itemId,
        label,
    };
};

const AsyncDropdownField: FieldComponent<AsyncDropdownFieldProps> = (
    {
        value,
        search,
        url,
        label,
        onChange,
        additionalQueryParameters = {},
    },
) => {
    const [option, setOption] = useState<Option|undefined>(undefined);
    const fetch = useApiFetch();

    useEffect(() => {
        if (typeof value === "object" && value !== null && '@id' in value) {
            const option = mapItemToOption(value, label);

            setOption(option);
            onChange(option.value);
        }
    }, []);

    const loadOptions = async (
        searchValue: string,
        loadedOptions: any[],
        {page}: { page: number },
    ) => {
        let newPage = page + 1;
        let queryString = `page=${newPage}`

        if (searchValue) {
            queryString += `&${search}=${searchValue}`
        }

        queryString += Object.entries(additionalQueryParameters).reduce((acc, [name, value]) => `${acc}&${name}=${value}`, '');

        const fetchResult = await fetch(`${url}?${queryString}`);
        const data = await fetchResult.json();
        const list = Array.isArray(data) ? data : data["hydra:member"];

        const options = list.map((el: any) => {
            return mapItemToOption(el, label);
        });

        return {
            options,
            hasMore: newPage * list.length < data["hydra:totalItems"],
            additional: {
                page: newPage,
            },
        };
    };

    return (
        <AsyncSelect
            styles={{
                option: (base) => ({...base, color: "#000"}),
            }}
            value={option}
            additional={{
                page: 0,
            }}
            placeholder={
                <TextTranslation
                    label="general.actions.select"
                    defaultValue="Выбрать"
                />
            }
            loadingMessage={() => (
                <p>
                    <TextTranslation
                        label="general.loading"
                        defaultValue="Загрузка"
                    />
                    ...
                </p>
            )}
            isSearchable={Boolean(search)}
            loadOptions={loadOptions as any}
            onChange={((option: Option) => {
                setOption(option);
                onChange(option.value);
            }) as any}
        />
    );
};

export default AsyncDropdownField;

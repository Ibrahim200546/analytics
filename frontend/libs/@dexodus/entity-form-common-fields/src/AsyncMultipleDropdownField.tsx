import AsyncSelect from "@/libs/@dexodus/common-fields/src/AsyncSelect";
import FieldComponent, {FieldComponentProps} from "@/libs/@dexodus/react-form/src/fields/FieldComponent";
import {Jsel, JselContext} from "@dexodus/jsel";
import TextTranslation from "@/libs/@dexodus/translation/src/client/TextTranslation";
import {useEffect, useState} from "react";

interface AsyncMultipleDropdownFieldProps extends FieldComponentProps {
    search?: string,
    url: string,
    label: string,
}

interface Option {
    value: string;
    label: string;
}

const mapItemToOption = (item: any, itemToLabelRules: string) => {
    const itemId = "@id" in item ? item["@id"] : item.id;

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

const AsyncMultipleDropdownField: FieldComponent<AsyncMultipleDropdownFieldProps> = (
    {
        value,
        search,
        url,
        label,
        onChange,
    },
) => {
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        if (Array.isArray(value)) {
            const options = value.map(value => mapItemToOption(value, label));

            setOptions(options);
            onChange(options.map(option => option.value));
        }
    }, []);

    const loadOptions = async (
        search: string,
        loadedOptions: any[],
        {page}: { page: number },
    ) => {
        let newPage = page + 1;
        let queryString = `page=${newPage}`;

        if (search) {
            queryString += `&${search}=${search}`;
        }

        const fetchResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}?${queryString}`);
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
            isMulti={true}
            value={options}
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
            onChange={((options: Option[]) => {
                setOptions(options);
                onChange(options.map(option => option.value));
            }) as any}
        />
    );
};

export default AsyncMultipleDropdownField;

import FilterComponentInterface from "../FilterComponentInterface";
import {useEffect, useState} from "react";
import {Jsel, JselContext} from "@dexodus/jsel";
import useApiFetch from "@/libs/@dexodus/api-fetch/src/hooks/useApiFetch";
import SelectInput from "../../../bootstrap/inputs/SelectInput";
import {SelectOption} from "../../../bootstrap/inputs/SelectInput/SelectInput";

const AsyncSearchFilter: FilterComponentInterface = ({column, filter, applyFilter}) => {
    const [value, setValue] = useState<SelectOption|null>(null);
    const apiFetch = useApiFetch();

    useEffect(() => {
        (async () => {
            if (!filter.data?.length) {
                return;
            }

            const fetchResult = await apiFetch(`${filter.options.url.replace('.jsonld', '')}/${filter.data[0]}.jsonld`);
            const data = await fetchResult.json();

            setValue(mapItemToOption(data));
        })();
    }, []);

    useEffect(() => {
        if (!value) {
            return;
        }

        if (!value.key) {
            setValue(null);
            applyFilter('');

            return;
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        applyFilter(value.key as string)
    }, [value]);

    const mapItemToOption = (item: any) => {
        const jsel = new Jsel(new JselContext({
            entity: {
                [column.dataKey]: item,
            }
        }))

        return {
            key: item.id,
            value: jsel.exec(column.getDataAction),
        };
    };

    const loadOptions = async (
        page: number,
        search: string,
    ) => {
        const fetchResult = await apiFetch(`${filter.options.url}?page=${page + 1}`);
        const data = await fetchResult.json();

        const options = data['hydra:member'].map((item: any) => {
            return mapItemToOption(item);
        });

        if (page === 0) {
            return [{key: '', value: 'Все'} as SelectOption, ...options];
        }

        return options;
    };

    return (
        <SelectInput value={value} setValue={setValue} loadOptions={async (page, search) => {
            return await loadOptions(page, search);
        }}/>
    )
}

export default AsyncSearchFilter;

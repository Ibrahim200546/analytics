import React, {useState} from "react";
import FilterComponentInterface from "../FilterComponentInterface";
import TextInput from "@/libs/@dexodus/bootstrap/inputs/TextInput";
import styles from "./SearchFilter.module.scss"

const SearchFilter: FilterComponentInterface = ({filter, applyFilter}) => {
    const [value, setValue] = useState(filter.data?.length ? filter.data[0] : '');

    return (
        <TextInput containerClassName={styles.searchFilter} value={value} setValue={setStateAction => {
            const newValue = typeof setStateAction === 'function' ? setStateAction(value) : setStateAction;

            setValue(newValue);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            applyFilter(newValue);
        }}/>
    );
}

export default SearchFilter;

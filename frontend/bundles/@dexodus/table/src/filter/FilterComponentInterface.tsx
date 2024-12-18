import {FC} from "react";
import {Column, ColumnFilter} from "../adapter/AdapterInterface";

type FilterComponentInterface = FC<{
    column: Column,
    filter: ColumnFilter,
    applyFilter: (...data: string[]) => void,
}>;

export default FilterComponentInterface;

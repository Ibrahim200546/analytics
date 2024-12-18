export type Data = any;


export interface ColumnSort {
    type: SortType;
    order: number;
}

export enum SortType {
    NONE,
    ASC,
    DESC,
}

export enum ColumnFilterType {
    SEARCH = 'search',
    ASYNC_SEARCH = 'async_search',
    ENUM_SEARCH = 'enum_search',
    DATE = 'date',
}

export interface ColumnFilter {
    type: ColumnFilterType;
    config?: any;
    data?: string[];
    options?: any;
}

export interface Column {
    dataKey: string;
    getDataAction: string;
    title: string;
    sortable: boolean;
    sort?: ColumnSort;
    sortQuery?: string|undefined;
    show?: boolean;
    filters: ColumnFilter[];
}

export interface Action {
    style: string;
    onClick: string;
    title: string;
    isVisible: string;
}

export interface ColumnOptions {
    columnDataKey: string,
    filters: ColumnFilter[],
    sort: ColumnSort | undefined,
}

export interface TableOptions {
    currentPage: number;
    columns: Column[];
}

export interface AdapterInterface {
    isInit(): boolean;
    init(): Promise<void>
    getData(): Promise<Data[]>;
    getColumns(): Column[];
    getActions(): Action[];
    getCountPages(): number;
    getCurrentPage(): number;
    getTotalData(): number;
    setCurrentPage(pageNumber: number): void;
    setColumns(columns: Column[]): void;

    sortColumn(column: Column, sort: ColumnSort): void;
    filterColumn(filter: ColumnFilter, ...data: string[]): boolean;

    exportOptions(): TableOptions;
    importOptions(options: TableOptions): void;
}

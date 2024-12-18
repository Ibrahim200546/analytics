import {
    Action,
    AdapterInterface,
    Column,
    ColumnFilter,
    ColumnFilterType,
    ColumnSort,
    Data,
    SortType,
    TableOptions,
} from "./AdapterInterface";
import {Jsel, JselContext} from "@dexodus/jsel";
import moment from "moment";
import "moment/locale/ru";

export enum FilterType {
    SEARCH = "search",
    SORT = "sort",
    ASYNC_SEARCH = "async_search",
    ENUM_SEARCH = "enum_search",
    DATE = 'date',
}

export interface FilterInterface {
    type: FilterType;
    query: string;
}

export interface SearchFilter extends FilterInterface {
    type: FilterType.SEARCH;
}

export interface SortFilter extends FilterInterface {
    type: FilterType.SORT;
}

export interface AsyncSearchFilter extends FilterInterface {
    type: FilterType.ASYNC_SEARCH;
    options: {
        url: string;
    };
}

export interface EnumSearchFilter extends FilterInterface {
    type: FilterType.ENUM_SEARCH;
    options: {
        options: {
            label: string;
            value: string;
        }[];
    };
}

export interface DateFilter extends FilterInterface {
    type: FilterType.ENUM_SEARCH;
    options: {
        options: {
            label: string;
            value: string;
        }[];
    };
}

export type Filter = SortFilter | SearchFilter | AsyncSearchFilter | EnumSearchFilter | DateFilter

export interface EntityTableColumn {
    dataKey: string;
    getDataAction: string;
    priority: number;
    title: string;
    filters: Filter[];
}

export interface EntityTableStructure {
    name: string;
    entity: string;
    columns: EntityTableColumn[];
    path: string;
    actions: Action[];
}

interface HydraSearchMapping {
    "@type": "IriTemplateMapping";
    "variable": string;
    "property": string;
    "required": boolean;
}

interface HydraSearch {
    "@type": "hydra:IriTemplate";
    "hydra:template": string;
    "hydra:variableRepresentation": "BasicRepresentation";
    "hydra:mapping": HydraSearchMapping[];
}

interface HydraView {
    "@id": string;
    "@type": string;
    "hydra:first": string;
    "hydra:last": string;
    "hydra:previous": string;
}

interface HydraCollection {
    "@context": string;
    "@id": string;
    "@type": "hydra:Collection";
    "hydra:totalItems": number;
    "hydra:member": Data[];
    "hydra:search"?: HydraSearch;
    "hydra:view": HydraView;
}

const mapFilterType = (filterType: FilterType): ColumnFilterType => {
    switch (filterType) {
        case FilterType.SEARCH:
            return ColumnFilterType.SEARCH;
        case FilterType.ASYNC_SEARCH:
            return ColumnFilterType.ASYNC_SEARCH;
        case FilterType.ENUM_SEARCH:
            return ColumnFilterType.ENUM_SEARCH;
        case FilterType.DATE:
            return ColumnFilterType.DATE;
    }

    throw new Error(`Can't map filter type "${filterType}"`);
};

export class EntityTableAdapter implements AdapterInterface {
    private structure!: EntityTableStructure;
    private columns: Column[] = [];
    private countPages: number = 0;
    private currentPage: number = 1;
    private isInitialized: boolean = false;
    private total: number = 0;

    constructor(
        private apiUrl: string,
        private structureUrl: string,
        structure?: EntityTableStructure,
        public fetch: any = fetch,
        private entitiesPath?: string,
        private additionalSearchParams?: any,
    ) {
        if (structure) {
            this.structure = structure;
        }
    }

    public isInit(): boolean {
        return this.isInitialized;
    }

    public getTotalData(): number {
        return this.total;
    }

    public async init(): Promise<void> {
        if (this.isInit()) {
            return;
        }

        if (!this.structure) {
            const result = await this.fetch(`${this.apiUrl}/${this.structureUrl}`);
            this.structure = await result.json() as EntityTableStructure;
        }

        if (this.entitiesPath === undefined) {
            this.entitiesPath = this.structure.path;
        }

        for (const column of this.structure.columns) {
            if (this.columns.find(existColumn => existColumn.dataKey === column.dataKey)) {
                continue;
            }

            let sortable = false;
            let sortQuery = undefined;
            const filters: ColumnFilter[] = [];

            for (const filter of column.filters) {
                if (filter.type === FilterType.SORT) {
                    sortable = true;
                    sortQuery = filter.query;
                } else {
                    const columnFilter: ColumnFilter = {
                        type: mapFilterType(filter.type),
                        config: filter.query,
                    };

                    if ("options" in filter) {
                        columnFilter.options = filter.options;
                    }

                    filters.push(columnFilter);
                }
            }

            this.columns.push({
                getDataAction: column.getDataAction,
                dataKey: column.dataKey,
                title: column.title,
                sortable: sortable,
                sortQuery: sortQuery,
                filters: filters,
                show: true,
            });
        }

        this.isInitialized = true;
    }

    public async getData(): Promise<Data[]> {
        let sortQuery = "";

        const filteredColumns = this.columns.filter(column => column.sort && column.sort.type !== SortType.NONE);
        const sortedColumns = filteredColumns.sort((a, b) => {
            const aSort = a.sort as ColumnSort;
            const bSort = b.sort as ColumnSort;

            if (aSort.order > bSort.order) {
                return 1;
            } else if (aSort.order < bSort.order) {
                return -1;
            } else {
                return 0;
            }
        });

        for (const column of sortedColumns) {
            let order;

            if (column.sort!.type === SortType.ASC) {
                order = "ASC";
            } else if (column.sort!.type === SortType.DESC) {
                order = "DESC";
            }

            sortQuery += `&${column.sortQuery}${order}`;
        }

        let filterQuery = "";

        for (const column of this.columns) {
            for (const filter of column.filters) {
                if (filter.data?.length && filter.data[0]) {
                    let config: string = filter.config;

                    for (const dataIndex in filter.data) {
                        config = config.replaceAll(`{data${dataIndex}}`, filter.data[dataIndex]);
                    }

                    filterQuery += `&${config}`;
                }
            }
        }

        let additional = "";

        if (this.additionalSearchParams) {
            additional = Object.entries(this.additionalSearchParams).map(([key, value]) => `&${key}=${value}`).join("");
        }

        const url = `${this.apiUrl}${this.entitiesPath}?page=${this.currentPage}${sortQuery}${filterQuery}${additional}`;
        const result = await this.fetch(url);
        const hydraCollection = await result.json() as HydraCollection;

        this.total = hydraCollection["hydra:totalItems"];

        if (hydraCollection["hydra:totalItems"] > 0) {
            this.countPages = 1;
        }

        if (hydraCollection["hydra:view"] && hydraCollection["hydra:view"]["hydra:last"]) {
            this.countPages = parseInt(hydraCollection["hydra:view"]["hydra:last"].split("=").pop() ?? "");
        }

        return hydraCollection["hydra:member"].map(member => {
            const jsel = new Jsel(new JselContext({
                entity: member,
                momentFormat: (timeString: string, format: string) => {
                    return moment(timeString).format(format);
                },
            }));
            const dataMember: { [name: string]: any } = member;

            for (const column of this.structure.columns) {
                dataMember[column.dataKey] = jsel.exec(column.getDataAction);
            }

            return dataMember;
        });
    }

    public getColumns(): Column[] {
        return this.columns;
    }

    public getActions(): Action[] {
        return this.structure.actions;
    }

    public getCountPages(): number {
        return this.countPages;
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    public setCurrentPage(pageNumber: number): void {
        this.currentPage = pageNumber;
    }

    public sortColumn(column: Column, sort: ColumnSort): void {
        column.sort = sort;
    }

    public filterColumn(filter: ColumnFilter, ...data: string[]): boolean {
        if (JSON.stringify(filter.data) === JSON.stringify(data)) {
            return false;
        }

        filter.data = data;
        this.currentPage = 1;

        return true;
    }

    public exportOptions(): TableOptions {
        return {
            currentPage: this.currentPage,
            columns: this.columns,
        }
    }

    public importOptions(options: TableOptions) {
        this.currentPage = options.currentPage;
        this.columns = options.columns;
    }

    public setColumns(columns: Column[]) {
        this.columns = columns;
    }
}

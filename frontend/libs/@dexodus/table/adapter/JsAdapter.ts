import {
    Action,
    AdapterInterface,
    Column,
    ColumnFilter, ColumnOptions,
    ColumnSort,
    Data,
    SortType, TableOptions,
} from "./AdapterInterface";

export class JsAdapter implements AdapterInterface {
    private processedData: Data[] = [];
    private countPages!: number;
    private isInitialized: boolean = false;

    constructor(
        private data: Data[] = [],
        private columns: Column[] = [],
        private maxEntitiesOnPage: number = 10,
        private currentPage: number = 1,
    ) {
        this.processData();
    }

    public isInit(): boolean {
        return this.isInitialized;
    }

    public async init(): Promise<void> {
        this.isInitialized = true;
    }

    public async getData(): Promise<Data[]> {
        this.processData();

        return this.processedData;
    }

    public getColumns(): Column[] {
        return this.columns;
    }

    public getActions(): Action[] {
        return [];
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
        if (!column.sortable) {
            return;
        }

        column.sort = sort;
        this.processData();
    }

    public filterColumn(filter: ColumnFilter, ...data: string[]): boolean {
        if (filter.data === data) {
            return false;
        }

        filter.data = data;
        this.currentPage = 1;

        return true;
    }

    private processData(): void {
        this.processedData = [];
        let copiedData = [...this.data];

        for (const column of this.columns) {
            for (const filter of column.filters) {
                if (filter.data) {
                    copiedData = copiedData.filter(data => filter.config(data[column.dataKey], filter.data))
                }
            }
        }

        this.countPages = Math.ceil(copiedData.length / this.maxEntitiesOnPage);

        const filteredColumns = this.columns.filter(column => column.sort && column.sort.type !== SortType.NONE)
        const sortedColumns = filteredColumns.sort((a, b) => {
            const aSort = a.sort as ColumnSort;
            const bSort = b.sort as ColumnSort;

            if (aSort.order > bSort.order) {
                return -1;
            } else if (aSort.order < bSort.order) {
                return 1;
            } else {
                return 0;
            }
        })

        for (const column of sortedColumns) {
            const sort = column.sort as ColumnSort;

            copiedData = copiedData.sort((a, b) => {
                if (a[column.dataKey] > b[column.dataKey]) {
                    return sort.type === SortType.ASC ? 1 : -1
                } else if (a[column.dataKey] < b[column.dataKey]) {
                    return sort.type === SortType.ASC ? -1 : 1
                } else {
                    return 0;
                }
            })
        }

        for (let i = 0; i < this.maxEntitiesOnPage; i++) {
            const dataIndex = (this.currentPage - 1) * this.maxEntitiesOnPage + i;

            if (dataIndex >= copiedData.length) {
                break;
            }

            this.processedData.push(copiedData[dataIndex]);
        }
    }

    public getTotalData(): number {
        return this.data.length;
    }

    public exportOptions(): TableOptions {
        return {
            currentPage: this.currentPage,
            columns: this.columns,
        };
    }

    public importOptions(options: TableOptions) {
        this.currentPage = options.currentPage;
        this.columns = options.columns;
    }

    public setColumns(columns: Column[]) {
        this.columns = columns;
    }
}

import { TableMeta as ITableMeta } from '.'

declare module '@tanstack/table-core' {
	interface TableMeta<TData extends RowData> extends Partial<ITableMeta> {}
}

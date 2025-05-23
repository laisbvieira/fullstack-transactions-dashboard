import { Table } from "../table/Table";

interface TransactionListProps<T> {
  headers: (keyof T)[];
  labels?: Partial<Record<keyof T, string>>;
  data: T[];
  renderCell?: (row: T, key: keyof T) => React.ReactNode;
}

export const TransactionList = <T,>({
  headers,
  labels,
  data,
  renderCell,
}: TransactionListProps<T>) => {
  return (
    <>
      <Table
        headers={headers}
        rows={data}
        labels={labels}
        renderCell={renderCell}
      />
    </>
  );
};

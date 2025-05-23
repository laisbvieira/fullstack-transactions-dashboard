import React from "react";
import styles from "./styles.module.css";

interface TableProps<T> {
  headers: (keyof T)[];
  rows: T[];
  labels?: Partial<Record<keyof T, string>>;
  renderCell?: (row: T, key: keyof T) => React.ReactNode;
}

export function Table<T>({ headers, rows, labels, renderCell }: TableProps<T>) {
  return (
    <div className={styles.container}>
 <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={String(header)}>
              {labels && labels[header] ? labels[header] : String(header)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header) => (
              <td key={String(header)}>
                {renderCell
                  ? renderCell(row, header)
                  : (row[header] as React.ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
   
  );
}

"use client";

import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useRole } from "@/contexts";

export type HistoryAction = "Reserve" | "Cancel";

export interface IHistoryRecord {
  id: string;
  dateTime: string;
  username: string;
  concertName: string;
  action: HistoryAction;
}

interface IHistoryTableProps {
  data: IHistoryRecord[];
}

const columnHelper = createColumnHelper<IHistoryRecord>();

const formatDateTime = (dateString: string): string => {
  const d = dayjs(dateString).locale("th");
  return d.isValid() ? d.format("DD/MM/YYYY HH:mm:ss") : "—";
};

const tableStyles = `
  .history-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  .history-table th,
  .history-table td {
    border-top: 1px solid #5B5B5B;
    border-left: 1px solid #5B5B5B;
    padding: 10px 12px;
    text-align: left;
    min-width: 180px;
  }

  .history-table th:last-child,
  .history-table td:last-child {
    border-right: 1px solid #5B5B5B;
  }

  .history-table tbody tr:last-child td {
    border-bottom: 1px solid #5B5B5B;
  }

  .history-table thead tr:first-child th:first-child {
    border-top-left-radius: 4px;
  }

  .history-table thead tr:first-child th:last-child {
    border-top-right-radius: 4px;
  }

  .history-table tbody tr:last-child td:first-child {
    border-bottom-left-radius: 4px;
  }

  .history-table tbody tr:last-child td:last-child {
    border-bottom-right-radius: 4px;
  }
`;

const HistoryTable = (props: IHistoryTableProps) => {
  const { data } = props;
  const { role } = useRole();
  const isAdmin = role === "admin";

  const columns = useMemo<ColumnDef<IHistoryRecord, unknown>[]>(() => {
    const baseColumns: ColumnDef<IHistoryRecord, unknown>[] = [
      columnHelper.accessor("dateTime", {
        header: "Date Time",
        cell: (info) => formatDateTime(info.getValue()),
      }),
    ];

    if (isAdmin) {
      baseColumns.push(
        columnHelper.accessor("username", {
          header: "Username",
          cell: (info) => info.getValue(),
        }),
      );
    }

    baseColumns.push(
      columnHelper.accessor("concertName", {
        header: "Concert Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => info.getValue(),
      }),
    );

    return baseColumns;
  }, [isAdmin]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto">
      <style>{tableStyles}</style>
      <table className="history-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-xl font-semibold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px" }}>
          No records found
        </div>
      )}
    </div>
  );
};

export default React.memo(HistoryTable);

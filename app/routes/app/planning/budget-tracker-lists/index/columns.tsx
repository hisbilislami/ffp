import { ColumnDef } from "@tanstack/react-table";
import { convertDateStringToString } from "~/utils/date";

export interface ListBudgetTracker {
  id: number;
  name: string;
  periodStart: string;
  periodEnd: string;
}

export const columns: ColumnDef<ListBudgetTracker>[] = [
  {
    header: "Budget Title",
    accessorKey: "name",
    size: 150,
  },
  {
    header: "Period",
    accessorKey: "periode_start",
    cell: ({ row }) => {
      const periodStart = convertDateStringToString({
        date: row.original.periodStart,
      });
      const periodEnd = convertDateStringToString({
        date: row.original.periodEnd,
      });

      return (
        <span>
          {periodStart} - {periodEnd}
        </span>
      );
    },
  },
];

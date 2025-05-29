import { ColumnDef } from "@tanstack/react-table";

export interface ListBudgetTracker {
  id: number;
  name: string;
  period_start: string;
  period_end: string;
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
      const periodStart = row.original.period_start;
      const periodEnd = row.original.period_end;

      return (
        <span>
          {periodStart} - {periodEnd}
        </span>
      );
    },
  },
];

import { ColumnDef } from "@tanstack/react-table";

export interface ListTransaction {
  id: number;
  estimatePrice: number;
  realPrice: number;
  diffPrice: number;
  qty: number;
  description: string;
}

export const columns: ColumnDef<ListTransaction>[] = [
  {
    header: "Est Price",
    accessorKey: "estimatePrice",
    size: 80,
  },
  {
    header: "Real Price",
    accessorKey: "realPrice",
    size: 80,
  },
  {
    header: "Diff Price",
    accessorKey: "diffPrice",
    size: 80,
  },
  {
    header: "Qty",
    accessorKey: "qty",
    size: 80,
  },
  {
    header: "Description",
    accessorKey: "description",
    size: 80,
  },
];

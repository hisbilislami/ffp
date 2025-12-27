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
    meta: {
      showColumnNameOnMobile: true,
      mobileLabel: "Est Price",
    },
  },
  {
    header: "Real Price",
    accessorKey: "realPrice",
    size: 80,
    meta: {
      showColumnNameOnMobile: true,
      mobileLabel: "Real Price",
    },
  },
  {
    header: "Diff Price",
    accessorKey: "diffPrice",
    size: 80,
    meta: {
      showColumnNameOnMobile: true,
      mobileLabel: "Diff Price",
    },
  },
  {
    header: "Qty",
    accessorKey: "qty",
    size: 80,
    meta: {
      showColumnNameOnMobile: true,
      mobileLabel: "Qty",
    },
  },
  {
    header: "Description",
    accessorKey: "description",
    size: 80,
    meta: {
      showColumnNameOnMobile: true,
      mobileLabel: "Description",
    },
  },
];

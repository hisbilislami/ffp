// types.d.ts
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    mobileLabel?: string;
    showColumnNameOnMobile?: boolean;
  }
}

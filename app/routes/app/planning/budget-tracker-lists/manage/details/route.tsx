import { useFetcher, useNavigation, useSearchParams } from "@remix-run/react";
import { DataTable, useDataTable } from "~/components/table";
import { columns, ListTransaction } from "./columns";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ActionFunctionArgs } from "@remix-run/node";
import { actionHandler } from "./action";
import { useDialog } from "~/context/DialogContext";
import Summary from "./components/summary";

export const ErrorBoundary = () => {};

export const action = ({ request }: ActionFunctionArgs) => {
  return actionHandler(request);
};

export const BudgetTrackerDetails = ({
  data,
  setSelectedData,
}: {
  data: ListTransaction[];
  setSelectedData: Dispatch<SetStateAction<ListTransaction | undefined>>;
}) => {
  const navigation = useNavigation();

  const [searchParams] = useSearchParams();
  const page = useMemo(() => searchParams.get("page") || 0, [searchParams]);
  const size = useMemo(() => searchParams.get("size") || 10, [searchParams]);

  const { showDialog } = useDialog();

  const { table } = useDataTable({
    columns: columns,
    data: data || [],
    count: data ? data.length : 0,
    isLoading: navigation.state !== "idle",
    paginationState: {
      pageIndex: Number(page),
      pageSize: Number(size),
    },
  });

  const fetcher = useFetcher<typeof action>();

  const onEdit = (data: ListTransaction) => {
    setSelectedData(data);
  };

  const onDelete = async (data: ListTransaction) => {
    showDialog({
      title: "Hapus",
      description: "Apakah anda yakin ingin menghapus data ini?",
      type: "confirmation",
      onConfirm: () => {
        fetcher.submit(
          { id: data.id, action: "delete" },
          {
            method: "POST",
            action: "/app/planning/budget-tracker-lists/manage/details/",
          }
        );
      },
      confirmText: "Ya",
    });
  };

  return (
    <>
      <DataTable
        table={table}
        columns={columns}
        withSearchField={true}
        onSearch={() => {}}
        onRefresh={() => {}}
        withAction
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <Summary data={data} />
    </>
  );
};

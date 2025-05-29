import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import AppCardForm from "~/components/card/app-card-form";
import { useMemo, useState } from "react";
import { DataTable, useDataTable } from "~/components/table";
import { columns } from "./columns";
import { loaderHandler } from "./loader";
import { actionHandler } from "./action";

export const action = async ({ request }: ActionFunctionArgs) =>
  actionHandler(request);

export const ErrorBoundary = () => {};

export const loader = async ({ request }: LoaderFunctionArgs) =>
  loaderHandler(request);

export default function BudgetTrackerLists() {
  const { result } = useLoaderData<typeof loader>();
  const { state } = useNavigation();
  const [ignoreLoading, setIgnoreLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const page = useMemo(() => searchParams.get("page") || 0, [searchParams]);
  const size = useMemo(() => searchParams.get("size") || 0, [searchParams]);

  const fetcher = useFetcher<typeof action>();

  const { table } = useDataTable({
    columns: columns,
    data: result?.data || [],
    count: result?.totalCount || 0,
    isLoading: state !== "idle" && ignoreLoading === false,
    paginationState: {
      pageIndex: Number(page),
      pageSize: Number(size),
    },
  });

  const onSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
  };

  const location = useLocation();
  const onRefresh = () => {
    const params = new URLSearchParams(location.search);
    params.delete("q");

    fetcher.load(`${location.pathname}?${params.toString()}`);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <>
      <AppCardForm isForm={false} title="Budget Tracker">
        <DataTable
          columns={columns}
          table={table}
          withAction={true}
          onAdd={() => {
            setIgnoreLoading(true);
            navigate("/app/planning/budget-tracker-list/manage");
          }}
          onSearch={onSearch}
          textName="Budget Tracker"
          withSearchField={true}
          onRefresh={onRefresh}
        />
      </AppCardForm>
    </>
  );
}

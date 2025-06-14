import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
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
import { useDisclosure } from "@mantine/hooks";
import { Button, Grid, Modal, TextInput } from "@mantine/core";
import {
  getFormProps,
  getInputProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { btlLabel, schema } from "./schema";
import { DatePickerInput } from "@mantine/dates";

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
  const [opened, { open, close }] = useDisclosure(false);

  const [searchParams] = useSearchParams();
  const page = useMemo(() => searchParams.get("page") || 0, [searchParams]);
  const size = useMemo(() => searchParams.get("size") || 0, [searchParams]);

  const fetcher = useFetcher<typeof action>();
  const lastResult = useActionData<typeof action>();

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

  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    defaultValue: {
      name: "",
      period: [null, null],
    },
  });

  const periodInput = useInputControl(fields.period);

  const [period, setPeriod] = useState<[string | null, string | null]>(() => {
    if (Array.isArray(periodInput.value)) {
      return [periodInput.value[0] ?? null, periodInput.value[1] ?? null];
    }
    if (typeof periodInput.value === "string") {
      return [periodInput.value, null];
    }
    return [null, null];
  });

  const handleDateChange = (dates: [string | null, string | null]) => {
    setPeriod(dates);
    const filtered = dates.filter((item): item is string => item !== null);
    if (filtered.length > 1) {
      periodInput.change(filtered);
    }
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
            open();
          }}
          onSearch={onSearch}
          textName="Budget Tracker"
          withSearchField={true}
          onRefresh={onRefresh}
        />
      </AppCardForm>

      <Modal
        opened={opened}
        size="lg"
        onClose={() => {
          setIgnoreLoading(false);
          setPeriod([null, null]);
          close();
        }}
        title="New Budget"
      >
        <Form method="POST" {...getFormProps(form)}>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                {...btlLabel["name"]}
                {...getInputProps(fields.name, { type: "text" })}
                error={fields.name?.errors?.[0] ?? null}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                type="range"
                label="Period"
                withAsterisk
                placeholder="Select period"
                value={period}
                classNames={{
                  input: "!py-0",
                }}
                onChange={handleDateChange}
                error={fields.period?.errors?.[0] ?? null}
              />
              {(period ?? []).map((v, i) => (
                <input
                  key={`period-${i}-${v ?? "null"}`}
                  type="hidden"
                  name={`${fields.period.name}`}
                  value={v ?? ""}
                />
              ))}

              <input type="hidden" name="action" value="new" />
            </Grid.Col>
            <Grid.Col span={12} className="text-right">
              <Button type="submit">Submit</Button>
            </Grid.Col>
          </Grid>
        </Form>
      </Modal>
    </>
  );
}

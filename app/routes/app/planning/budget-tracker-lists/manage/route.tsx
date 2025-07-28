import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import AppCardForm from "~/components/card/app-card-form";
import { loaderHandler } from "./loader";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { budgetTrackerLabel, schema } from "./schema";
import { Button, Grid, Textarea } from "@mantine/core";
import { Icon } from "@iconify/react/dist/iconify.js";
import InputText from "~/components/form/input-text";
import { DataTable, useDataTable } from "~/components/table";
import { columns } from "./columns";

export const loader = ({ request }: LoaderFunctionArgs) => {
  return loaderHandler(request);
};

export const action = ({ request }: ActionFunctionArgs) => {
  return null;
};

export const ErrorBoundary = () => {};

const BudgetTrackerForm = () => {
  const { data } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const transaction = data;

  const navigation = useNavigation();
  const navigate = useNavigate();

  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    defaultValue: {},
  });

  const transactionList = transaction?.Transactions;

  const { table } = useDataTable({
    columns: columns,
    data: transactionList || [],
    count: transactionList,
  });

  return (
    <>
      <Form method="POST" {...getFormProps(form)} className="border">
        <AppCardForm
          isForm={true}
          title="Budget Tracker"
          actionButtons={
            <div className="flex gap-4 justify-right">
              <Button
                type="reset"
                leftSection={<Icon icon="streamline-plump:reset-clock-solid" />}
                variant="default"
              >
                Reset
              </Button>
              <Button
                type="submit"
                leftSection={
                  <Icon icon="material-symbols:save-clock-rounded" />
                }
              >
                Submit
              </Button>
            </div>
          }
        >
          <Grid>
            <Grid.Col span={6}>
              <InputText
                {...budgetTrackerLabel["estimate_price"]}
                fields={fields}
              />
              <InputText
                {...budgetTrackerLabel["real_price"]}
                fields={fields}
              />
              <InputText
                {...budgetTrackerLabel["diff_price"]}
                fields={fields}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <InputText {...budgetTrackerLabel["qty"]} fields={fields} />
              <Textarea
                rows={4}
                {...budgetTrackerLabel["description"]}
                {...getInputProps(fields.description, { type: "text" })}
              />
            </Grid.Col>
          </Grid>
        </AppCardForm>
        <AppCardForm isForm={false} title="Budget Tracker List">
          <DataTable table={table} />
        </AppCardForm>
      </Form>
    </>
  );
};

export default BudgetTrackerForm;

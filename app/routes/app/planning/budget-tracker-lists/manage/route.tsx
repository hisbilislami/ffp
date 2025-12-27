import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import AppCardForm from "~/components/card/app-card-form";
import { loaderHandler } from "./loader";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  // useNavigate,
  useNavigation,
} from "@remix-run/react";
import {
  getFormProps,
  getInputProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { budgetTrackerLabel, schema } from "./schema";
import { Button, Grid, Textarea, TextInput } from "@mantine/core";
import { Icon } from "@iconify/react/dist/iconify.js";
import InputText from "~/components/form/input-text";
import { BudgetTrackerDetails } from "./details/route";
import { actionHanlder } from "./action";
import { ListTransaction } from "./details/columns";
import { useEffect, useState } from "react";
import InputNumber from "~/components/form/input-number";

export const loader = ({ request }: LoaderFunctionArgs) => {
  return loaderHandler(request);
};

export const action = ({ request }: ActionFunctionArgs) => {
  return actionHanlder(request);
};

export const ErrorBoundary = () => {};

const BudgetTrackerForm = () => {
  const { data } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const [selectedData, setSelectedData] = useState<ListTransaction | undefined>(
    undefined
  );

  useEffect(() => {
    if (selectedData) {
      id.change(String(selectedData.id));
      estimatePrice.change(String(selectedData.estimatePrice));
      realPrice.change(String(selectedData.realPrice));
      diffPrice.change(String(selectedData.diffPrice));
      qty.change(String(selectedData.qty));
      description.change(String(selectedData.description));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData]);

  const navigation = useNavigation();
  const navigate = useNavigate();

  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      const isValid = parseWithZod(formData, { schema });
      return isValid;
    },
    defaultValue: {
      budgetId: data?.id ?? undefined,
    },
  });

  const id = useInputControl(fields.id);
  const estimatePrice = useInputControl(fields.estimate_price);
  const realPrice = useInputControl(fields.real_price);
  const diffPrice = useInputControl(fields.diff_price);
  const qty = useInputControl(fields.qty);
  const description = useInputControl(fields.description);

  return (
    <>
      <Form method="POST" {...getFormProps(form)} className="border">
        <AppCardForm
          isForm={true}
          title="Budget Tracker"
          actionButtons={
            <div className="flex gap-1 sm:gap-5 justify-center sm:justify-between w-full">
              <div>
                <Button
                  type="button"
                  size="xs"
                  display={{
                    base: "block",
                    sm: "none",
                  }}
                  variant="filled"
                  color="billYellow"
                  onClick={() =>
                    navigate("/app/planning/budget-tracker-lists/")
                  }
                  loading={navigation.state !== "idle"}
                >
                  <Icon icon="tabler:arrow-back-up" className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  size="xs"
                  display={{
                    base: "none",
                    sm: "block",
                  }}
                  variant="filled"
                  color="billYellow"
                  onClick={() =>
                    navigate("/app/planning/budget-tracker-lists/")
                  }
                  loading={navigation.state !== "idle"}
                  leftSection={
                    <Icon icon="tabler:arrow-back-up" className="h-5 w-5" />
                  }
                >
                  Back to the main list
                </Button>
              </div>

              <div className="inline-flex gap-2">
                <Button
                  type="button"
                  display={{
                    base: "none",
                    sm: "block",
                  }}
                  onClick={() => {
                    estimatePrice.change(undefined);
                    realPrice.change(undefined);
                    diffPrice.change(undefined);
                    qty.change(undefined);
                    description.change(undefined);
                    id.change(undefined);
                  }}
                  leftSection={
                    <Icon icon="streamline-plump:reset-clock-solid" />
                  }
                  loading={navigation.state !== "idle"}
                  variant="default"
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  display={{
                    base: "block",
                    sm: "none",
                  }}
                  onClick={() => {
                    estimatePrice.change(undefined);
                    realPrice.change(undefined);
                    diffPrice.change(undefined);
                    qty.change(undefined);
                    description.change(undefined);
                    id.change(undefined);
                  }}
                  loading={navigation.state !== "idle"}
                  variant="default"
                >
                  <Icon icon="streamline-plump:reset-clock-solid" />
                </Button>
                <Button
                  type="submit"
                  display={{
                    base: "none",
                    sm: "block",
                  }}
                  loading={navigation.state !== "idle"}
                  leftSection={
                    <Icon icon="material-symbols:save-clock-rounded" />
                  }
                >
                  Submit
                </Button>
                <Button
                  type="submit"
                  display={{
                    base: "block",
                    sm: "none",
                  }}
                  loading={navigation.state !== "idle"}
                >
                  <Icon icon="material-symbols:save-clock-rounded" />
                </Button>
              </div>
            </div>
          }
        >
          <Grid>
            <Grid.Col
              span={{
                base: 12,
                sm: 6,
              }}
            >
              <input {...getInputProps(fields.budgetId, { type: "hidden" })} />
              <input {...getInputProps(fields.id, { type: "hidden" })} />
              <input
                {...getInputProps(fields.diff_price, { type: "hidden" })}
              />
              <InputText
                {...budgetTrackerLabel["estimate_price"]}
                fields={fields}
                onChange={(v) => estimatePrice.change(v.currentTarget.value)}
                className="mb-1"
                onBlur={(e) => {
                  const val = e.currentTarget.value;
                  if (val && realPrice.value) {
                    const diff = Number(val) - Number(realPrice.value);
                    diffPrice.change(String(diff));
                  }
                }}
              />
              <InputText
                {...budgetTrackerLabel["real_price"]}
                fields={fields}
                className="my-1"
                onBlur={(e) => {
                  const val = e.currentTarget.value;
                  if (val && estimatePrice.value) {
                    const diff = Number(estimatePrice.value) - Number(val);
                    diffPrice.change(String(diff));
                  }
                }}
              />
              <TextInput
                className="my-1"
                value={diffPrice.value || 0}
                {...budgetTrackerLabel["diff_price"]}
                disabled
              />
            </Grid.Col>
            <Grid.Col
              span={{
                base: 12,
                sm: 6,
              }}
            >
              <Textarea
                rows={4}
                {...budgetTrackerLabel["description"]}
                {...getInputProps(fields.description, { type: "text" })}
              />
              <InputNumber {...budgetTrackerLabel["qty"]} fields={fields} />
            </Grid.Col>
          </Grid>
        </AppCardForm>
        <AppCardForm isForm={false} title="Budget Tracker List">
          <BudgetTrackerDetails
            data={data?.Transactions as ListTransaction[]}
            setSelectedData={setSelectedData}
          />{" "}
        </AppCardForm>
      </Form>
    </>
  );
};

export default BudgetTrackerForm;

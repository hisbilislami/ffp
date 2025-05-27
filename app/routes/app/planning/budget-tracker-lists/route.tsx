import { Text } from "@mantine/core";
import AppCardForm from "~/components/card/app-card-form";

export default function BudgetTrackerLists() {
  return (
    <>
      <AppCardForm isForm={false} title="Budget Tracker">
        <Text>Table in here</Text>
      </AppCardForm>
    </>
  );
}

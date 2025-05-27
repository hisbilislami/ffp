import AppCardForm from "~/components/card/app-card-form";

export default function User() {
  return (
    <>
      <AppCardForm title="hello" isForm={false}>
        <div>Hello world</div>
      </AppCardForm>
    </>
  );
}

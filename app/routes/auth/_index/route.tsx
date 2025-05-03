import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Button, Flex, PasswordInput, TextInput } from "@mantine/core";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { loginFormSchema, loginLabel } from "./constant";
import { handleAction } from "./action";

export const action = async ({ request }: ActionFunctionArgs) => {
  return await handleAction(request);
};

const Signin = () => {
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(loginFormSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginFormSchema });
    },
  });

  return (
    <Flex>
      <div>
        <Form method="post" {...getFormProps(form)}>
          <TextInput
            {...loginLabel["username"]}
            {...getInputProps(fields.username, { type: "text" })}
            error={fields.username?.errors?.[0] ?? null}
          />
          <PasswordInput
            {...loginLabel["password"]}
            {...getInputProps(fields.password, { type: "password" })}
            error={fields.password?.errors?.[0] ?? null}
          />
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    </Flex>
  );
};

export default Signin;

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  Button,
  Flex,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
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
    <Flex className="h-screen w-full" justify="center" align="center">
      <div className="bg-bill-orange-100 p-8 rounded-xl">
        <Title order={1} mb={50} className="text-bill-orange-500">
          Farm Financial Planning
        </Title>
        <Title order={3} py={4}>
          Sign-in here
        </Title>
        <Text c="dimmed" py={4} mb={30}>
          Enter username & password for sign-in to ffp
        </Text>
        <Form method="post" {...getFormProps(form)} className="space-y-4">
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
          <Button type="submit" size="sm" fullWidth>
            Sign-in
          </Button>
          <Text className="text-xs w-full text-center">
            Don't have an account yet ?
            <Link to="/auth/register" className="underline text-bill-blue-500">
              {" "}
              Register now
            </Link>
          </Text>
        </Form>
      </div>
    </Flex>
  );
};

export default Signin;

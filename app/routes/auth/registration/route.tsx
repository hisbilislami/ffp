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
import { handleAction } from "./action";
import { registrationLabel, schema } from "./constant";

export const action = async ({ request }: ActionFunctionArgs) => {
  return await handleAction(request);
};

const Register = () => {
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: schema });
    },
  });

  return (
    <Flex className="h-screen w-full" justify="center" align="center">
      <div className="bg-bill-orange-100 p-8 rounded-xl">
        <Title order={1} mb={50} className="text-bill-orange-500">
          Farm Financial Planning
        </Title>
        <Title order={3} py={4}>
          Sign-up here
        </Title>
        <Text c="dimmed" py={4} mb={30}></Text>
        <Form method="post" {...getFormProps(form)} className="space-y-4">
          <TextInput
            {...registrationLabel["username"]}
            {...getInputProps(fields.username, { type: "text" })}
            error={fields.username?.errors?.[0] ?? null}
          />
          <PasswordInput
            {...registrationLabel["password"]}
            {...getInputProps(fields.password, { type: "password" })}
            error={fields.password?.errors?.[0] ?? null}
          />
          <PasswordInput
            {...registrationLabel["confirm_password"]}
            {...getInputProps(fields.confirm_password, { type: "password" })}
            error={fields.confirm_password?.errors?.[0] ?? null}
          />
          <Button type="submit" size="sm" fullWidth>
            Sign-in
          </Button>
          <Text className="text-xs w-full text-center">
            Already has an account ?
            <Link to="/auth" className="underline text-bill-blue-500">
              {" "}
              Sign-in Now
            </Link>
          </Text>
        </Form>
      </div>
    </Flex>
  );
};

export default Register;

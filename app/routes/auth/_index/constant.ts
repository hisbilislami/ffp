import { z } from "zod";

export const loginLabel = {
  username: {
    name: "username",
    label: "Username",
    placeholder: "Username",
    withAsterisk: true,
  },
  password: {
    name: "password",
    label: "Password",
    placeholder: "Password",
    withAsterisk: true,
  },
};

export const loginFormSchema = z.object({
  username: z.string({ required_error: "Username is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password at least 8 characters"),
});

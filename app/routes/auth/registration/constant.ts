import { z } from "zod";

export const schema = z
  .object({
    id: z.number().optional(),
    username: z.string().min(3),
    password: z.string().min(8),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password didn't match",
    path: ["confirm_password"],
  });

export const registrationLabel = {
  username: {
    name: "username",
    label: "Username",
    placeholder: "Username",
    withAsterisk: true,
  },
  password: {
    name: "password",
    label: "Password",
    placeholder: "*****",
    withAsterisk: true,
  },
  confirm_password: {
    name: "confirm_password",
    label: "Confirm Password",
    placeholder: "*****",
    withAsterisk: true,
  },
};

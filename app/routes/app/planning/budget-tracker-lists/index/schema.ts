import { z } from "zod";

export const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
  period: z
    .array(z.string().nullable())
    .length(2)
    .refine(([start, end]) => !!start && !!end, {
      message: "Both start and end dates are required",
    }),
});

export const btlLabel = {
  name: {
    label: "Budget title",
    name: "name",
    placeholder: "Budget title",
    withAsterisk: true,
  },
  period: {
    label: "Period",
    name: "period",
    placeholder: "Range Period",
    withAsterisk: true,
  },
};

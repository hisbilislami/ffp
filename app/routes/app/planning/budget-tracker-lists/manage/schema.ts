import { z } from "zod";

export const budgetTrackerLabel = {
  estimate_price: {
    name: "estimate_price",
    label: "Estimate Price",
    placeholder: "Rp. 000,00",
    withAsterisk: true,
  },
  real_price: {
    name: "real_price",
    label: "Real Price",
    placeholder: "Rp. 000,00",
    withAsterisk: true,
  },
  diff_price: {
    name: "diff_price",
    label: "Different Price",
    placeholder: "Rp. 000,00",
    withAsterisk: false,
  },
  qty: {
    name: "qty",
    label: "Qty",
    placeholder: "1",
    withAsterisk: true,
  },
  description: {
    name: "description",
    label: "Description",
    placeholder: "...",
    withAsterisk: false,
  },
};

export const schema = z.object({
  id: z.number().optional(),
  budgetId: z.number(),
  estimate_price: z
    .string()
    .min(1, "Currency is required")
    .transform((val) => val.replace(/,/g, ""))
    .refine((val) => !isNaN(Number(val)), {
      message: "Invalid currency format",
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 0, {
      message: "Amount must be possitive",
    }),
  real_price: z
    .string()
    .min(1, "Currency is required")
    .transform((val) => val.replace(/,/g, ""))
    .refine((val) => !isNaN(Number(val)), {
      message: "Invalid currency format",
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 0, {
      message: "Amount must be possitive",
    }),
  diffPrice: z.string().optional(),
  qty: z.number().min(1),
  description: z.string().optional(),
});

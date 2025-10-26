import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { schema } from "./schema";
import { BadRequestError } from "~/utils/error.server";
import { createToastHeaders } from "~/utils/toast.server";
import { formSessionStorage } from "~/utils/session.server";
import { prisma } from "~/utils/db.server";
import { Prisma } from "@prisma/client";

export const actionHanlder = async (request: ActionFunctionArgs["request"]) => {
  try {
    requireUserId(request);

    const formData = await request.formData();

    const submission = parseWithZod(formData, { schema: schema });

    const session = await formSessionStorage.getSession(
      request.headers.get("Cookie")
    );

    const budgetId = session.get("id_budget");

    if (submission.status !== "success") {
      return submission.reply();
    }

    const opt = submission.value.id ? "edit" : "new";

    const payload: Prisma.TransactionsCreateInput = {
      budget: {
        connect: {
          id: Number(budgetId),
        },
      },
      estimatePrice: submission.value.estimate_price,
      realPrice: submission.value.real_price,
      diffPrice: submission.value.diff_price,
      qty: submission.value.qty,
      description: submission.value.description,
    };

    if (opt === "new") {
      await prisma.transactions.create({
        data: payload as Prisma.TransactionsCreateInput,
      });
    } else {
      const id = submission.value.id;
      await prisma.transactions.update({
        data: payload as Prisma.TransactionsUpdateInput,
        where: {
          id: id,
        },
      });
    }

    return new Response(JSON.stringify(request), {
      headers: await createToastHeaders({
        type: "success",
        title: "Transaction success.",
        description: "Transaction added successfully.",
      }),
    });
  } catch (error) {
    let response: Response;
    if (error instanceof BadRequestError) {
      response = new Response(JSON.stringify(request), {
        headers: await createToastHeaders({
          ...error.details,
          type: "error",
        }),
      });

      return response;
    }

    response = new Response(JSON.stringify(request), {
      headers: await createToastHeaders({
        type: "error",
        title: "Failed",
        description: "Try again in a few minutes",
      }),
    });

    return response;
  }
};

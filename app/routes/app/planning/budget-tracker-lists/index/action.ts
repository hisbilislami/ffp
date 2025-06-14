import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { createDialogHeaders } from "~/utils/dialog.server";
import { BadRequestError } from "~/utils/error.server";
import { formSessionStorage } from "~/utils/session.server";
import { schema } from "./schema";
import { Prisma } from "@prisma/client";

export const actionHandler = async (request: ActionFunctionArgs["request"]) => {
  try {
    const userId = requireUserId(request);

    const formData = await request.formData();

    const action = formData.get("action");
    let id: FormDataEntryValue | number | null | undefined = null;

    if (action === "delete") {
      id = formData.get("id");

      const budget = await prisma.budgets.findFirst({
        where: { id: Number(id) },
      });

      if (!budget) {
        throw new BadRequestError("Bad Request", {
          title: "Failed",
          description: "Data not found.",
        });
      }

      await prisma.$transaction(async (tx) => {
        await tx.budgets.update({
          where: { id: Number(id) },
          data: {
            deletedAt: new Date(),
          },
        });

        await tx.transactions.updateMany({
          where: {
            budgetId: Number(id),
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      });
      return redirect("/app/planning/budget-tracker-list");
    }

    const session = await formSessionStorage.getSession();

    if (action === "edit" || action === "new") {
      const submission = parseWithZod(formData, { schema: schema });
      if (submission.status !== "success") {
        return submission.reply();
      }

      const periods = submission.value.period;
      const periodStart = periods[0];
      const periodEnd = periods[1];
      const data = {
        name: submission.value.name,
        periodStart: new Date(periodStart!),
        periodEnd: new Date(periodEnd!),
        user: {
          connect: {
            id: await userId,
          },
        },
      };

      if (action === "new") {
        await prisma.$transaction(async (tx) => {
          const budget = await tx.budgets.create({
            data: data as Prisma.BudgetsCreateInput,
          });

          id = budget.id;
        });

        session.set("id_budget", id);
      }

      if (action === "edit") {
        id = submission.value.id;
        const budget = await prisma.budgets.findFirst({
          where: { id: Number(id) },
        });

        if (!budget) {
          throw new BadRequestError("Bad Request", {
            title: "Failed",
            description: "Data not found.",
          });
        }

        await prisma.budgets.update({
          where: { id: Number(id) },
          data: data as Prisma.BudgetsUpdateInput,
        });

        return new Response(JSON.stringify(budget.id), {
          headers: await createDialogHeaders({
            type: "success",
            title: "Update Success",
            description: "Data updated successfully",
          }),
        });
      }
    }

    return redirect("/app/planning/budget-tracker-lists/manage", {
      headers: {
        "Set-Cookie": await formSessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    let errorMessage = null;
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Response(JSON.stringify(request), {
      headers: await createDialogHeaders({
        type: "error",
        title: "An error occured.",
        description: errorMessage ?? "Unknown error",
        confirmText: "Try again",
      }),
    });
  }
};

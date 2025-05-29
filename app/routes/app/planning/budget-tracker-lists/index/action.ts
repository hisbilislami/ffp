import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { createDialogHeaders } from "~/utils/dialog.server";
import { BadRequestError } from "~/utils/error.server";
import { formSessionStorage } from "~/utils/session.server";

export const actionHandler = async (request: ActionFunctionArgs["request"]) => {
  try {
    requireUserId(request);

    const formData = await request.formData();
    const id = formData.get("id");
    const action = formData.get("action");

    const budget = await prisma.budgets.findFirst({
      where: { id: Number(id) },
    });

    if (!budget) {
      throw new BadRequestError("Bad Request", {
        title: "Failed",
        description: "Data not found.",
      });
    }

    if (action === "delete") {
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
    session.set("id_budget", id);

    return redirect("/app/planning/budget-tracker-list/manage", {
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

import { data, LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { createDialogHeaders } from "~/utils/dialog.server";
import { formSessionStorage } from "~/utils/session.server";

export const loaderHandler = async (request: LoaderFunctionArgs["request"]) => {
  try {
    await requireUserId(request);

    const session = await formSessionStorage.getSession(
      request.headers.get("Cookie")
    );

    let id = session.get("id_budget");

    if (!id) {
      id = null;
    }

    const budgets = await prisma.budgets.findFirst({
      where: { id: Number(id), deletedAt: null },
      include: {
        Transactions: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    let cleanData = null;

    if (budgets) {
      cleanData = {
        ...budgets,
        Transactions: budgets.Transactions.map((tx) => ({
          ...tx,
          estimatePrice: tx.estimatePrice.toNumber(),
          realPrice: tx.realPrice.toNumber(),
          diffPrice: tx.diffPrice ? tx.diffPrice.toNumber() : null,
        })),
      };
    }

    return data({
      data: cleanData,
      status: "success",
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

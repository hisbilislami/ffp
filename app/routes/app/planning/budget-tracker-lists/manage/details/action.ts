import { ActionFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { BadRequestError } from "~/utils/error.server";
import { createToastHeaders } from "~/utils/toast.server";

export const actionHandler = async (request: ActionFunctionArgs["request"]) => {
  try {
    await requireUserId(request);

    let title: string | null = null;
    let message: string | null = null;

    const formData = await request.formData();

    const action = formData.get("action");

    const id = formData.get("id");

    if (!id) {
      throw new BadRequestError("Bad Request", {
        title: "No ID",
        description: "There's no selected ID",
      });
    }

    switch (action) {
      case "delete": {
        const transaction = await prisma.transactions.findFirst({
          where: { id: Number(id) },
        });

        if (!transaction) {
          throw new BadRequestError("Bad Request", {
            title: "Data not found",
            description: "Can't found data with that selected data",
          });
        }
        await prisma.transactions.update({
          data: {
            deletedAt: new Date(),
          },
          where: {
            id: transaction.id,
          },
        });

        title = "Transaction deleted successfully";
        message = "The transaction has been deleted successfully";

        break;
      }

      default:
        break;
    }

    return new Response(JSON.stringify(request), {
      headers: await createToastHeaders({
        type: "success",
        title: String(title),
        description: String(message),
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

import { Prisma } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
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

    const id = session.get("id_budget");

    const searchParams = new URL(request.url).searchParams;

    const size = Number(searchParams.get("size")) || 10;
    const page = Number(searchParams.get("page")) || 0;
    const offset = page * size;

    const search = searchParams.get("q");

    const where = {
      deletedAt: null,
      budgetId: id,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    } as Prisma.TransactionsWhereInput;

    const details = await prisma.transactions.findMany({
      where,
      take: size,
      skip: offset,
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("detalnya adalah", details);

    const total = await prisma.transactions.count({
      where,
    });

    return new Response(
      JSON.stringify({
        result: {
          data: details,
          totalCount: Number(total),
          pageInfo: {
            hasNextPage: (page + 1) * size < total,
            hasPreviousPage: page > 0,
          },
        },
      })
    );
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

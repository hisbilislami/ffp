import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { Prisma } from "@prisma/client";
import { formSessionStorage } from "~/utils/session.server";
import { createDialogHeaders } from "~/utils/dialog.server";

export const loaderHandler = async (request: LoaderFunctionArgs["request"]) => {
  try {
    await requireUserId(request);

    const searchParams = new URL(request.url).searchParams;
    const size = Number(searchParams.get("size")) || 10;
    const page = Number(searchParams.get("page")) || 0;
    const offset = page * size;

    const search = searchParams.get("q");

    const where = {
      deletedAt: null,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    } as Prisma.BudgetsWhereInput;

    const budgetTracker = await prisma.budgets.findMany({
      where,
      take: size,
      skip: offset,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalCount = await prisma.budgets.count({ where });

    const session = await formSessionStorage.getSession(
      request.headers.get("Cookie")
    );
    session.unset("id_budget");

    return new Response(
      JSON.stringify({
        result: {
          data: budgetTracker,
          totalCount: Number(totalCount),
          pageInfo: {
            hasNextPage: (page + 1) * size < totalCount,
            hasPreviousPage: page > 0,
          },
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": await formSessionStorage.commitSession(session),
        },
      }
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

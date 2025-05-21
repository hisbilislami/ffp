import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { schema } from "./constant";
import { BadRequestError } from "~/utils/error.server";
import { createToastHeaders } from "~/utils/toast.server";
import { prisma } from "~/utils/db.server";

import bcrypt from "bcryptjs";
import { redirectWithDialog } from "~/utils/dialog.server";
import { registrationSessionStorage } from "~/utils/session.server";

export const handleAction = async (request: ActionFunctionArgs["request"]) => {
  try {
    const formData = await request.formData();
    const submission = parseWithZod(formData, { schema: schema });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const user = await prisma.users.findUnique({
      where: { username: submission.value.username },
    });

    if (user) {
      throw new BadRequestError("Bad Request", {
        title: "Failed",
        description: "Username already exist, please use other.",
      });
    }

    await prisma.$transaction(async (tx) => {
      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(submission.value.password, 10);
      await tx.users.create({
        data: {
          username: submission.value.username,
          password: hashedPassword,
        },
      });
    });

    const session = await registrationSessionStorage.getSession();
    session.set("username", submission.value.username);

    return redirectWithDialog(
      "/auth",
      {
        title: "Registration Complete",
        type: "success",
        description: "Registration successfully.",
      },
      {
        headers: {
          "Set-Cookie": await registrationSessionStorage.commitSession(session),
        },
      }
    );
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

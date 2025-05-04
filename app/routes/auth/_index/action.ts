import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { loginFormSchema } from "./constant";
import { prisma } from "~/utils/db.server";

import bcrypt from "bcryptjs";
import { BadRequestError } from "~/utils/error.server";
import { createToastHeaders } from "~/utils/toast.server";
import { createUserSession } from "~/utils/session.server";

export const handleAction = async (request: ActionFunctionArgs["request"]) => {
  const formData = await request.formData();

  try {
    const submission = parseWithZod(formData, { schema: loginFormSchema });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const user = await prisma.users.findUnique({
      where: { username: submission.value.username },
    });

    if (!user || !user.password) {
      throw new BadRequestError("Bad Request", {
        title: "Failed",
        description: "Username and password does not match",
      });
    }

    const isValid = await bcrypt.compare(
      submission.value.password,
      user.password
    );

    if (!isValid) {
      throw new BadRequestError("Bad Request", {
        title: "Failed",
        description: "Username and password does not match",
      });
    }

    return await createUserSession({
      request,
      redirectTo: "/app",
      userId: user.id,
      userCred: {
        username: user.username,
      },
      shouldRemember: false,
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

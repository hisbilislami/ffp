import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { loginFormSchema } from "./constant";
import { prisma } from "~/utils/db.server";

import bcrypt from "bcryptjs";

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
      throw new Error("Username and password does not match");
    }

    const isValid = await bcrypt.compare(
      submission.value.password,
      user.password
    );

    if (!isValid) {
      throw new Error("Username and password does not match");
    }

    return new Response(JSON.stringify(user));
  } catch (error) {
    return new Response(
      JSON.stringify(error instanceof Error ? error.message : null)
    );
  }
};

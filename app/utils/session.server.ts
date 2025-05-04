import { createCookieSessionStorage, data, redirect } from "@remix-run/node";

import { createDialogHeaders } from "./dialog.server";
import { env } from "./env.server";
import { combineHeaders } from "./http";
import redis from "./redis.server";

const { SESSION_SECRET, SESSION_TTL } = env();
export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const formSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__form_session",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export const registrationSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__otp_session",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export const USER_CRED = "userCredential";
export const USER_ID = "userId";

export async function getUserSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return authSessionStorage.getSession(cookie);
}

export type UserCredential = {
  email?: string;
  username: string;
  personId?: number;
};

export async function createUserSession({
  request,
  redirectTo,
  userId,
  userCred,
  shouldRemember,
  headers,
}: {
  request: Request;
  redirectTo: string;
  userId: number;
  userCred: UserCredential;
  shouldRemember: boolean;
  headers?: Headers;
}) {
  const session = await getUserSession(request);
  session.set(USER_CRED, userCred);
  session.set(USER_ID, userId);

  const sessionTtl = shouldRemember ? 3 : parseInt(SESSION_TTL || "1");

  await setRedisUserSession(
    userCred.username,
    { ...userCred, id: userId },
    sessionTtl
  );

  return redirect(redirectTo, {
    headers: combineHeaders(
      {
        "set-cookie": await authSessionStorage.commitSession(session, {
          maxAge: 60 * 60 * 24 * sessionTtl,
        }),
      },
      headers
    ),
  });
}

export async function logout(request: Request) {
  try {
    const session = await getUserSession(request);

    const { username } = session.get(USER_CRED);
    await deleteRedisUserSession(username);

    return redirect("/auth", {
      headers: combineHeaders({
        "Set-Cookie": await authSessionStorage.destroySession(session),
      }),
    });
  } catch (error) {
    let message: string = "";
    if (error instanceof Error) {
      message = error.message;
    }

    return data(
      {
        success: false,
      },
      {
        headers: await createDialogHeaders({
          type: "error",
          title: "Something Wrong",
          description: message,
          confirmText: "Retry",
        }),
      }
    );
  }
}

export async function setRedisUserSession(
  username: string,
  payload: Record<string, number | string>,
  ttl: number
) {
  await redis.set(
    `session:${username}`,
    JSON.stringify(payload),
    "EX",
    60 * 60 * 24 * ttl
  ); // Expires in 1 days by default
}

export async function getRedisUserSession(username: string) {
  return await redis.get(`session:${username}`);
}

export async function deleteRedisUserSession(username: string) {
  await redis.del(`session:${username}`);
}

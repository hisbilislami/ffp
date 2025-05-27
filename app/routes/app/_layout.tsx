import { data, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Sidebar } from "~/components/layout/sidebar";
import { Topnavbar } from "~/components/layout/topnavbar";
import { requireUserId } from "~/utils/auth.server";
import { getUserSession, USER_CRED } from "~/utils/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const session = await getUserSession(request);

  return data({
    ok: true,
    data: { ...session.get(USER_CRED) } as Record<"email" | "username", string>,
  });
};

export default function AuthenticationLayout() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen bg-[var(--mantine-color-gray-3)] p-6">
      <div className="h-full max-h-full flex overflow-hidden rounded-2xl bg-white shadow-sm">
        <Sidebar />
      </div>
      <div className="h-full max-h-full flex flex-col overflow-hidden w-full items-center rounded-2xl">
        <Topnavbar username={data.username} email={data.email} />
        <div className="w-full overflow-y-scroll overflow-x-hidden transition-[transform,width] duration-300 rounded-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

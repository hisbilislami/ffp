import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";

import "@mantine/nprogress/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { getDialog } from "./utils/dialog.server";
import { combineHeaders } from "./utils/http";
import { DialogProvider, useDialog } from "./context/DialogContext";
import { useEffect, useRef } from "react";
import { NavigationProgress, nprogress } from "@mantine/nprogress";
import { Notifications } from "@mantine/notifications";
import DialogMessage from "./components/dialog/dialog-message";

import { theme } from "./utils/mantine-config";
import { getToast } from "./utils/toast.server";
import { useToast } from "./components/toast";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { dialog, headers: dialogHeaders } = await getDialog(request);
  const { toast, headers: toastHeaders } = await getToast(request);

  return data(
    {
      dialog,
      toast,
      ENV: {
        NODE_ENV: process.env.NODE_ENV,
      },
    },
    {
      headers: combineHeaders(dialogHeaders, toastHeaders),
    }
  );
};

function ShowServerDialog() {
  const data = useLoaderData<typeof loader>();

  const dialog = data?.dialog ?? null;
  const { showDialog } = useDialog();

  useEffect(() => {
    if (dialog) {
      showDialog({
        title: dialog.title,
        description: dialog.description,
        icon: dialog.icon,
        type: dialog.type,
        confirmText: dialog.confirmText,
      });
    }
  }, [dialog, showDialog]);

  return null;
}

function ShowServerToast() {
  const data = useLoaderData<typeof loader>();

  const toast = data?.toast ?? null;

  const { toasts } = useToast();

  const hasShown = useRef(false);

  useEffect(() => {
    if (toast && !hasShown.current) {
      hasShown.current = true;
      toasts[toast?.type ?? "message"]({
        title: toast?.title,
        description: toast?.description ?? "",
      });
      hasShown.current = false;
    }
  }, [toast]);

  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const ENV = data?.ENV ?? {};
  const navigation = useNavigation();
  useEffect(() => {
    if (navigation.state !== "idle") {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [navigation.state]);
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)};`,
          }}
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <DialogProvider>
          <MantineProvider theme={theme}>
            <NavigationProgress zIndex={9999} />
            <Notifications />
            <ShowServerToast />
            <DialogMessage />
            <ShowServerDialog />
            {children}
          </MantineProvider>
        </DialogProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

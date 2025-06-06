import {
  type ErrorResponse,
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { captureRemixErrorBoundaryError } from "@sentry/remix";

import { getErrorMessage } from "~/utils/error-boundary";

type StatusHandler = (info: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
}) => JSX.Element | null;

function GeneralErrorBoundary({
  defaultStatusHandler = ({ error }) => (
    <p>
      {error.status} {error.data}
    </p>
  ),
  statusHandlers,
  unexpectedErrorHandler = (error) => <p>{getErrorMessage(error)}</p>,
}: {
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null;
}) {
  const error = useRouteError();
  const params = useParams();

  if (typeof document !== "undefined") {
    console.error(error);
  }

  if (
    error &&
    (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test")
  ) {
    captureRemixErrorBoundaryError(error);
  }

  return (
    <div className="container flex items-center justify-center p-20 text-h2">
      {isRouteErrorResponse(error)
        ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
            error,
            params,
          })
        : unexpectedErrorHandler(error)}
    </div>
  );
}

export default GeneralErrorBoundary;

import { Link, useLocation } from "@remix-run/react";

export const loader = async () => {
  throw new Response("Not Found", { status: 404 });
};

export default function NotFound() {
  return <ErrorBoundary />;
}

export function ErrorBoundary() {
  const location = useLocation();

  return (
    <>
      <h1>Up the page not found. {location.pathname}</h1>
      <Link to="/" className="text-body-md underline">
        Back to home
      </Link>
    </>
  );
}

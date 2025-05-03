import { redirect, type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "ffp" }, { name: "description", content: "FFP" }];
};

export const loader = () => {
  throw redirect("/auth");
};

export default function Index() {
  return <Link to="/auth">Goto sign-in page</Link>;
}

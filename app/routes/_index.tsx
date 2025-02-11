import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, redirect } from "@remix-run/react";
import { getSession } from "~/utils/session";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold">
            Welcome to Ticket Management
          </h1>
          <Link to={"/login"}>Login</Link>
        </header>
      </div>
    </div>
  );
}
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));

  const userId = session.get("userId");
  const userRole = session.get("role");

  if (userId) {
    if (userRole === "ADMIN") {
      return redirect("/admin");
    }
    if (userRole === "CUSTOMER") {
      return redirect("/user");
    }
  }

  return null; // Allow access to login page
};

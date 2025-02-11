import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, redirect } from "@remix-run/react";
import { authenticator } from "~/utils/auth";
import { commitSession, getSession, sessionStorage } from "~/utils/session";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign In
        </h2>
        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-indigo-300 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-indigo-300 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-300"
          >
            Sign In
          </button>
          <p>Don&apos;t have an account </p>
          <Link className=" text-blue-600 hover:underline" to="/signup">
            Register
          </Link>
        </Form>
      </div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );

  try {
    const user = (await authenticator.authenticate("form", request)) as {
      id: string;
      role: string;
    };

    session.set("userId", user.id);
    session.set("role", user.role);
    if (user?.role === "ADMIN") {
      return redirect("/admin", {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    }
    if (user?.role === "CUSTOMER") {
      return redirect("/user", {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    }

    return redirect("/login");
  } catch (error) {
    session.flash("error", (error as Error)?.message);
    return redirect("/login", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
};

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

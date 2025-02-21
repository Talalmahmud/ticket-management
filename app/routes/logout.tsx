import { redirect, ActionFunction } from "@remix-run/node";
import { destroySession, getSession } from "~/utils/session";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

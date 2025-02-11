import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    secrets: [process.env.SESSION_SECRET || "talal"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

import { Authenticator } from "remix-auth";
import bcrypt from "bcryptjs";

export const authenticator = new Authenticator();

import { FormStrategy } from "remix-auth-form";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string | null;
    if (!email) throw new Error("Email is required");
    const password = form.get("password") as string | null;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    if (!password) throw new Error("Password is required");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    return { id: user.id, email: user.email, role: user.role };
  }),
  "form"
);

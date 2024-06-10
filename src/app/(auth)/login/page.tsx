import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { Login } from "./Login";
import { env } from "@/env";

export const metadata = {
  title: "Login",
  description: "Login Page",
};

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) {
    await fetch(`${env.NEXT_PUBLIC_APP_URL}${Paths.Login}/redirect`);
    redirect(Paths.Dashboard);
  }

  return <Login />;
}

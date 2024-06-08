import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { env } from "@/env";

export const metadata = {
  title: "Uni",
  description: "Hello World",
};

export default async function RootPage() {
  const { user } = await validateRequest();

  if (user) {
    await fetch(`${env.NEXT_PUBLIC_APP_URL}/login/redirect`);
    redirect(Paths.Dashboard);
  } else {
    redirect(Paths.Login);
  }
}

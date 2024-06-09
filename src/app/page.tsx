import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";

export const metadata = {
  title: "Uni",
  description: "Hello World",
};

export default async function RootPage() {
  const { user } = await validateRequest();

  if (user) {
    redirect(Paths.Dashboard);
  } else {
    redirect(Paths.Login);
  }
}

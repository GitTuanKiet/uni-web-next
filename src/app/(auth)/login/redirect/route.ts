import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateRequest } from "@lib/auth/validate-request";
import { env } from "@/env";

export async function GET() {
  const base64 = cookies().get("client_id")?.value ?? null;

  if (base64) {
    const { user } = await validateRequest();
    if (user) {
      const redirectUrl = Buffer.from(base64, "base64").toString("utf-8");
      cookies().set("client_id", "", {
        domain: env.NEXT_PUBLIC_APP_DOMAIN,
        expires: new Date(0)
      });

      return redirect(redirectUrl);
    }
  }
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/validate-request";
import { VerifyCode } from "./VerifyCode";
import { Paths } from "@/lib/constants";

export const metadata = {
  title: "Verify Email",
  description: "Verify Email Page",
};

export default async function VerifyEmailPage() {
  const { user } = await validateRequest();

  if (!user) redirect(Paths.Login)
  else if (user.emailVerified) redirect(Paths.Dashboard)
  else window.location.reload();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>
          Verification code was sent to <strong>{user.email}</strong>. Check your spam folder if you
          can't find the email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyCode />
      </CardContent>
    </Card>
  );
}

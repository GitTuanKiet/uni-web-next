import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";
import { ResetPassword } from "./ResetPassword";

export const metadata = {
  title: "Reset Password",
  description: "Reset Password Page",
};

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Enter new password.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPassword token={params.token} />
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "@/hooks/use_toast";
import { logout, verifyEmail, resendVerificationEmail as resendEmail } from "@/lib/auth/actions";
import { Input, Label, SubmitButton, ExclamationTriangleIcon } from "@/components";

export const VerifyCode = () => {
  const [verifyEmailState, verifyEmailAction] = useFormState(verifyEmail, null);
  const [resendState, resendAction] = useFormState(resendEmail, null);
  const codeFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resendState?.success) {
      toast({ title: "Email sent!" });
    }
    if (resendState?.error) {
      toast({
        icon:<ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
        title: resendState.error
      });
    }
  }, [resendState?.error, resendState?.success]);

  useEffect(() => {
    if (verifyEmailState?.error) {
      toast({
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
        title: verifyEmailState.error
      });
    }
  }, [verifyEmailState?.error]);

  return (
    <div className="flex flex-col gap-2">
      <form ref={codeFormRef} action={verifyEmailAction}>
        <Label htmlFor="code">Verification code</Label>
        <Input className="mt-2" type="text" id="code" name="code" required />
        <SubmitButton className="mt-4 w-full">Verify</SubmitButton>
      </form>
      <form action={resendAction}>
        <SubmitButton className="w-full" variant="secondary">
          Resend Code
        </SubmitButton>
      </form>
      <form action={logout}>
        <SubmitButton variant="link" className="p-0 font-normal">
          want to use another email? Log out now.
        </SubmitButton>
      </form>
    </div>
  );
};

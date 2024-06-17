import "server-only";

import { EmailVerificationTemplate } from "./templates/EmailVerification";
import { ResetPasswordTemplate } from "./templates/ResetPassword";
import { PaymentCompletedTemplate } from "./templates/PaymentCompleted";
import { BillingCancelledTemplate } from "./templates/BillingCancelled";
import { render } from "@react-email/render";
import { env } from "@/env";
import { EMAIL_SENDER } from "@/lib/constants";
import { createTransport, type TransportOptions } from "nodemailer";
import type { ComponentProps } from "react";

export enum EmailTemplate {
  EmailVerification = "EmailVerification",
  PasswordReset = "PasswordReset",
  PaymentCompleted = "PaymentCompleted",
  BillingCancelled = "BillingCancelled",
}

export type PropsMap = {
  [EmailTemplate.EmailVerification]: ComponentProps<typeof EmailVerificationTemplate>;
  [EmailTemplate.PasswordReset]: ComponentProps<typeof ResetPasswordTemplate>;
  [EmailTemplate.PaymentCompleted]: ComponentProps<typeof PaymentCompletedTemplate>;
  [EmailTemplate.BillingCancelled]: ComponentProps<typeof BillingCancelledTemplate>;
};

const getEmailTemplate = <T extends EmailTemplate>(template: T, props: PropsMap[NoInfer<T>]) => {
  switch (template) {
    case EmailTemplate.EmailVerification:
      return {
        subject: "Verify your email address",
        body: render(
          <EmailVerificationTemplate {...(props as PropsMap[EmailTemplate.EmailVerification])} />,
        ),
      };
    case EmailTemplate.PasswordReset:
      return {
        subject: "Reset your password",
        body: render(
          <ResetPasswordTemplate {...(props as PropsMap[EmailTemplate.PasswordReset])} />,
        ),
      };
    case EmailTemplate.PaymentCompleted:
      return {
        subject: "Payment completed",
        body: render(
          <PaymentCompletedTemplate {...(props as PropsMap[EmailTemplate.PaymentCompleted])} />,
        ),
      };
    case EmailTemplate.BillingCancelled:
      return {
        subject: "Billing cancelled",
        body: render(
          <BillingCancelledTemplate {...(props as PropsMap[EmailTemplate.BillingCancelled])} />,
        ),
      };
    default:
      throw new Error("Invalid email template");
  }
};

const smtpConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
};

const transporter = createTransport(smtpConfig as TransportOptions);

export const sendMail = async <T extends EmailTemplate>(
  to: string,
  template: T,
  props: PropsMap[NoInfer<T>],
) => {
  if (env.NODE_ENV !== "production") {
    console.log("📨 Email sent to:", to, "with template:", template, "and props:", props);
    return;
  }

  const { subject, body } = getEmailTemplate(template, props);

  return transporter.sendMail({ from: EMAIL_SENDER, to, subject, html: body });
};

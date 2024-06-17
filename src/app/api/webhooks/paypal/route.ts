import { createVerify } from "crypto";
import { unsigned } from "./crc32";

import { env } from "@/env";
import { paypal } from "@/lib/paypal";
import { db } from "@drizzle/db";
import { payers } from "@drizzle/db/schema";
import { eq } from "drizzle-orm";
import { sendMail, EmailTemplate } from "@/components/email";

type EventBillingSubscriptionCreated = {
  event_type: "BILLING.SUBSCRIPTION.CREATED"
  resource: {
    id: string;
    plan_overridden: boolean;
    plan_id: string;
    status: string;
    start_time: string;
    quantity: string;
    subscriber?: { email_address?: string, name?: { given_name: string, surname: string } };
    create_time: string;
    links: {
      href: string;
      rel: string;
      method: string;
    }[];
  };
};

type EventPaymentSaleCompleted = {
  event_type: "PAYMENT.SALE.COMPLETED";
  resource: {
    billing_agreement_id: string;
    amount: {
      total: string;
      currency: string;
      details: unknown;
    };
    payment_mode: string;
    update_time: string;
    create_time: string;
    protection_eligibility_type: string;
    transaction_fee: {
      currency: string;
      value: string;
    };
    protection_eligibility: string;
    links: {
      href: string;
      rel: string;
      method: string;
    }[];
  };
};

type EventBillingSubscriptionActivated = {
  event_type: "BILLING.SUBSCRIPTION.ACTIVATED";
  resource: {
    id: string;
    plan_id: string;
    status: string;
    start_time: string;
    quantity: string;
    subscriber: {
      email_address: string;
      payer_id: string;
      name: {
        given_name: string;
        surname: string;
      };
      shipping_address: {
        address: {
          address_line_1: string;
          address_line_2: string;
          admin_area_2: string;
          admin_area_1: string;
          postal_code: string;
          country_code: string;
        };
      };
    };
    create_time: string;
    update_time: string;
    billing_info: {
      outstanding_balance: {
        currency_code: string;
        value: string;
      };
      cycle_executions: {
        tenure_type: string;
        sequence: number;
        cycles_completed: number;
        cycles_remaining: number;
        total_cycles: number;
      }[];
      last_payment: {
        amount: {
          currency_code: string;
          value: string;
        };
        time: string;
      };
      next_billing_time: string;
      failed_payments_count: number;
    };
    links: {
      href: string;
      rel: string;
      method: string;
    }[];
  };
};

type EventBillingSubscriptionCancelled = {
  event_type: "BILLING.SUBSCRIPTION.CANCELLED";
  resource: {
    id: string;
    plan_id: string;
    status: string;
    start_time: string;
    quantity: string;
    subscriber: {
      email_address: string;
      payer_id: string;
      name: {
        given_name: string;
        surname: string;
      };
      shipping_address: {
        address: {
          address_line_1: string;
          address_line_2: string;
          admin_area_2: string;
          admin_area_1: string;
          postal_code: string;
          country_code: string;
        };
      };
    };
    create_time: string;
    update_time: string;
    billing_info: {
      outstanding_balance: {
        currency_code: string;
        value: string;
      };
      cycle_executions: {
        tenure_type: string;
        sequence: number;
        cycles_completed: number;
        cycles_remaining: number;
        total_cycles: number;
      }[];
      last_payment: {
        amount: {
          currency_code: string;
          value: string;
        };
        time: string;
      };
      next_billing_time: string;
      failed_payments_count: number;
    };
    links: {
      href: string;
      rel: string;
      method: string;
    }[];
  };
};

type Event = EventBillingSubscriptionCreated | EventPaymentSaleCompleted | EventBillingSubscriptionActivated | EventBillingSubscriptionCancelled;

export async function POST(req: Request) {
  const body = await req.text();
  let event: Event;

  try {
    const verified = await verifySignature(body, req.headers);
    if (!verified) {
      return new Response("Webhook signature verification failed.", {
        status: 400,
      });
    }
    event = JSON.parse(body) as Event;
  } catch (err) {
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error."}`, {
      status: 400,
    });
  }

  switch (event.event_type) {
    case "BILLING.SUBSCRIPTION.CREATED": {
      const resourceSubscriptionCreated = event.resource;

      const email = resourceSubscriptionCreated.subscriber?.email_address;
      const userId = resourceSubscriptionCreated.subscriber?.name?.surname;
      if (!email || !userId) {
        console.log("[PAYPAL] Email or user id not found.");
        return new Response("Email or user id not found.", {
          status: 400,
        });
      }

      const subscription = await paypal.subscriptions.retrieve(resourceSubscriptionCreated.id);

      await db
        .update(payers)
        .set({
          paypalSubscriptionId: subscription.id,
          paypalPlanId: subscription.plan_id,
        })
        .where(eq(payers.userId, userId));

      console.log(`[PAYPAL] Subscription created for user ${userId} (${email}).`);

      break;
    }
    case "PAYMENT.SALE.COMPLETED": {
      const resourceSaleCompleted = event.resource;
      
      const subscription = await paypal.subscriptions.retrieve(
        resourceSaleCompleted.billing_agreement_id,
      );

      const payerSubscription = await db.query.payers.findFirst({
        where: (table, { eq }) => eq(table.paypalSubscriptionId, subscription.id),
      });

      if (!payerSubscription) {
        console.log(`[PAYPAL] Subscription not found for sale ${subscription.id}.`);
        return new Response("Subscription not found.", {
          status: 400,
        });
      }

      await db
        .update(payers)
        .set({
          paypalPayerId: subscription.subscriber.payer_id,
        })
        .where(eq(payers.paypalSubscriptionId, subscription.id));

      await sendMail(payerSubscription.email, EmailTemplate.PaymentCompleted, {
        name: payerSubscription.email,
        amount: resourceSaleCompleted.amount.total,
      });

      console.log(`[PAYPAL] Sale completed for user ${payerSubscription.userId} (${payerSubscription.email}).`);

      break;
    }
    case "BILLING.SUBSCRIPTION.ACTIVATED": {
      const resourceSubscriptionActivated = event.resource;
      const subscription = await paypal.subscriptions.retrieve(resourceSubscriptionActivated.id);

      const payerSubscription = await db.query.payers.findFirst({
        where: (table, { eq }) => eq(table.paypalSubscriptionId, subscription.id),
      });

      if (!payerSubscription) {
        console.log(`[PAYPAL] Subscription not found for activation ${subscription.id}.`);
        return new Response("Subscription not found.", {
          status: 400,
        });
      }

      await db
        .update(payers)
        .set({
          paypalPayerId: subscription.subscriber.payer_id,
          paypalCurrentPeriodEnd: new Date(subscription.billing_info.next_billing_time),
        })
        .where(eq(payers.paypalSubscriptionId, subscription.id));

      console.log(`[PAYPAL] Subscription activated for user ${payerSubscription.userId} (${payerSubscription.email}).`);

      break;
    }
    case "BILLING.SUBSCRIPTION.CANCELLED": {
      const resourceSubscriptionCancelled = event.resource;

      const payer = await db.query.payers.findFirst({
        where: (table, { eq, and }) =>
          and(
            eq(table.paypalSubscriptionId, resourceSubscriptionCancelled.id),
            eq(table.paypalPayerId, resourceSubscriptionCancelled.subscriber.payer_id),
          ),
      });

      if (!payer) {
        console.log(`[PAYPAL] Subscription not found for cancellation ${resourceSubscriptionCancelled.id}.`);
        return new Response("Subscription not found.", {
          status: 400,
        });
      }

      await sendMail(payer.email, EmailTemplate.BillingCancelled, {
        name: payer.email,
      });

      console.log(`[PAYPAL] Subscription cancelled for user ${payer?.userId} (${payer?.email}).`);

      break;
    }
    default:
      return new Response("Event type not supported.", {
        status: 400,
      });
  }

  return new Response("Webhook received successfully.", {
    status: 200,
  });
}

async function downloadAndCache(url: string, cacheKey?: string) {
  const CACHE_DIR = ".next/cache/paypal";
  if (!cacheKey) {
    cacheKey = url.replace(/\W+/g, "-");
  }
  const filePath = `${CACHE_DIR}/${cacheKey}`;

  try {
    const fs = await import("fs/promises");

    // Create cache directory if it doesn't exist
    await fs.mkdir(CACHE_DIR, { recursive: true });

    // Check if cached file exists
    const cachedData = await fs.readFile(filePath, "utf-8").catch(() => null);
    if (cachedData) {
      return cachedData;
    }

    // Download the file if not cached
    const response = await fetch(url);
    const data = await response.text();
    await fs.writeFile(filePath, data);

    return data;
  } catch (err) {
    console.error(err);
    return "";
  }
}

async function verifySignature(payload: string, headers: Headers) {
  const signature = headers.get("Paypal-Transmission-Sig");
  const transmissionId = headers.get("Paypal-Transmission-Id");
  const timestamp = headers.get("Paypal-Transmission-Time");
  const certUrl = headers.get("Paypal-Cert-Url");
  if (!signature || !transmissionId || !timestamp || !certUrl) {
    throw new Error("Missing required headers.");
  }

  const crcValue = unsigned(payload);
  const certPem = await downloadAndCache(certUrl);
  const signatureBuffer = Buffer.from(signature, "base64");
  const verifier = createVerify("RSA-SHA256");

  verifier.update(`${transmissionId}|${timestamp}|${env.PAYPAL_WEBHOOK_ID}|${crcValue}`);

  return verifier.verify(certPem, signatureBuffer);
}
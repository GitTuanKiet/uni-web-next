import { env } from "@/env";
import { Info_App } from "./constants";

class PayPal {
  private baseUrl: string;
  private accessToken: string;
  private expiresAt: number;

  constructor() {
    this.baseUrl =
      env.NODE_ENV === "production" ? "https://api.paypal.com" : "https://api-m.sandbox.paypal.com";
    this.accessToken = "";
    this.expiresAt = 0;
  }

  private async generateAccessToken() {
    const clientId = env.PAYPAL_CLIENT_ID;
    const clientSecret = env.PAYPAL_CLIENT_SECRET;

    try {
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = (await response.json()) as {
        scope: string;
        access_token: string;
        token_type: string;
        app_id: string;
        expires_in: number;
        nonce: string;
      };

      if (!data.scope.includes("https://uri.paypal.com/services/subscriptions")) {
        throw new Error("Missing required scope.");
      }
      this.accessToken = data.access_token;
      this.expiresAt = Date.now() + data.expires_in * 0.9;
    } catch (err) {
      console.error("Error generating paypal access token", err);
    }
  }

  async init() {
    console.log("🚀 ~ PayPal ~ init ~ this.expiresAt < Date.now():", this.expiresAt < Date.now());
    if (this.expiresAt < Date.now()) {
      await this.generateAccessToken();
    }
  }

  private async fetcher<T>(url?: string, init?: RequestInit) {
    await this.init();
    try {
      const response = await fetch(`${this.baseUrl}/${url}`, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return (await response.json()) as T;
    } catch (err) {
      console.error("Error fetching paypal data: ", err);
      return {} as T;
    }
  }

  async subscriptionsRetrieve(subscriptionId: string) {
    return this.fetcher<PaypalSubscription>(`v1/billing/subscriptions/${subscriptionId}`, {
      method: "GET",
    });
  }

  async plansRetrieve(planId: string) {
    return this.fetcher<PaypalPlan>(`v1/billing/plans/${planId}`, { method: "GET" });
  }

  async billingPortalSessionsCreate({ subscriptionId }: { subscriptionId: string }) {
    const baseUrl =
      this.baseUrl === "https://api.paypal.com"
        ? "https://www.paypal.com"
        : "https://www.sandbox.paypal.com";
    const url = `${baseUrl}/myaccount/autopay/connect/${subscriptionId}`;
    return { url };
  }

  async checkoutSessionsCreate({
    returnUrl,
    cancelUrl,
    userId,
    planId,
    quantity,
    emailAddress,
  }: {
    returnUrl: string;
    cancelUrl: string;
    userId: string;
    planId: string;
    quantity: number;
    emailAddress: string;
  }) {
    return this.fetcher<PaypalSubscription>(`v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        plan_id: planId,
        quantity,
        subscriber: {
          email_address: emailAddress,
          name: {
            surname: userId,
          },
        },
        application_context: {
          brand_name: Info_App.title,
          return_url: returnUrl,
          cancel_url: cancelUrl,
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
          },
          user_action: "SUBSCRIBE_NOW",
        },
      }),
    });
  }

  async paypal() {
    return {
      plans: {
        retrieve: this.plansRetrieve.bind(this),
      },
      subscriptions: {
        retrieve: this.subscriptionsRetrieve.bind(this),
      },
      checkout: {
        sessions: {
          create: this.checkoutSessionsCreate.bind(this),
        },
      },
      billingPortal: {
        sessions: {
          create: this.billingPortalSessionsCreate.bind(this),
        },
      },
    };
  }

  // async paypalWebhook(req: Request) {
  //   const body = await req.text();
  //   const signature = req.headers.get("Paypal-Auth-Algo") ?? "";
  //   const certUrl = req.headers.get("Paypal-Cert-Url") ?? "";
  //   const transmissionId = req.headers.get("Paypal-Transmission-Id") ?? "";
  //   const transmissionSig = req.headers.get("Paypal-Transmission-Sig") ?? "";
  //   const transmissionTime = req.headers.get("Paypal-Transmission-Time") ?? "";

  //   const webhookId = env.PAYPAL_WEBHOOK_ID;

  //   const webhookEvent = {
  //     cert_url: certUrl,
  //     auth_algo: signature,
  //     transmission_id: transmissionId,
  //     transmission_sig: transmissionSig,
  //     transmission_time: transmissionTime,
  //     webhook_id: webhookId,
  //     webhook_event: body,
  //   };

  //   const { verification_status } = await this.fetcher<{ verification_status: string }>(
  //     "/v1/notifications/verify-webhook-signature",
  //     {
  //       method: "POST",
  //       body: JSON.stringify(webhookEvent),
  //     }
  //   );

  //   if (verification_status !== "SUCCESS") {
  //     throw new Error("Webhook verification failed.");
  //   }

  //   return JSON.parse(body);
  // }
}

type PaypalPlan = {
  id: string;
  name: string;
  status: string;
  description: string;
  usage_type: string;
  create_time: string;
  billing_cycles: {
    frequency: {
      interval_unit: string;
      interval_count: number;
    };
    tenure_type: string;
    total_cycles: number;
    pricing_scheme: {
      fixed_price: {
        value: string;
        currency_code: string;
      };
    };
  }[];
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
};
type PaypalSubscription = {
  id: string;
  plan_id: string;
  start_time: string;
  quantity: string;
  shipping_amount: {
    currency_code: string;
    value: string;
  };
  subscriber: {
    shipping_address: {
      name: {
        full_name: string;
      };
      address: {
        address_line_1: string;
        address_line_2: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: string;
      };
    };
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
    payer_id: string;
  };
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
  create_time: string;
  update_time: string;
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
  status: string;
  status_update_time: string;
};

type Order = {
  id: string;
  status: string;
  intent: string;
  payment_source: {
    payer: {
      name: {
        given_name: string;
        surname: string;
      };
      email_address: string;
    };
  };
  purchase_units: {
    amount: {
      value: string;
      currency_code: string;
    };
  }[];
  payer: {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
    payer_id: string;
  };
  create_time: string;
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
};

const p = new PayPal();
export default p;
export const paypal = await p.paypal();
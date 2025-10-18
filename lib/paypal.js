// lib/paypal.js
import paypal from "@paypal/checkout-server-sdk";

let client;

export function getPayPalClient() {
  if (client) return client;

  const env =
    process.env.PAYPAL_ENV === "live"
      ? new paypal.core.LiveEnvironment(
          process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          process.env.PAYPAL_SECRET
        )
      : new paypal.core.SandboxEnvironment(
          process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          process.env.PAYPAL_SECRET
        );

  client = new paypal.core.PayPalHttpClient(env);
  return client;
}

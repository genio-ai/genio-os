// lib/braintree.js
import braintree from "braintree";

let gatewayInstance;

export function getBraintreeGateway() {
  if (gatewayInstance) return gatewayInstance;

  // اقرأ أي متغيّر ووازن حالة الأحرف
  const rawEnv =
    process.env.BRAINTREE_ENVIRONMENT || // Production / Sandbox
    process.env.BRAINTREE_ENV ||         // production / sandbox
    "Sandbox";

  const environment =
    String(rawEnv).toLowerCase() === "production"
      ? braintree.Environment.Production
      : braintree.Environment.Sandbox;

  const { BRAINTREE_MERCHANT_ID, BRAINTREE_PUBLIC_KEY, BRAINTREE_PRIVATE_KEY } = process.env;

  if (!BRAINTREE_MERCHANT_ID || !BRAINTREE_PUBLIC_KEY || !BRAINTREE_PRIVATE_KEY) {
    throw new Error("Missing Braintree env vars");
  }

  gatewayInstance = new braintree.BraintreeGateway({
    environment,
    merchantId: BRAINTREE_MERCHANT_ID,
    publicKey: BRAINTREE_PUBLIC_KEY,
    privateKey: BRAINTREE_PRIVATE_KEY,
  });

  return gatewayInstance;
}

// lib/braintree.js
import braintree from "braintree";

let gatewayInstance;

export function getBraintreeGateway() {
  if (gatewayInstance) return gatewayInstance;

  const environment =
    process.env.BRAINTREE_ENV === "production"
      ? braintree.Environment.Production
      : braintree.Environment.Sandbox;

  gatewayInstance = new braintree.BraintreeGateway({
    environment,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

  return gatewayInstance;
}

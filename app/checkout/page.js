// app/checkout/page.js
"use client";
import { useEffect } from "react";

export default function CheckoutPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.history.length > 1) window.history.back();
      else window.location.href = "/";
    }
  }, []);

  return null;
}

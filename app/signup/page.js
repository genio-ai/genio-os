"use client";

import "./signup.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const USERS_KEY = "users_db";
const AUTH_KEY = "auth_user";
const DRAFT_KEY = "signup_draft";
const TWIN_DRAFT_KEY = "twin_ob_draft";

function isValidPhone(p) {
  if (!p) return false;
  const v = String(p).trim();
  return /^\+?[1-9]\d{7,14}$/.test(v);
}

function safeGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function safeSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}
function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const a = new Uint32Array(4);
    crypto.getRandomValues(a);
    return [...a].map((n) => n.toString(16).padStart(8, "0")).join("");
  }
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
function stepToPath(step) {
  switch (step) {
    case "personality":
      return "/onboarding/personality";
    case "voice":
      return "/onboarding/voice";
    case "video":
      return "/onboarding/video";
    case "review":
      return "/onboarding/review";
    default:
      return "/onboarding/personality";
  }
}

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = use

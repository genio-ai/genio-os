// components/TwinModal.js
import { useState } from "react";

export default function TwinModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items

import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-6 bg-slate-900 text-white">{children}</div>;
}

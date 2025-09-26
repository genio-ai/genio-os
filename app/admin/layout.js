"use client";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  );
}

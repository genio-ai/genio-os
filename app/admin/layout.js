export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-[#0b0f17] text-[#e5e7eb] flex">
        {children}
      </body>
    </html>
  );
}

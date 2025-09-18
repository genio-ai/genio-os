import Header from "./Header";
import Footer from "./Footer";

export default function LayoutShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b1220] text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

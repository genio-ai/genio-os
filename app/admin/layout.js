import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { assertAdmin } from "./lib/guard";

export const metadata = { title: "Genio OS — Admin" };

export default async function AdminLayout({ children }) {
  await assertAdmin();

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen grid grid-cols-[260px_1fr]">
          <Sidebar />
          <div className="flex flex-col">
            <Topbar />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

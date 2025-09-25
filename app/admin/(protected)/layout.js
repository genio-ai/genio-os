import { assertAdmin } from "../lib/guard";

export default async function AdminProtectedLayout({ children }) {
  await assertAdmin();
  return <>{children}</>;
}

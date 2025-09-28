import { redirect } from "next/navigation";

export default function Page() {
  // Redirect "/" to the Pages Router home at /index
  redirect("/index");
}

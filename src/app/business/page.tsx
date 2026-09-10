import { redirect } from "next/navigation";

// /business has no screen of its own — it just sends the user to the
// dashboard, same as buyer/investor/admin's role-root pages are meant to.
export default function Page() {
  redirect("/business/dashboard");
}

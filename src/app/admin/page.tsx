import { redirect } from "next/navigation";

// /admin has no screen of its own — it just sends the user to the
// overview, same as business/buyer/investor's role-root pages are meant to.
export default function Page() {
  redirect("/admin/overview");
}

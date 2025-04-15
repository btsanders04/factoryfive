import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation"
import { MAIN_ROUTES } from "./routes";

export default async function RootPage() {
  let user = null;
  try {
    user = await stackServerApp.getUser();
  } catch (e) {
    user = null;
  }

  if (user) {
    return redirect(MAIN_ROUTES.dashboard.link);
  }
  return redirect(MAIN_ROUTES.buildlog.link);
}
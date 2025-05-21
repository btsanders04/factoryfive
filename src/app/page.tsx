import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation"
import { MAIN_ROUTES } from "./routes";

export default async function RootPage() {
  await stackServerApp.getUser({ or: 'redirect' });
  return redirect(MAIN_ROUTES.dashboard.link);
}
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation"
import { ROUTES } from "./routes";
export default async function RootPage() {
  await stackServerApp.getUser({ or: 'redirect' });
  return redirect(ROUTES.dashboard);
}
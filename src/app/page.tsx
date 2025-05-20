import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation"
import { MAIN_ROUTES } from "./routes";
import { usePostHog } from 'posthog-js/react';

export default async function RootPage() {
  const user = await stackServerApp.getUser({ or: 'redirect' });
   // Identify the user in PostHog with their name
   const posthog = usePostHog();
   if (posthog) {
    posthog.identify(posthog.get_distinct_id(), {
      name: user.displayName
    });
  }
  return redirect(MAIN_ROUTES.dashboard.link);
}
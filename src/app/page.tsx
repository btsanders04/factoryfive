import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation"
import { MAIN_ROUTES } from "./routes";
import PostHogClient from './posthog';

export default async function RootPage() {
  const user = await stackServerApp.getUser({ or: 'redirect' });
   // Identify the user in PostHog with their name
   const posthog = PostHogClient();
   if (posthog) {
    posthog.identify({
      distinctId: user.id,
      properties: {
        name: user.displayName
      }
    });
  }
  return redirect(MAIN_ROUTES.dashboard.link);
}
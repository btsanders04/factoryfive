import { ROUTES } from "@/app/routes";
import { redirect } from "next/navigation";

export default function SettingsPage() {
    redirect(ROUTES.comingsoon.link)
}
import { comingsoon } from "@/app/routes";
import { redirect } from "next/navigation";

export default function SettingsPage() {
    redirect(comingsoon.link)
}
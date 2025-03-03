import { ROUTES } from "@/app/routes";
import { redirect } from "next/navigation";

export default function HelpPage() {
    redirect(ROUTES.comingsoon.link)
}
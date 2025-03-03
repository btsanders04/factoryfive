import { comingsoon } from "@/app/routes";
import { redirect } from "next/navigation";

export default function HelpPage() {
    redirect(comingsoon.link)
}
import { comingsoon } from "@/app/routes";
import { redirect } from "next/navigation";

export default function PhotosPage() {
    redirect(comingsoon.link)
}
"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabsHeader() {
  const pathname = usePathname();
  const isTimelineActive = pathname === "/buildlog/timeline";

  return (
    <Tabs
      value={isTimelineActive ? "timeline" : "calendar"}
      className="w-full mb-8"
    >
      <TabsList className="grid w-full grid-cols-2">
        <Link href="/buildlog/timeline">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Timeline</span>
          </TabsTrigger>
        </Link>

        <Link href="/buildlog/calendar">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Calendar</span>
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}

"use client";

import Calendar from "./components/Calendar";

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col space-y-8">
        <Calendar></Calendar>
      </div>
    </div>
  );
}

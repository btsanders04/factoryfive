"use client";

import Calendar from "./components/Calendar";
import { TotalHoursWorked } from "./components/TotalHoursWorked";

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Work Calendar</h1>
            <p className="text-gray-500">Track your build time and schedule</p>
          </div>
        </div>
        
        {/* Total Hours Worked Component - now using centralized config */}
        <TotalHoursWorked />
        
        {/* Calendar Component */}
        <Calendar></Calendar>
      </div>
    </div>
  );
}

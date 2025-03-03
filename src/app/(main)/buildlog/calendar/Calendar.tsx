import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
} from "lucide-react";
import HoursWorkedModal from "./HoursWorkedModal";

export default function Calendar() {
    // State for current date and displayed month/year
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [displayMonth, setDisplayMonth] = useState(new Date());
    const [isHoursWorkedOpen, setIsHoursWorkedOpen] = useState(false);

    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Get month and year for display
    const monthNames = [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER",
    ];

    // Get days to display in the calendar (including days from prev/next months)
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    // Get the last day of the previous month
    const getLastDayOfPrevMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };

    // Generate calendar data for the current display month
    const generateCalendarData = () => {
        const year = displayMonth.getFullYear();
        const month = displayMonth.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        const lastDayOfPrevMonth = getLastDayOfPrevMonth(year, month);

        const calendarData = [];
        let week = [];

        // Add days from previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const prevMonthDay = lastDayOfPrevMonth - firstDayOfMonth + i + 1;
            week.push({
                day: prevMonthDay,
                isCurrentMonth: false,
                date: new Date(year, month - 1, prevMonthDay),
            });
        }

        // Add days from current month
        for (let day = 1; day <= daysInMonth; day++) {
            week.push({
                day,
                isCurrentMonth: true,
                date: new Date(year, month, day),
                isToday:
                    new Date(year, month, day).toDateString() ===
                    new Date().toDateString(),
            });

            // Start a new week
            if ((firstDayOfMonth + day) % 7 === 0 || day === daysInMonth) {
                calendarData.push(week);
                week = [];
            }
        }

        // Add days from next month to fill the last week
        const lastWeek = calendarData[calendarData.length - 1];
        if (lastWeek.length < 7) {
            const daysToAdd = 7 - lastWeek.length;
            for (let i = 1; i <= daysToAdd; i++) {
                lastWeek.push({
                    day: i,
                    isCurrentMonth: false,
                    date: new Date(year, month + 1, i),
                });
            }
        }

        // Add an additional week if we have fewer than 6 rows
        if (calendarData.length < 6) {
            const lastDay = calendarData[calendarData.length - 1][6].day;
            const nextWeek = [];
            for (let i = 1; i <= 7; i++) {
                nextWeek.push({
                    day: lastDay + i,
                    isCurrentMonth: false,
                    date: new Date(year, month + 1, lastDay + i),
                });
            }
            calendarData.push(nextWeek);
        }

        return calendarData;
    };

    // Functions to navigate between months
    const goToPreviousMonth = () => {
        setDisplayMonth(
            new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1)
        );
    };

    const goToNextMonth = () => {
        setDisplayMonth(
            new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1)
        );
    };

    const compareDates = (date1: Date, date2: Date) => {
        return date1.toDateString() === date2.toDateString();
    };

    const goToToday = () => {
        const today = new Date();
        handleDateClick(today);
        setDisplayMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    };

    // Handle date selection
    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsHoursWorkedOpen(true);
    };

    const calendarData = generateCalendarData();

    return (
        <div>
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToPreviousMonth}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>

                        <CardTitle className="text-3xl font-bold tracking-tight">
                            {monthNames[displayMonth.getMonth()]} {displayMonth.getFullYear()}
                        </CardTitle>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToNextMonth}
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4"/>
                        </Button>
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToToday}
                            className="flex items-center gap-1"
                        >
                            <CalendarIcon className="h-4 w-4"/> Today
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="pt-4">
                    <div className="border rounded-md overflow-hidden">
                        {/* Days of Week Header */}
                        <div className="grid grid-cols-7 bg-muted">
                            {daysOfWeek.map((day, index) => (
                                <div
                                    key={index}
                                    className="p-3 text-center text-xs font-medium text-muted-foreground"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="bg-card">
                            {calendarData.map((week, weekIndex) => (
                                <div
                                    key={weekIndex}
                                    className="grid grid-cols-7 border-t first:border-t-0"
                                >
                                    {week.map((date, dateIndex) => (
                                        <div
                                            key={dateIndex}
                                            className={`p-0 aspect-square relative border-r last:border-r-0 ${
                                                date.isToday ? "bg-accent" : ""
                                            }`}
                                            onClick={() => handleDateClick(date.date)}
                                        >
                                            <button
                                                className={`absolute inset-0 w-full h-full flex items-start justify-start p-2 hover:bg-accent/50  ${
                                                    !date.isCurrentMonth ? "text-muted-foreground" : ""
                                                }  ${compareDates(date.date, selectedDate) ? "bg-accent/50" : ""}`}
                                            >
                        <span
                            className={`h-6 w-6 text-sm flex items-center justify-center rounded-full hover:bg-primary hover:text-primary-foreground  ${compareDates(date.date, selectedDate) ? "bg-primary text-primary-foreground" : ""}`}
                        >
                          {date.day}
                        </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <HoursWorkedModal
                open={isHoursWorkedOpen}
                totalHours={0}
                date={selectedDate}
            ></HoursWorkedModal>
        </div>
    );
}

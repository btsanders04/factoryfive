export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration?: number; // in hours
  description?: string;
  category?: string;
  location?: string;
  isAllDay?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEventWithRelations extends CalendarEvent {
  // Add any relations here if needed
} 
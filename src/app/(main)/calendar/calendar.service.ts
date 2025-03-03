import { Prisma, WorkHour } from "@prisma/client";

export async function updateHoursForDate(
  workHourData: Prisma.WorkHourUncheckedUpdateInput
): Promise<WorkHour> {
  const response = await fetch("/api/workhours", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workHourData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const data = (await response.json()) as WorkHour;
  return { ...data, date: new Date(data.date) };
}

export async function getAllWorkHours(): Promise<Record<string, WorkHour>> {
  const response = await fetch("/api/workhours", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const workHoursArray = (await response.json()) as WorkHour[];
  const workHourRecord = workHoursArray.reduce(
    (record, workhour) => {
      // Format the date as a string (YYYY-MM-DD)
      const timestamp = workhour.date as unknown as string;

      // Add to the record with the date string as the key
      record[timestamp] = workhour;

      return record;
    },
    {} as Record<string, WorkHour>
  );
  return workHourRecord;
}

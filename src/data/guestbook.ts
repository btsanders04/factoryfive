
/**
 * Interface for guestbook entry data
 */
export interface GuestbookEntry {
  id: number;
  name: string;
  message?: string | null;
  visitDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fetches all guestbook entries from the API
 * @returns Promise resolving to an array of GuestbookEntry items
 */
export async function getAllGuestbookEntries(): Promise<GuestbookEntry[]> {
  const response = await fetch("/api/guestbook", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const res = (await response.json()) as GuestbookEntry[];
  return res.map((entry) => ({
    ...entry,
    visitDate: new Date(entry.visitDate),
    createdAt: new Date(entry.createdAt),
    updatedAt: new Date(entry.updatedAt),
  })) as GuestbookEntry[];
}

/**
 * Creates a new guestbook entry
 * @param entry The guestbook entry data to create
 * @returns Promise resolving to the created GuestbookEntry
 */
export async function createGuestbookEntry(
  entry: Omit<GuestbookEntry, "id" | "createdAt" | "updatedAt">
): Promise<GuestbookEntry> {
  const response = await fetch("/api/guestbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const entryCreated = await response.json();
  return {
    ...entryCreated,
    visitDate: new Date(entryCreated.visitDate),
    createdAt: new Date(entryCreated.createdAt),
    updatedAt: new Date(entryCreated.updatedAt),
  };
}

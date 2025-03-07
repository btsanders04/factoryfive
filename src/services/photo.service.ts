export interface PhotoData {
  id: number;
  url: string;
  cacheKey: string;
  title: string;
}

export async function getPhotos(): Promise<PhotoData[]> {
  const response = await fetch("/api/photos", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<PhotoData[]>;
}

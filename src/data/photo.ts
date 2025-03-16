export interface PhotoData {
  id: number;
  url: string;
  cacheKey: string;
  title: string;
}

/**
 * Fetches all photos from the API
 * @returns Promise resolving to an array of PhotoData items
 */
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
  const data = (await response.json()) as PhotoData[];
  return data.map((photo) => ({
    ...photo,
    url: `${photo.url}`,
  }));
} 
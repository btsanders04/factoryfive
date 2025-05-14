export interface PhotoData {
  id: number;
  url: string;
  cacheKey: string;
  title: string;
}

export interface PaginationData {
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

export interface PaginatedPhotosResponse {
  photos: PhotoData[];
  pagination: PaginationData;
}

/**
 * Fetches photos from the API with pagination support
 * @param offset - Number of items to skip (default: 0)
 * @param limit - Maximum number of items to return (default: 20)
 * @returns Promise resolving to a PaginatedPhotosResponse
 */
export async function getPhotos(offset = 0, limit = 20): Promise<PaginatedPhotosResponse> {
  const response = await fetch(`/api/photos?offset=${offset}&limit=${limit}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json() as PaginatedPhotosResponse;
  
  // Ensure URLs are properly formatted
  data.photos = data.photos.map((photo) => ({
    ...photo,
    url: `${photo.url}`,
  }));
  
  return data;
}

/**
 * Fetches all photos from the API (legacy method)
 * @deprecated Use getPhotos with pagination instead
 * @returns Promise resolving to an array of PhotoData items
 */
export async function getAllPhotos(): Promise<PhotoData[]> {
  const { photos } = await getPhotos(0, 999);
  return photos;
}
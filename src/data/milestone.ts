import { Milestone, Prisma } from "@prisma/client";

/**
 * Fetches all milestones from the API
 * @returns Promise resolving to an array of Milestone items
 */
export async function getAllMilestones(): Promise<Milestone[]> {
  const response = await fetch("/api/milestones", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const res = (await response.json()) as Milestone[];
  return res.map((milestone) => ({
    ...milestone,
    date: new Date(milestone.date),
    createdAt: new Date(milestone.createdAt),
    updatedAt: new Date(milestone.updatedAt),
  })) as Milestone[];
}

/**
 * Creates a new milestone
 * @param milestone The milestone data to create
 * @returns Promise resolving to the created Milestone
 */
export async function createMilestone(
  milestone: Prisma.MilestoneCreateInput
): Promise<Milestone> {
  const response = await fetch("/api/milestones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(milestone),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const milestoneCreated = await response.json();
  return {
    ...milestoneCreated,
    date: new Date(milestoneCreated.date),
    createdAt: new Date(milestoneCreated.createdAt),
    updatedAt: new Date(milestoneCreated.updatedAt),
  };
}

/**
 * Sets the primary photo for a milestone
 * @param id The ID of the milestone to update
 * @param url The URL of the photo to set as primary
 * @returns Promise resolving to the updated Milestone
 */
export async function setPrimaryPhotoOnMilestone(
  id: number,
  url: string
): Promise<Milestone> {
  const response = await fetch(`/api/milestones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ featuredImage: url }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const milestoneUpdated = await response.json();
  return {
    ...milestoneUpdated,
    date: new Date(milestoneUpdated.date),
    createdAt: new Date(milestoneUpdated.createdAt),
    updatedAt: new Date(milestoneUpdated.updatedAt),
  };
}

/**
 * Updates a milestone
 * @param id The ID of the milestone to update
 * @param data The data to update the milestone with
 * @returns Promise resolving to the updated Milestone
 */
export async function updateMilestone(
  id: number,
  data: Prisma.MilestoneUpdateInput
): Promise<Milestone> {
  const response = await fetch(`/api/milestones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const milestoneUpdated = await response.json();
  return {
    ...milestoneUpdated,
    date: new Date(milestoneUpdated.date),
    createdAt: new Date(milestoneUpdated.createdAt),
    updatedAt: new Date(milestoneUpdated.updatedAt),
  };
}

/**
 * Updates the secondary photos for a milestone
 * @param id The ID of the milestone to update
 * @param secondaryPhotos Array of photo URLs to set as secondary photos
 * @returns Promise resolving to the updated Milestone
 */
export async function updateSecondaryPhotosOnMilestone(
  id: number,
  secondaryPhotos: string[]
): Promise<Milestone> {
  const response = await fetch(`/api/milestones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ additionalImages: secondaryPhotos }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const milestoneUpdated = await response.json();
  return {
    ...milestoneUpdated,
    date: new Date(milestoneUpdated.date),
    createdAt: new Date(milestoneUpdated.createdAt),
    updatedAt: new Date(milestoneUpdated.updatedAt),
  };
} 
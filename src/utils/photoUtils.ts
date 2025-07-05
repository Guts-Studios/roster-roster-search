import { Personnel } from "@/types";

/**
 * Generate potential photo filenames for a personnel record
 * Format: lastname_firstname_badgenumber.webp or lastname_firstname.webp
 */
export const getPhotoUrl = (person: Personnel): string | null => {
  if (!person.first_name || !person.last_name) return null;
  
  // Clean and format names (lowercase, handle spaces)
  const lastName = person.last_name.toLowerCase().replace(/\s+/g, '_');
  const firstName = person.first_name.toLowerCase().replace(/\s+/g, '_');
  
  // Try with badge number first if available
  if (person.badge_number) {
    const withBadge = `/photos/${lastName}_${firstName}_${person.badge_number}.webp`;
    return withBadge;
  }
  
  // Fallback to name only
  const nameOnly = `/photos/${lastName}_${firstName}.webp`;
  return nameOnly;
};

/**
 * Check if a photo exists by attempting to load it
 */
export const checkPhotoExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
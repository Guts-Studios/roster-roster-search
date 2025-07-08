import { Personnel } from "@/types";

/**
 * Generate potential photo filenames for a personnel record
 * Handles various naming patterns including suffixes (Jr, Sr, II, III, etc.)
 */
export const getPhotoUrl = (person: Personnel): string | null => {
  if (!person.first_name || !person.last_name) return null;
  
  // Generate multiple potential filename variations
  const potentialUrls = generatePhotoVariations(person);
  
  // Return the first variation (most likely based on patterns observed)
  return potentialUrls[0] || null;
};

/**
 * Get all potential photo URL variations for a person
 * Useful for trying multiple possibilities
 */
export const getPhotoUrlVariations = (person: Personnel): string[] => {
  if (!person.first_name || !person.last_name) return [];
  return generatePhotoVariations(person);
};

/**
 * Generate all possible photo filename variations for a person
 */
function generatePhotoVariations(person: Personnel): string[] {
  const variations: string[] = [];
  
  // Clean and format names
  const lastName = person.last_name.toLowerCase().trim();
  const firstName = person.first_name.toLowerCase().trim();
  
  
  // Handle common suffixes and their variations
  const suffixPatterns = [
    { pattern: /\s+(jr\.?|junior)$/i, replacement: '-jr' },
    { pattern: /\s+(sr\.?|senior)$/i, replacement: '-sr' },
    { pattern: /\s+(ii|2nd)$/i, replacement: 'ii' }, // Concatenated directly
    { pattern: /\s+(iii|3rd)$/i, replacement: 'iii' },
    { pattern: /\s+(iv|4th)$/i, replacement: 'iv' },
  ];
  
  // Check if lastName has a suffix and create variations
  let baseLastName = lastName;
  let suffixVariation = '';
  
  for (const { pattern, replacement } of suffixPatterns) {
    if (pattern.test(lastName)) {
      baseLastName = lastName.replace(pattern, '');
      suffixVariation = replacement;
      break;
    }
  }
  
  // Replace spaces with underscores and handle hyphens
  const formatName = (name: string) => name.replace(/\s+/g, '_').replace(/['"]/g, '');
  
  const formattedFirstName = formatName(firstName);
  const formattedBaseLastName = formatName(baseLastName);
  
  // Generate variations with badge number for both .webp and .webpX extensions
  if (person.badge_number) {
    const extensions = ['.webp', '.webpX'];
    // Handle case variations in badge numbers (e.g., R369 vs r369)
    const badgeVariations = [
      person.badge_number,
      person.badge_number.toLowerCase(),
      person.badge_number.toUpperCase()
    ];
    
    for (const ext of extensions) {
      for (const badge of badgeVariations) {
        // Variation 1: suffix concatenated directly (like espinozaii_roberto_3770.webp)
        if (suffixVariation && !suffixVariation.startsWith('-')) {
          variations.push(`/photos/${formattedBaseLastName}${suffixVariation}_${formattedFirstName}_${badge}${ext}`);
        }
        
        // Variation 2: suffix with hyphen (like rodardte-jr_gerardo_3737.webp)
        if (suffixVariation && suffixVariation.startsWith('-')) {
          variations.push(`/photos/${formattedBaseLastName}${suffixVariation}_${formattedFirstName}_${badge}${ext}`);
        }
        
        // Variation 3: original format without suffix handling
        const formattedLastName = formatName(lastName);
        variations.push(`/photos/${formattedLastName}_${formattedFirstName}_${badge}${ext}`);
        
        // Variation 4: base name without suffix
        if (suffixVariation) {
          variations.push(`/photos/${formattedBaseLastName}_${formattedFirstName}_${badge}${ext}`);
        }
      }
    }
  }
  
  // Special case: Handle common typos in names
  if (person.last_name.toLowerCase() === 'gonzalez') {
    // Add variation for "gonazalez" typo
    const typoLastName = 'gonazalez';
    const extensions = ['.webp', '.webpX'];
    
    for (const ext of extensions) {
      if (person.badge_number) {
        // Handle case variations in badge numbers for typo variations too
        const badgeVariations = [
          person.badge_number,
          person.badge_number.toLowerCase(),
          person.badge_number.toUpperCase()
        ];
        for (const badge of badgeVariations) {
          variations.push(`/photos/${typoLastName}_${formattedFirstName}_${badge}${ext}`);
        }
      }
      variations.push(`/photos/${typoLastName}_${formattedFirstName}${ext}`);
    }
  }
  
  // Generate variations without badge number for both extensions
  const extensions = ['.webp', '.webpX'];
  
  for (const ext of extensions) {
    if (suffixVariation && !suffixVariation.startsWith('-')) {
      variations.push(`/photos/${formattedBaseLastName}${suffixVariation}_${formattedFirstName}${ext}`);
    }
    
    if (suffixVariation && suffixVariation.startsWith('-')) {
      variations.push(`/photos/${formattedBaseLastName}${suffixVariation}_${formattedFirstName}${ext}`);
    }
    
    const formattedLastName = formatName(lastName);
    variations.push(`/photos/${formattedLastName}_${formattedFirstName}${ext}`);
    
    if (suffixVariation) {
      variations.push(`/photos/${formattedBaseLastName}_${formattedFirstName}${ext}`);
    }
  }
  
  // Remove duplicates and return
  const uniqueVariations = [...new Set(variations)];
  
  
  return uniqueVariations;
}

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
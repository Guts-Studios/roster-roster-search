# Technical Architecture - No Secret Police

## File Structure
```
src/
├── components/
│   ├── Navbar.tsx           # Navigation with mobile hamburger menu
│   ├── ProfileCard.tsx      # Personnel card display (rectangular portraits)
│   ├── PersonnelFilters.tsx # Three-field search interface
│   ├── Pagination.tsx       # Mobile-responsive pagination
│   └── RosterList.tsx       # Personnel list container
├── hooks/
│   ├── useAuth.ts           # Authentication state management
│   └── useAdvancedPersonnel.ts # Personnel search and filtering
├── pages/
│   ├── Index.tsx            # Landing page
│   ├── Search.tsx           # Main search functionality (protected)
│   ├── Statistics.tsx       # Analytics dashboard (protected)
│   ├── About.tsx            # Generic about page
│   └── ProfileDetails.tsx   # Individual profile view
├── utils/
│   └── auth.ts              # Password hashing utilities
└── integrations/
    └── supabase/            # Database integration
```

## Key Components

### Authentication System
- **File**: `src/hooks/useAuth.ts`
- **Method**: SHA-256 hashing with custom salt
- **Storage**: Supabase app_config table
- **Protected Routes**: Search, Statistics
- **Password**: "WatchtheWatchers2024!"

### Search Interface
- **File**: `src/components/PersonnelFilters.tsx`
- **Fields**: firstName, lastName, badgeNumber (separate inputs)
- **Removed**: Classification filter
- **Hook**: `useAdvancedPersonnel.ts` with updated interface

### Portrait Display
- **Format**: Rectangular containers (4:5 aspect ratio)
- **CSS**: `object-cover` to prevent stretching
- **Sizes**: 
  - Cards: 64×80px (mobile), 80×96px (desktop)
  - Details: 96×128px (mobile), 128×160px (desktop)
- **Labeling**: "Badge #" prefix for clarity

## Database Schema
- **Table**: personnel
- **Key Fields**: first_name, last_name, badge_number, photo_url
- **Authentication**: app_config table with hashed passwords

## Styling System
- **Framework**: Tailwind CSS
- **Theme**: Custom Inadvertent Substack colors
- **Responsive**: Mobile-first design
- **Navigation**: Hamburger menu for mobile
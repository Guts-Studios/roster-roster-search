# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-07

### Added
- **Landing Page**: Created a new professional home page with hero section, feature cards, and call-to-action buttons
- **Password Protection**: Implemented secure authentication system for Search and Statistics pages
  - Uses "WatchtheWatchers2024!" password stored securely in Supabase with SHA-256 hashing
  - Fallback authentication when Supabase is unavailable
  - Password visibility toggle for better UX
- **Database Security**: Created app_config table with Row Level Security (RLS) policies
- **Navigation Updates**: Added Home, Search, Statistics, and About tabs to navigation
- **Logout Functionality**: Added logout buttons to protected pages

### Changed
- **Color Scheme**: Updated entire application to use Inadvertent Substack color palette
  - Warm cream/beige backgrounds (#F5F2E8)
  - Dark text for better readability (#2D2520)
  - Yellow/orange accents (#E6B800) replacing previous orange theme
  - Updated all components, pages, and UI elements for consistency
- **Page Structure**: Converted original home page to password-protected "Search" page
- **Authentication Flow**: Enhanced security with proper password hashing and verification
- **UI Components**: Updated all cards, buttons, and interactive elements with new color scheme

### Technical Improvements
- **Database Migration**: Added migration for secure password storage
- **TypeScript Types**: Updated Supabase type definitions for new app_config table
- **CSS Variables**: Implemented comprehensive CSS custom properties for theming
- **Tailwind Config**: Updated color palette and removed old police theme colors
- **Component Consistency**: Ensured all components use semantic color classes

### Security
- **Password Hashing**: Implemented SHA-256 with custom salt for secure password storage
- **Database Security**: Added Row Level Security policies to protect sensitive data
- **Authentication State**: Proper session management and logout functionality

### Files Modified
- `src/index.css` - Updated color scheme and CSS variables
- `src/pages/Home.tsx` - New landing page with professional design
- `src/pages/Search.tsx` - Added password protection to search functionality
- `src/pages/Statistics.tsx` - Added password protection to statistics page
- `src/components/Navbar.tsx` - Updated navigation and color scheme
- `src/pages/About.tsx` - Updated colors and styling
- `src/pages/ProfileDetails.tsx` - Updated color scheme
- `src/pages/Index.tsx` - Updated color scheme
- `src/components/RosterList.tsx` - Updated color scheme
- `src/components/ProfileCard.tsx` - Updated color scheme
- `tailwind.config.ts` - Updated color palette and fixed ESLint issues
- `src/utils/auth.ts` - New authentication utilities
- `supabase/migrations/20240107000000_create_app_config.sql` - Database migration
- `src/integrations/supabase/types.ts` - Updated TypeScript definitions

### Dependencies
- No new dependencies added
- Fixed ESLint configuration in Tailwind config

## [0.0.0] - Initial Version
- Basic personnel database functionality
- Search and filter capabilities
- Profile details and statistics
- Original police-themed color scheme
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-07-14

### Added
- **Redaction Font Integration**: Implemented complete Redaction font family with multiple weights
  - Added Redaction Regular, Bold, and Italic variants
  - Added Redaction 10 (light weight) for subtle styling
  - Applied font universally across all elements including headings, inputs, and buttons
  - Added proper font-display: swap for performance
- **Logo Integration**: Added clickable logo functionality
  - Centered logo in navigation header
  - Added hover effects and proper linking to home page
  - Logo sourced from `/logo/logo.webp`
- **Full Roster Page**: Created new comprehensive personnel directory
  - Complete personnel listing with pagination
  - Accessible via `/roster` route
  - Uses `useAllPersonnel` hook for data fetching
  - Responsive design with mobile optimization
- **Enhanced About Page**: Major content and functionality updates
  - Added comprehensive project background and history
  - Integrated search functionality directly in About page
  - Added hyperlinks to external resources (Inadvertent Substack, Ben Camacho's site)
  - Detailed explanation of public records process and legal battles
- **Input Field Visibility**: Enhanced form accessibility
  - Added permanent black outlines (2px solid #000000) to all input fields
  - Improved visibility across all input types (text, email, password, etc.)
  - Maintained focus and hover states with consistent black borders

### Changed
- **Color Scheme Overhaul**: Migrated from yellow accents to black-based design
  - Updated accent colors from yellow (#f59e0b) to black (#000000)
  - Changed hover states to darker black (#1a1a1a)
  - Maintained warm cream backgrounds with improved contrast
  - Updated all CSS custom properties for consistency
- **Navigation Improvements**: Enhanced header layout and spacing
  - Improved mobile responsiveness
  - Better logo positioning and navigation item spacing
  - Enhanced hamburger menu functionality
- **Typography System**: Complete font integration
  - Replaced system fonts with Redaction font family
  - Improved readability and visual consistency
  - Better font weight hierarchy (300, 400, 600, 700)

### Technical Improvements
- **Font Loading Optimization**: Implemented efficient font loading strategy
  - Added font-display: swap for better performance
  - Organized font variants by weight and style
  - Comprehensive fallback font stack
- **Component Architecture**: Enhanced component structure
  - Added `FullRoster.tsx` page component
  - Updated `App.tsx` routing for new pages
  - Improved navigation component with logo integration
- **CSS Architecture**: Streamlined styling system
  - Updated CSS custom properties for new color scheme
  - Enhanced input styling with permanent borders
  - Improved responsive design patterns

### Files Modified
- `src/index.css` - Complete font integration and color scheme updates
- `src/pages/About.tsx` - Major content updates and search integration
- `src/pages/FullRoster.tsx` - New page for complete personnel directory
- `src/components/Navbar.tsx` - Logo integration and navigation improvements
- `src/App.tsx` - Updated routing for new pages
- `public/font_kit/` - Added complete Redaction font family
- `public/logo/logo.webp` - Added project logo

### Dependencies
- No new dependencies added
- Enhanced existing font loading capabilities

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
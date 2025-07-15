# Project Overview - No Secret Police Personnel Database

## Current Status
- **Project Name**: No Secret Police
- **Tagline**: "A project by inadvertent"
- **Version**: 2.0.0
- **Theme**: Inadvertent Substack (cream/beige backgrounds, dark text, black accents)
- **Typography**: Redaction font family with multiple weights

## Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Backend**: Supabase (PostgreSQL database, authentication)
- **Build Tool**: Vite
- **Version Control**: Git

## Key Features
- Personnel search with separate fields (first name, last name, badge number)
- Full roster page with complete personnel directory
- Enhanced About page with integrated search functionality
- Mobile-responsive design with hamburger navigation and centered logo
- Rectangular portrait display (no face cropping)
- Statistics dashboard
- Individual profile detail pages
- Redaction font integration across all components

## Authentication
- Password: "WatchtheWatchers2024!" (stored securely in Supabase)
- SHA-256 hashing with custom salt
- Protected routes: Search, Statistics

## Current Architecture
- **Pages**: Search (main functionality), FullRoster, Statistics, About, ProfileDetails
- **Components**: Navbar, ProfileCard, PersonnelFilters, Pagination, RosterList
- **Hooks**: useAuth, useAdvancedPersonnel, useAllPersonnel
- **Database**: Supabase integration with personnel data
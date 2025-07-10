# Project Overview - No Secret Police Personnel Database

## Current Status
- **Project Name**: No Secret Police
- **Tagline**: "A project by inadvertent"
- **Version**: 1.0.0
- **Theme**: Inadvertent Substack (cream/beige backgrounds, dark text, yellow accents)

## Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Backend**: Supabase (PostgreSQL database, authentication)
- **Build Tool**: Vite
- **Version Control**: Git

## Key Features
- Personnel search with separate fields (first name, last name, badge number)
- Password-protected access (Search and Statistics pages)
- Mobile-responsive design with hamburger navigation
- Rectangular portrait display (no face cropping)
- Statistics dashboard
- Individual profile detail pages

## Authentication
- Password: "WatchtheWatchers2024!" (stored securely in Supabase)
- SHA-256 hashing with custom salt
- Protected routes: Search, Statistics

## Current Architecture
- **Pages**: Home (landing), Search (main functionality), Statistics, About, ProfileDetails
- **Components**: Navbar, ProfileCard, PersonnelFilters, Pagination, RosterList
- **Hooks**: useAuth, useAdvancedPersonnel
- **Database**: Supabase integration with personnel data
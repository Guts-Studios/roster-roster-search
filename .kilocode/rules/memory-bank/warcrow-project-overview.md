# Warcrow Army Builder - Project Overview

## Current Status
- **Project Name**: Warcrow Army Builder
- **Repository**: d:\GitHub\warcrow-army-builder
- **Version**: 0.6.2
- **Theme**: Dark theme with yellow accents
- **Title**: "Army Builder" (HTML document title)

## Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Backend**: Supabase (PostgreSQL database, authentication)
- **Build Tool**: Vite
- **Deployment**: Netlify
- **Development Server**: Port 8081

## Key Features
- **Army List Building**: Create and manage army lists for Warcrow tabletop game
- **Unit Management**: Add/remove units with quantity controls
- **Card Viewing**: View detailed unit cards with print functionality
- **Faction Support**: Multiple factions (Northern Tribes, Hegemony of Embersig, Scions of Yaldabaoth, Syenann)
- **Tournament Legal Filtering**: Filter units by tournament legality
- **Multilingual Support**: English and other languages
- **List Sharing**: Share army lists via URLs
- **Local Storage**: Save lists locally and to cloud
- **Print Support**: Print unit cards with size options

## Authentication & Data
- **Authentication**: Supabase-based with guest and authenticated modes
- **Data Source**: CSV files synced to static data
- **Unit Data**: Comprehensive unit statistics, keywords, special rules
- **Caching**: Advanced caching system with version control

## Current Architecture
- **Pages**: Landing, Army Builder, Rules, FAQ, Admin, Profile
- **Components**: UnitCard, ArmyList, UnitControls, CardPopup
- **Hooks**: useArmyData, useAuth, useLanguage, useSavedLists
- **Database**: Supabase integration with unit and user data
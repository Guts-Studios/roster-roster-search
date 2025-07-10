# Warcrow Army Builder - Technical Architecture

## File Structure
```
src/
├── components/
│   ├── UnitCard.tsx             # Main unit display with View Card button
│   ├── ArmyList.tsx             # Army list management
│   ├── SelectedUnits.tsx        # Selected units display
│   ├── unit/
│   │   ├── UnitControls.tsx     # Add/remove quantity controls
│   │   ├── UnitHeader.tsx       # Unit name and details
│   │   └── card/                # Card-related components
│   ├── army/
│   │   ├── list-management/     # List save/load functionality
│   │   └── share/               # List sharing features
│   ├── auth/                    # Authentication components
│   ├── cache/                   # Cache management
│   └── ui/                      # Reusable UI components
├── hooks/
│   ├── useArmyData.ts           # Army data fetching and management
│   ├── use-army-list.ts         # Army list state management
│   ├── useAuth.ts               # Authentication state
│   ├── useSavedLists.ts         # Local/cloud list storage
│   └── useLanguage.tsx          # Multilingual support
├── pages/
│   ├── ArmyBuilder.tsx          # Main army building interface
│   ├── Landing.tsx              # Landing page
│   ├── FAQ.tsx                  # Frequently asked questions
│   └── admin/                   # Admin interfaces
├── utils/
│   ├── unitManagement.ts        # Unit manipulation utilities
│   ├── cacheInvalidation.ts     # Cache management
│   └── translation/             # Translation utilities
└── data/
    ├── factions/                # Faction-specific unit data
    ├── characteristicDefinitions.ts
    └── specialRuleDefinitions.ts
```

## Key Components

### UnitCard Component
- **File**: `src/components/UnitCard.tsx`
- **Key Features**: 
  - Centered View Card button at bottom
  - Quantity controls positioned on right
  - Portrait display with fallback initials
  - Keywords and special rules display
- **Recent Changes**: Fixed View Card button positioning and text centering

### Authentication System
- **Files**: `src/hooks/useAuth.ts`, `src/components/auth/`
- **Method**: Supabase authentication with guest mode
- **Features**: Profile management, saved lists, cloud sync

### Data Management
- **Source**: CSV files in `public/data/reference-csv/`
- **Processing**: Static data generation via `scripts/sync-csv-to-static.js`
- **Caching**: Version-controlled cache with invalidation
- **Hook**: `useArmyData.ts` for data fetching and filtering

### Card Popup System
- **Functionality**: View detailed unit cards
- **Print Support**: Multiple print size options
- **Image Loading**: Dynamic card image generation
- **URL Structure**: `/art/card/{unit_name}_card_{language}.jpg`

## Database Schema
- **Tables**: units, factions, users, saved_lists, news
- **Key Fields**: unit data, tournament legality, characteristics
- **Authentication**: Supabase auth with profile management

## Styling System
- **Framework**: Tailwind CSS
- **Theme**: Dark theme with yellow accents (#f59e0b)
- **Responsive**: Mobile-first design
- **Components**: Consistent card layouts, button styles

## Build & Deployment
- **Build Tool**: Vite
- **Deployment**: Netlify with automatic deployments
- **Environment**: Production/development environment detection
- **Caching**: Deployment-aware cache invalidation
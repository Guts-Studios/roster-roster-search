# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application for searching and displaying public personnel records. It's a police accountability tool built with Vite, TypeScript, React, shadcn-ui, and Tailwind CSS, with a Supabase backend.

## Development Commands

- `npm run dev` - Start development server on port 8080
- `npm run build` - Build for production
- `npm run build:dev` - Build for development mode
- `npm run lint` - Run ESLint linting
- `npm run preview` - Preview production build

## Database and Migration Commands

- `npm run generate-migration` - Generate new Supabase migration
- `npm run insert-personnel` - Insert personnel data into database
- `npm run run-migration` - Run migration directly
- `npm run generate-sql` - Generate SQL insert statements
- `npm run db:push` - Push database changes to Supabase

## Architecture

### Frontend Structure
- **Pages**: `/src/pages/` - Main route components (Search, ProfileDetails, Statistics, About)
- **Components**: `/src/components/` - Reusable UI components including shadcn-ui components
- **Hooks**: `/src/hooks/` - Custom React hooks for data fetching and state management
- **Types**: `/src/types/index.ts` - TypeScript interfaces, primarily Personnel interface

### Data Layer
- **Supabase Integration**: `/src/integrations/supabase/` - Database client and type definitions
- **React Query**: Used for data fetching, caching, and state management
- **Personnel Hook**: `usePersonnel`, `usePersonnelById`, `usePersonnelSearch` for data operations
- **Advanced Personnel Hook**: `useAdvancedPersonnel` for filtered and paginated results

### Key Data Flow
1. Search page uses `useAdvancedPersonnel` hook with filters for pagination and search
2. Personnel data fetched from Supabase `personnel` table
3. Search supports name and badge number queries with intelligent detection (numeric = badge, text = name)
4. Results displayed with pagination using `RosterList` and `Pagination` components

### Database Schema
- Primary table: `personnel` with fields for names, badge numbers, pay information, divisions
- App configuration stored in `app_config` table with RLS policies
- Personnel photos stored in `/public/data/` directory with filename conventions

### Component Architecture
- Uses shadcn-ui component library with Radix UI primitives
- Tailwind CSS for styling with custom theme colors
- React Router for navigation
- Toast notifications via Sonner

### File Path Conventions
- Components use `@/` alias for `/src/`
- UI components in `/src/components/ui/`
- Custom components in `/src/components/`
- Absolute imports preferred over relative imports

### Build and Deployment
- Vite build system with SWC for fast compilation
- Development server runs on port 8080
- Lovable platform integration for deployment
- Environment variables for Supabase connection
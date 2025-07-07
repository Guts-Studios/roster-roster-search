# Design System - Inadvertent Substack Theme

## Color Palette
- **Primary Background**: `#fefcf0` (cream/beige)
- **Secondary Background**: `#f8f6e8` (slightly darker cream)
- **Text Primary**: `#1a1a1a` (dark gray/black)
- **Text Secondary**: `#4a4a4a` (medium gray)
- **Accent Color**: `#f59e0b` (yellow/amber)
- **Accent Hover**: `#d97706` (darker yellow)
- **Border Color**: `#e5e5e5` (light gray)

## Typography
- **Font Family**: System fonts (sans-serif stack)
- **Headings**: Bold, dark text
- **Body Text**: Regular weight, good contrast
- **Interactive Elements**: Hover states with accent colors

## Component Patterns
- **Cards**: White backgrounds with subtle shadows
- **Buttons**: Yellow accent with hover states
- **Forms**: Clean inputs with proper spacing
- **Navigation**: Mobile-first with hamburger menu

## Portrait Display Rules
- **Format**: Rectangular (4:5 aspect ratio)
- **Sizes**: 
  - ProfileCard: 64×80px (mobile), 80×96px (desktop)
  - ProfileDetails: 96×128px (mobile), 128×160px (desktop)
- **CSS**: `object-cover` to prevent stretching
- **Corners**: Rounded (`rounded-lg`)
- **No cropping**: Full face visibility

## Mobile Responsiveness
- **Breakpoints**: Tailwind CSS standard (sm, md, lg, xl)
- **Navigation**: Hamburger menu on mobile
- **Grid Layouts**: Responsive columns
- **Touch Targets**: Adequate size for mobile interaction
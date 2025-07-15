# Design System - Inadvertent Substack Theme

## Color Palette
- **Primary Background**: `#fefcf0` (cream/beige)
- **Secondary Background**: `#f8f6e8` (slightly darker cream)
- **Text Primary**: `#0a0a0a` (very dark gray/black)
- **Text Secondary**: `#404040` (medium gray)
- **Accent Color**: `#000000` (black)
- **Accent Hover**: `#1a1a1a` (dark gray)
- **Border Color**: `#d4d4d4` (light gray)
- **Input Borders**: `#000000` (permanent black outlines)

## Typography
- **Font Family**: Redaction font family with fallback to system fonts
- **Font Weights**:
  - Light (300): Redaction 10 variants
  - Regular (400): Standard Redaction
  - Semi-bold (600): Redaction 10 Bold
  - Bold (700): Redaction Bold
- **Font Styles**: Regular and Italic variants available
- **Font Loading**: Optimized with font-display: swap
- **Headings**: Bold Redaction font, dark text
- **Body Text**: Regular Redaction font, good contrast
- **Interactive Elements**: Consistent font with hover states

## Component Patterns
- **Cards**: White backgrounds with subtle shadows
- **Buttons**: Black accent with hover states
- **Forms**: Clean inputs with permanent black outlines for visibility
- **Navigation**: Mobile-first with hamburger menu and centered logo

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
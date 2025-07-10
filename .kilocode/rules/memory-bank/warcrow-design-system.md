# Warcrow Army Builder - Design System

## Color Palette
- **Primary Background**: Dark theme (`bg-gray-900`, `bg-gray-800`)
- **Card Backgrounds**: `bg-gray-800` with `border-gray-600`
- **Text Primary**: White (`text-white`)
- **Text Secondary**: `text-gray-300`, `text-gray-400`
- **Accent Color**: `bg-yellow-500` (buttons, highlights)
- **Accent Hover**: `bg-yellow-600`
- **Success**: `text-green-400`
- **Warning**: `text-red-400` (tournament illegal units)

## Typography
- **Font Family**: System fonts (Tailwind default sans-serif stack)
- **Headings**: Bold, white text
- **Body Text**: Regular weight, good contrast on dark background
- **Interactive Elements**: Hover states with yellow accent colors

## Component Patterns

### Unit Cards
- **Background**: `bg-gray-800` with subtle borders
- **Layout**: Flex column with header, content, and action bar
- **Spacing**: Consistent padding (`p-3`, `px-3 py-2`)
- **Borders**: `border-gray-600` for subtle separation

### Buttons
- **Primary**: Yellow background (`bg-yellow-500`) with dark text
- **Hover**: Darker yellow (`bg-yellow-600`)
- **Dimensions**: Fixed sizes for consistency (e.g., `w-24 h-8`)
- **Centering**: Flexbox with `items-center justify-center`

### Action Bar Layout (UnitCard)
- **Container**: `relative flex justify-center items-center px-3 py-2`
- **View Card Button**: Centered with fixed dimensions
- **Controls**: Absolutely positioned on right (`absolute right-3`)
- **Border**: Top border for visual separation (`border-t border-gray-600`)

## Unit Card Specific Design Rules

### Portrait Display
- **Format**: Circular avatars with fallback initials
- **Sizes**: Consistent sizing across components
- **Fallback**: Letter-based avatars when images unavailable
- **Colors**: Varied background colors for visual distinction

### Button Positioning
- **View Card Button**: 
  - Centered horizontally in action bar
  - Fixed width (`w-24`) and height (`h-8`)
  - Text wrapped in `<span className="text-center leading-none">`
- **Quantity Controls**: 
  - Positioned absolutely on right side
  - Maintains consistent spacing from edge

### Keywords and Special Rules
- **Keywords**: Yellow badges (`bg-yellow-500`)
- **Special Rules**: Organized sections with clear typography
- **Spacing**: Consistent gaps between elements

## Mobile Responsiveness
- **Breakpoints**: Tailwind CSS standard (sm, md, lg, xl)
- **Grid Layouts**: Responsive unit card grids
- **Touch Targets**: Adequate button sizes for mobile interaction
- **Navigation**: Mobile-optimized layouts

## Print Styles
- **Card Printing**: Optimized layouts for physical printing
- **Size Options**: Multiple print size configurations
- **Image Quality**: High-resolution card images
- **Layout**: Print-friendly spacing and typography

## Accessibility
- **Contrast**: High contrast text on dark backgrounds
- **Focus States**: Clear focus indicators for keyboard navigation
- **Alt Text**: Proper alt text for images and icons
- **Screen Readers**: Semantic HTML structure

## Animation & Transitions
- **Hover Effects**: Smooth color transitions (`transition-colors`)
- **Loading States**: Appropriate loading indicators
- **State Changes**: Smooth transitions between states
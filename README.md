# No Secret Police

A React application for searching and displaying public personnel records. Built as a police accountability tool with a focus on transparency and accessibility.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/roster-roster-search.git
   cd roster-roster-search
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Railway PostgreSQL connection string
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Railway PostgreSQL
- **State Management**: React Query (TanStack Query)
- **Authentication**: Custom password-based system
- **Typography**: Redaction font family

### Database
The application uses Railway PostgreSQL for data storage:
- **Personnel Table**: Contains public records data (names, badge numbers, compensation, divisions)
- **App Config Table**: Stores application configuration and authentication data
- **Connection**: Direct PostgreSQL client using `pg` library

### Key Features
- **Advanced Search**: Search by name, badge number with intelligent detection
- **Full Roster**: Complete personnel directory with pagination
- **Statistics Dashboard**: Compensation analytics and breakdowns
- **Profile Details**: Individual personnel record views
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: WCAG compliant with high contrast design

## 🛠️ Development

### Development Commands
```bash
npm run dev          # Start development server (port 8080)
npm run build        # Build for production
npm run build:dev    # Build for development mode
npm run lint         # Run ESLint linting
npm run preview      # Preview production build
```

### Database Commands
```bash
npm run generate-sql       # Generate SQL insert statements
npm run insert-personnel   # Insert personnel data into database
```

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx      # Navigation component
│   ├── ProfileCard.tsx # Personnel card display
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAdvancedPersonnel.ts  # Main search hook
│   ├── useAllPersonnel.ts       # Full roster hook
│   └── ...
├── pages/              # Route components
│   ├── Search.tsx      # Main search page
│   ├── FullRoster.tsx  # Complete roster page
│   ├── Statistics.tsx  # Analytics dashboard
│   └── ...
├── integrations/       # External service integrations
│   └── database/       # Railway PostgreSQL client
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## 🎨 Design System

### Color Palette
- **Primary Background**: `#fefcf0` (warm cream)
- **Secondary Background**: `#f8f6e8` (light cream)
- **Text Primary**: `#0a0a0a` (near black)
- **Text Secondary**: `#404040` (medium gray)
- **Accent Color**: `#000000` (black)
- **Border Color**: `#d4d4d4` (light gray)

### Typography
- **Font Family**: Redaction (with system fallbacks)
- **Weights**: Light (300), Regular (400), Semi-bold (600), Bold (700)
- **Loading**: Optimized with `font-display: swap`

## 🔒 Authentication

The application uses a custom password-based authentication system:
- **Protected Routes**: Search and Statistics pages
- **Password**: Stored securely in Railway database with SHA-256 hashing
- **Session Management**: Client-side session storage

## 🚀 Deployment

### Environment Variables
Required environment variables for deployment:

```bash
VITE_DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

### Railway Deployment
This application is optimized for Railway deployment:
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will automatically deploy on push to main branch

## 📦 Dependencies

### Core Dependencies
- `react` - UI library
- `react-router-dom` - Client-side routing
- `@tanstack/react-query` - Data fetching and caching
- `pg` - PostgreSQL client
- `tailwindcss` - Utility-first CSS framework

### UI Dependencies
- `@radix-ui/*` - Accessible UI primitives
- `lucide-react` - Icon library
- `sonner` - Toast notifications

## 🧪 Testing

The application includes comprehensive testing for database connectivity and core functionality:
- Database connection verification
- Search functionality testing
- Authentication flow validation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the GitHub repository or contact the maintainers.

---

**Note**: This application is designed for transparency and accountability. All data displayed is considered public information obtained through official channels.
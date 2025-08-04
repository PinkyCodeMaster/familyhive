# Project Structure

## Root Configuration
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `drizzle.config.ts` - Database configuration
- `components.json` - Shadcn/ui configuration
- `.env` / `.example.env` - Environment variables

## Source Code Organization (`src/`)

### App Router (`src/app/`)
- **Route Groups**: Organized by authentication state and functionality
  - `(app)/` - Authenticated application routes
    - `(public)/` - Public pages within app
    - `dashboard/` - Main dashboard functionality
  - `(auth)/` - Authentication pages (login, register)
  - `api/` - API routes following REST conventions

### API Routes (`src/app/api/`)
- **Resource-based structure**: Each entity has its own folder
  - `auth/[...all]/` - Authentication endpoints (Better Auth)
  - `income/`, `expense/`, `debt/` - CRUD operations for financial data
  - `[id]/route.ts` - Individual resource operations (GET, PUT, DELETE)
  - `route.ts` - Collection operations (GET all, POST)

### Database (`src/db/`)
- `index.ts` - Database connection and configuration
- `schema/` - Drizzle schema definitions
  - `auth.ts` - User authentication tables
  - `income.ts`, `expense.ts`, `debt.ts` - Financial data models
  - `index.ts` - Schema exports

### Components (`src/components/`)
- **Feature-based organization**:
  - `dashboard/` - Dashboard-specific components
  - `theme/` - Theme provider and toggle components
  - `ui/` - Reusable Shadcn/ui components
- **Naming**: kebab-case for files, PascalCase for component names

### Utilities (`src/lib/`)
- `auth.ts` - Better Auth configuration
- `auth-client.ts` - Client-side auth utilities
- `utils.ts` - General utility functions (cn, etc.)

### Hooks (`src/hooks/`)
- Custom React hooks (e.g., `use-mobile.ts`)

### Styles (`src/styles/`)
- `globals.css` - Global styles and Tailwind imports

## Key Conventions

### File Naming
- **Routes**: `page.tsx`, `layout.tsx`, `route.ts`
- **Components**: kebab-case files, PascalCase exports
- **Types**: Inferred from Drizzle schemas where possible

### Import Aliases (from `components.json`)
- `@/components` - Component imports
- `@/lib` - Utility functions
- `@/db` - Database and schema
- `@/hooks` - Custom hooks

### Database Schema Patterns
- All tables use `text` primary keys with UUIDs
- Consistent timestamp fields: `createdAt`, `updatedAt`
- Foreign key relationships with cascade deletes
- Enums for categorical data (source, frequency, etc.)

### API Route Patterns
- Zod validation for request bodies
- Consistent error handling and status codes
- User ID from headers for authorization
- Numeric amounts stored as strings in DB, parsed as needed

### Component Architecture
- Server components by default
- Client components marked with "use client"
- Props interfaces defined inline or extracted for reuse
- Consistent use of Tailwind classes and CVA for variants
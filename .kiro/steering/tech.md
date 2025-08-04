# Technology Stack

## Framework & Runtime
- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - UI library with latest features
- **TypeScript 5** - Type-safe JavaScript
- **Node.js** - Runtime environment

## Database & ORM
- **PostgreSQL** - Primary database (via Neon serverless)
- **Drizzle ORM 0.44.4** - Type-safe database toolkit
- **Drizzle Kit 0.31.4** - Database migrations and introspection

## Authentication
- **Better Auth 1.3.4** - Modern authentication library
- Email/password authentication enabled
- Session management with database adapter

## UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - Component library (New York style)
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **Next Themes** - Theme switching support
- **Class Variance Authority** - Component variant management

## Forms & Validation
- **React Hook Form 7.62.0** - Form state management
- **Zod 4.0.14** - Schema validation
- **@hookform/resolvers** - Form validation integration

## Charts & Data Visualization
- **Recharts 2.15.4** - Chart library for financial data
- **Date-fns 4.1.0** - Date manipulation utilities

## Development Tools
- **ESLint 9** - Code linting
- **PNPM** - Package manager
- **Turbopack** - Fast bundler (dev mode)

## Common Commands

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint

# Database
npx drizzle-kit generate    # Generate migrations
npx drizzle-kit migrate     # Run migrations
npx drizzle-kit studio      # Open Drizzle Studio
```

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (required)
- `BETTER_AUTH_SECRET` - Authentication secret key
- `BETTER_AUTH_URL` - Base URL for auth callbacks
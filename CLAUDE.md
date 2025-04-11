# EquityEdge Development Guide

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Code Style Guidelines
- Use TypeScript with proper type definitions
- Prefer absolute imports using `@/` path alias
- Use React functional components with hooks
- Follow shadcn/ui component patterns
- Use TanStack Query for data fetching with proper caching
- Error handling: use try/catch blocks with consistent error logging
- Naming: PascalCase for components, camelCase for variables/functions
- Tailwind for styling with consistent class ordering
- Keep component files under 150 lines when possible
- Use Supabase for backend functionality
- Organize related components in subdirectories
- For API integrations, use service classes (see MarketStackService)
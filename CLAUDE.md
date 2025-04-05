# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev`: Run development server (uses Turbopack)
- `npm run build`: Build for production
- `npm run start`: Run production server
- `npm run lint`: Run ESLint

## Code Style Guidelines
- **TypeScript**: Use strict type checking. Define interfaces for component props and data models.
- **Formatting**: 2-space indentation, single quotes, semicolons, consistent braces.
- **Imports**: Group by: 1) React/Next.js, 2) third-party libraries, 3) local components/utils. Use absolute imports with `@/` alias.
- **Components**: PascalCase for components and interfaces. Use functional components with typed props.
- **Naming**: camelCase for variables/functions, descriptive naming for all elements.
- **Error Handling**: Use try/catch for async operations. Provide user-friendly error messages via toast notifications.
- **State Management**: Prefer React hooks. Use context for global state. Server actions for data mutations.
- **UI Components**: Use shadcn/ui component library with consistent styling.
- **File Structure**: Follow Next.js App Router conventions. "use client" directive at top of client components.
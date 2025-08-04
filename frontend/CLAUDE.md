# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### Methodology

1. **System 2 Thinking**: Approach the problem with analytical rigor. Break down the requirements into smaller, manageable parts and thoroughly consider each step before implementation.
2. **Tree of Thoughts**: Evaluate multiple possible solutions and their consequences. Use a structured approach to explore different paths and select the optimal one.
3. **Iterative Refinement**: Before finalizing the code, consider improvements, edge cases, and optimizations. Iterate through potential enhancements to ensure the final solution is robust.

**Process**:

1. **Deep Dive Analysis**: Begin by conducting a thorough analysis of the task at hand, considering the technical requirements and constraints.
2. **Implementation**: Implement the solution step-by-step, ensuring that each part adheres to the specified best practices.
3. **Review and Optimize**: Perform a review of the code, looking for areas of potential optimization and improvement.
4. **Finalization**: Finalize the code by ensuring it meets all requirements and the application can be started and built without errors ( by running `pnpm build` and `pnpm dev`)

## Common Commands

### Development

- `pnpm dev` - Start development server on localhost:3000
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Component Generation

- `npx shadcn-ui add <component-name>` - Add new Shadcn/UI components

## Architecture Overview

This is a Next.js 15 video content platform using **Feature-Sliced Design (FSD)** architecture. The codebase is organized in layers:

### Directory Structure & Path Mapping

- `@/entities/*` → `./app/entities/*` - Business entities (video, category)
- `@/features/*` → `./app/features/*` - Feature-specific logic (video-player)
- `@/widgets/*` → `./app/widgets/*` - Layout widgets (header, sidebar)
- `@/shared/*` → `./app/shared/*` - Shared utilities and components
- `@/app/*` → `./app/*` - Next.js App Router files

**State Management**: Uses Zustand (`shared/model/store.ts`) for client state with a centralized `VideoStore` containing:

- Current video state, playlist, categories
- Player controls (playing, volume, time, quality, fullscreen)

**API Layer**: Custom `ApiClient` class (`shared/api/api.ts`) with:

- Type-safe requests with full TypeScript support
- Environment-based base URL (`NEXT_PUBLIC_API_URL`)
- Standard REST methods (GET, POST, PUT, DELETE)
- Built-in error handling and parameter serialization

**UI Components**: Uses Shadcn/UI + Radix UI primitives with core components (button, card, dialog, input, skeleton, toast) in `shared/ui/components/ui/`

**Styling**: Tailwind CSS 4.1.9 with custom configuration and theme support via `next-themes`

### Development Notes

**Environment Setup**: Requires `NEXT_PUBLIC_API_URL` environment variable pointing to backend API (defaults to `http://localhost:3000/api/v1/`)

**TypeScript**: Strict configuration with comprehensive path mapping. All components should be fully typed.

**Build Configuration**:

- ESLint and TypeScript errors are ignored during builds (`next.config.mjs`)
- Images are unoptimized for deployment flexibility

**Package Manager**: Uses PNPM - all commands should use `pnpm` not `npm`

# Development Guideline

You are an expert full-stack developer proficient in TypeScript, React, Next.js, and modern UI/UX frameworks (e.g., Tailwind CSS, Shadcn UI, Radix UI). Your task is to produce the most optimized and maintainable Next.js code, following best practices and adhering to the principles of clean code and robust architecture.

### Objective

- Create a Next.js solution that is not only functional but also adheres to the best practices in performance, security, and maintainability.

### Code Style and Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Favor iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
- Structure files with exported components, subcomponents, helpers, static content, and types.
- Use lowercase with dashes for directory names (e.g., `components/auth-wizard`).

- Use modern state management solutions (e.g., Zustand, TanStack React Query) to handle global state and data fetching.
- Implement validation using Zod for schema validation.

### Component Patterns

- Use functional components with hooks
- Implement loading states with skeleton components (e.g., `VideoCardSkeleton`, `CategorySkeleton`)
- Error boundaries are implemented via `ErrorBoundary.tsx`
- Video player logic is centralized in `features/video-player/`
- Follow FSD conventions: entities → features → widgets → shared

### Optimization and Best Practices

- Minimize the use of `'use client'`, `useEffect`, and `setState`; favor React Server Components (RSC) and Next.js SSR features.
- Implement dynamic imports for code splitting and optimization.
- Use responsive design with a mobile-first approach.
- Optimize images: use WebP format, include size data, implement lazy loading.

### Error Handling and Validation

- Prioritize error handling and edge cases:
- Use early returns for error conditions.
- Implement guard clauses to handle preconditions and invalid states early.
- Use custom error types for consistent error handling.

### UI and Styling

- Use modern UI frameworks (e.g., Tailwind CSS, Shadcn UI, Radix UI) for styling.
- Implement consistent design and responsive patterns across platforms.

### Security and Performance

- Implement proper error handling, user input validation, and secure coding practices.
- Follow performance optimization techniques, such as reducing load times and improving rendering efficiency.

### Testing and Documentation

- Write unit tests for components using Jest and React Testing Library.
- Provide clear and concise comments for complex logic.
- Use JSDoc comments for functions and components to improve IDE intellisense.

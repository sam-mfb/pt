# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT
- **ALWAYS READ ARCHITECTURE.md FIRST** when starting a new session to understand the project structure
- If you make significant changes to the codebase structure, organization, or architecture, update ARCHITECTURE.md to reflect those changes
- The project uses Redux Toolkit for state management - familiarize yourself with the store structure in `src/store/`

## Commands
- `npm run dev` - Start the development server (host 0.0.0.0, port 3000)
- `npm run build` - Build the app for production
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## Code Style
- Use strict TypeScript with explicit return types on functions
- Follow functional programming patterns and loose coupling 
- Use React hooks for state management
- Follow component hierarchy: use context for shared state
- Handle errors explicitly with proper typing
- Use camelCase for variables/functions, PascalCase for components
- Components should be organized by feature in the components directory
- Prefer named exports over default exports
- Maintain immutability in state updates
- Write tests for business logic
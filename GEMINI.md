# GEMINI.md — Team Directory

## Project Overview
Team Directory is a production-quality single-page application demo built with **React 19** and **Tailwind CSS 4**. It serves as a company people directory, allowing users to filter employees, view profiles, and create new entries. The project uses a unique three-layer mock persistence system that runs entirely in the browser using `localStorage`.

### Main Technologies
- **React 19**: Functional components, hooks, and modern patterns.
- **TypeScript 5.7**: Strict mode enabled; no `any` allowed.
- **Tailwind CSS 4**: Vite-integrated styling; no `tailwind.config.js`.
- **TanStack React Query 5**: Orchestrates all "server" (mock async) state.
- **React Router 7**: Handles navigation via `createBrowserRouter`.
- **Lucide React**: Icon library.

## Building and Running
### Commands
- `npm run dev`: Starts the Vite development server at http://localhost:5173.
- `npm run build`: Runs type-checking (`tsc`) and produces a production build.
- `npm run preview`: Previews the production build locally.
- `npm run typecheck`: Performs TypeScript type-checking without building.

### Database Seeding
The app automatically seeds `localStorage` from `src/db/employees.json` on the first load. To manually reset the data to the seed state, run `db.reset()` in the browser console and refresh.

## Architecture and Conventions
### Three-Layer Data Flow
To maintain a clean boundary for future backend integration, follow this three-layer flow:
1. **Mock DB (`src/db/db.ts`)**: Synchronous CRUD operations over `localStorage`.
2. **Service Layer (`src/services/`)**: Async wrappers that call the DB and simulate network latency (400–800ms).
3. **Hooks (`src/hooks/`)**: React Query hooks that call services. **Components should only ever call these hooks.**

### Code Style
- **Functional Components**: Class components are strictly prohibited.
- **Styling**: Use Tailwind utility classes exclusively. Avoid inline `style` props or CSS modules. Theme tokens are defined in `src/index.css`.
- **Strict Types**: Never use `any`. Use `unknown` or specific interfaces from `src/types/`.
- **Naming**:
    - Components: `PascalCase` (e.g., `EmployeeCard.tsx`).
    - Hooks: `camelCase` starting with `use` (e.g., `useEmployees.ts`).
    - Services: `camelCase` verbs (e.g., `getEmployees`).
- **File Exports**: Each file should have one primary export matching its filename.

### Workflow Conventions
- **Pull Requests**: Use the GitHub CLI (`gh`) for creating and managing Pull Requests. The standard MCP `create_pull_request` tool has been identified as unreliable in this environment (returns 404).
    - To create a PR: `gh pr create --title "..." --body-file ... --base main --head ...`

### React Query Keys
Maintain the factory pattern for query keys found in `src/hooks/useEmployees.ts`:
```ts
export const entityKeys = {
  all: ['entity'] as const,
  detail: (id: string) => ['entity', id] as const,
};
```

## Directory Structure
- `src/components/ui/`: Generic primitives (Button, Input, Badge) using prop spreading.
- `src/components/layout/`: App chrome (AppShell, Sidebar).
- `src/components/employees/`: Domain-specific components for the employee model.
- `src/pages/`: Route-level components.
- `src/services/`: The async boundary layer.
- `src/db/`: LocalStorage persistence logic and seed JSON.

## Implementation Roadmap (TODOs)
The following features are intentionally missing and marked with `// TODO:` comments:
- **Search**: Implement employee search in `src/pages/EmployeesPage.tsx`.
- **Edit/Delete**: Implement `updateEmployee` and `deleteEmployee` in `src/services/employeeService.ts` and the UI in `src/pages/EmployeeDetailPage.tsx`.
- **List View**: Implement the toggle and `EmployeeRow.tsx` in `src/pages/EmployeesPage.tsx`.
- **Avatar Upload**: Support image URL props in `src/components/ui/Avatar.tsx`.

*Note: Functions marked `TODO(user):` are reserved for human collaboration and should not be modified by agents without explicit instruction.*

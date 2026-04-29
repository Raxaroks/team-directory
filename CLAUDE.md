# CLAUDE.md — Team Directory

Primary context document for coding agents working on this repository.

## App purpose

Team Directory is a single-page web app that displays a company's people roster. It supports listing all employees in a filterable grid, viewing an individual profile, and creating new employees. There is no real backend — the "database" is a JSON seed file that is loaded into `localStorage` on first run, then read and mutated through a thin async service layer that simulates network latency. The app is a working demo and a substrate for coding-agent exercises: several features are intentionally absent so an agent can implement them.

## Tech stack & versions

- React 19 (functional components and hooks only)
- TypeScript 5.7 in strict mode
- Vite 6
- Tailwind CSS 4 (via `@tailwindcss/vite`, no `tailwind.config.js`; theme tokens live in `src/index.css` under `@theme`)
- React Router 7 (`react-router-dom`)
- TanStack React Query 5 (`@tanstack/react-query`)
- lucide-react for icons

## Architecture decisions

- **Routing**: `createBrowserRouter` in `src/router.tsx`, with a single `AppShell` layout route wrapping all pages. Pages use `Outlet` rendering. URL is the source of truth for which page is shown — page-local state (filters, form state) is kept in component state only.
- **Data fetching**: All async data flows through React Query. Components never call `fetch` or service functions directly — they call hooks in `src/hooks/`. The hooks call service functions in `src/services/`. The services call `db` in `src/db/db.ts`. Query keys are produced by a tiny factory (`employeeKeys`) so they stay consistent across the codebase.
- **Mock persistence**: `src/db/employees.json` is the seed file (the human-editable source of truth). On first import of `src/db/db.ts` it is copied into `localStorage` under the key `team_directory_db`. All subsequent reads/writes go through `localStorage`, so changes survive page refresh. `db.reset()` repopulates `localStorage` from the seed file. The `db` object is also attached to `window` for console use during demos.
- **Styling**: Tailwind utility classes only. No CSS modules, no inline `style={}` props, no styled-components. Custom theme tokens (colors, fonts) are declared in `src/index.css` under `@theme` and referenced as utilities (e.g. `bg-ink-900`, `text-accent-700`).
- **Loading UX**: Skeleton blocks instead of spinners. Lists show 8 skeleton cards. Detail page shows a skeleton mirror of its layout.

## Code style rules

- TypeScript strict mode. **No `any`.** If you need an escape hatch use `unknown` and narrow.
- Functional components only — no class components.
- All styling via Tailwind utility classes. No inline `style={}`, no CSS modules, no CSS-in-JS.
- React Query for all async/server state. Do **not** use `useState` + `useEffect` for data fetching.
- Custom hooks live in `src/hooks/` and are prefixed with `use`.
- Service functions live in `src/services/`, return Promises, and never touch React.
- Files export one primary symbol whose name matches the filename.

## Naming conventions

- Components: `PascalCase` (filename matches export, e.g. `EmployeeCard.tsx`).
- Hooks: `camelCase` prefixed with `use` (e.g. `useEmployees.ts`).
- Types and interfaces: `PascalCase` (e.g. `Employee`, `EmploymentStatus`).
- Service functions: `camelCase` verbs (e.g. `getEmployees`, `createEmployee`).
- Constants: `UPPER_SNAKE_CASE` only when truly constant arrays/maps; otherwise `camelCase`.

## Component guidelines

- **UI primitives** (`src/components/ui/`): generic building blocks (`Button`, `Input`, `Select`, `Badge`, `Avatar`, `Skeleton`). Should accept standard HTML props via spread (`...rest`) so they remain composable.
- **Layout** (`src/components/layout/`): app chrome (`AppShell`, `Sidebar`, `TopBar`). Stateless or near-stateless.
- **Domain components** (`src/components/employees/`): components specific to the Employee model (`EmployeeCard`, `EmployeeRow`, `EmployeeGrid`, `DepartmentFilter`, `StatusBadge`).
- **Pages** (`src/pages/`): one default-exported component per route. Pages should contain minimal logic — they delegate to hooks and compose smaller components. Filtering/sorting state may live in the page component since it is route-scoped.

## Query key conventions

Defined in `src/hooks/useEmployees.ts`:

```ts
export const employeeKeys = {
  all: ['employees'] as const,
  detail: (id: string) => ['employees', id] as const,
};
```

When you add a new entity, follow the same factory pattern: `<entity>Keys.all`, `<entity>Keys.detail(id)`, plus `<entity>Keys.list(filters)` if you parameterize lists.

After a mutation, invalidate the relevant key:

```ts
queryClient.invalidateQueries({ queryKey: employeeKeys.all });
```

## Mock database architecture (three layers)

1. **`src/db/employees.json`** — seed file. Plain JSON, hand-editable. Treated as the source of truth on first run and on `db.reset()`.
2. **`src/db/db.ts`** — synchronous CRUD over `localStorage` under the key `team_directory_db`. Exposes `getAll`, `getById`, `insert`, `update`, `remove`, `reset`. Attached to `window.db` for console use. The module's first import seeds `localStorage` if it is empty, so importing `./db/db` for side-effects in `main.tsx` is intentional and required.
3. **`src/services/employeeService.ts`** — async wrappers over `db.*` that introduce a 400–800ms simulated delay. This is the **only** layer that hooks and components are allowed to call.

**Never** call `db.*` directly from components or hooks. Always go through the service layer. This rule exists so that swapping in a real backend later is a one-file change.

To reset the mock data during a demo, open the browser console and run:

```js
db.reset()
```

Then refresh the page. To change the seed data, edit `src/db/employees.json` and call `db.reset()` (or clear the `team_directory_db` key in DevTools → Application → Local Storage).

## How to add a new feature

1. **Types** — add or extend an interface in `src/types/`.
2. **DB method** (only if needed) — add a CRUD method on `db` in `src/db/db.ts`.
3. **Service function** — add an async wrapper in `src/services/<entity>Service.ts` that calls `db` and applies `delay()`.
4. **Hook** — add a `useQuery` or `useMutation` hook in `src/hooks/`. Use the key factory pattern.
5. **Component** — build the UI in `src/components/<area>/` or extend a page in `src/pages/`. Use existing UI primitives.
6. **Router** — wire it into `src/router.tsx` if it's a new route.

## Known TODOs (intentionally missing — implement these)

| Feature | File | TODO comment |
| --- | --- | --- |
| Search | `src/pages/EmployeesPage.tsx` | `// TODO: implement employee search` |
| Edit employee | `src/pages/EmployeeDetailPage.tsx` | `// TODO: implement edit employee` |
| Delete employee | `src/pages/EmployeeDetailPage.tsx` | `// TODO: implement delete employee (with confirmation dialog)` |
| List view toggle | `src/pages/EmployeesPage.tsx` + `src/components/employees/EmployeeRow.tsx` | `// TODO: implement list view with EmployeeRow component` |
| Avatar image upload | `src/components/ui/Avatar.tsx` | `// TODO: support image URL prop` |

There are also two `TODO(user):` markers reserved for the human collaborator — avatar initials logic and form validation logic. Do not silently overwrite those without asking.

Stub service functions for `updateEmployee` and `deleteEmployee` are commented out in `src/services/employeeService.ts` — uncomment and finish them when implementing edit/delete.

## What NOT to do

- No class components.
- No inline `style={}` props or CSS modules.
- No raw `fetch`/`axios` outside the service layer.
- No `useState` + `useEffect` for fetching server data — use React Query.
- No direct calls to `db.*` from components or hooks — go through `src/services/`.
- Do not remove the `import './db/db'` side-effect import in `src/main.tsx` (it triggers `localStorage` seeding on first load).
- Do not commit changes that introduce TypeScript errors. Run `npm run typecheck`.

# Team Directory

A small but production-quality single-page demo of a company people directory. Built as a React 19 + Tailwind v4 + React Query app with a mock localStorage-backed "database" so it runs entirely in the browser.

This repo doubles as a substrate for coding-agent exercises: a handful of features are intentionally absent and clearly marked.

## Tech stack

| Tool | Version |
| --- | --- |
| React | 19 |
| TypeScript | 5.7 (strict) |
| Vite | 6 |
| Tailwind CSS | 4 (Vite plugin, no `tailwind.config.js`) |
| React Router | 7 (`react-router-dom`) |
| TanStack React Query | 5 |
| lucide-react | latest |

## Getting started

```bash
git clone <this-repo>
cd team-directory
npm install
npm run dev
```

Then open http://localhost:5173 in your browser. The first load seeds `localStorage` from `src/db/employees.json`; subsequent loads read from `localStorage`.

Available scripts:

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and produce a production build
- `npm run preview` — preview the production build
- `npm run typecheck` — type-check only (no build)

## Project structure

```
src/
├── components/
│   ├── layout/         # AppShell, Sidebar, TopBar — app chrome
│   ├── ui/             # Avatar, Badge, Button, Input, Select, Skeleton — generic primitives
│   └── employees/      # Employee-domain components (cards, filter, status badge)
├── pages/              # One file per route; default-exported page component
├── services/           # Async wrappers over the db layer (the boundary that adds latency)
├── hooks/              # React Query hooks (queries + mutations) and key factories
├── types/              # Shared TypeScript interfaces
├── db/                 # Mock persistence: seed JSON + localStorage manager
├── lib/                # Cross-cutting setup (queryClient)
├── router.tsx          # Router config (createBrowserRouter)
├── main.tsx            # App entry — providers + router mount
└── index.css           # Tailwind import + theme tokens + global styles
```

## Available routes

| Path | Component | Description |
| --- | --- | --- |
| `/` | `EmployeesPage` | Filterable grid of all employees |
| `/employees/new` | `NewEmployeePage` | Create a new employee (form with validation) |
| `/employees/:id` | `EmployeeDetailPage` | Read-only profile view |
| `*` | `NotFoundPage` | 404 fallback |

## Data model

```ts
type EmploymentStatus = 'active' | 'on_leave' | 'contractor';

type Department =
  | 'Engineering'
  | 'Design'
  | 'Product'
  | 'Marketing'
  | 'Sales'
  | 'HR'
  | 'Finance';

interface Employee {
  id: string;              // Generated on creation; format "emp_<uuid>"
  firstName: string;
  lastName: string;
  email: string;
  role: string;            // e.g. "Senior Frontend Engineer"
  department: Department;
  status: EmploymentStatus;
  startDate: string;       // ISO "YYYY-MM-DD"; defaults to today on creation
  location: string;        // Free-form, e.g. "Remote – Mexico City"
  bio?: string;            // Optional, 1–2 sentences
}
```

## Mock database layer

The "database" is a three-layer system, designed so the service interface looks like a real backend even though everything runs in the browser.

| Layer | File | Role |
| --- | --- | --- |
| 1. Seed | `src/db/employees.json` | Source of truth. Hand-editable JSON file with the initial roster. |
| 2. DB manager | `src/db/db.ts` | Synchronous CRUD over `localStorage` (`team_directory_db` key). Seeds from JSON on first load. Exposed on `window.db` for console use. |
| 3. Service | `src/services/employeeService.ts` | Async wrappers that add a 400–800 ms simulated delay. The **only** layer that hooks/components call. |

### Resetting the mock data

Open the browser DevTools console and run:

```js
db.reset()
```

Then refresh the page. This re-imports `employees.json` and overwrites `localStorage`.

### Editing the seed data

Edit `src/db/employees.json` directly — add, remove, or modify entries. Then either run `db.reset()` in the console, or open DevTools → Application → Local Storage and delete the `team_directory_db` key. Refresh the page and the JSON file will be re-seeded.

## Known missing features

These are deliberately absent and marked with `// TODO:` comments. They are good targets for adding real features.

| Feature | File | TODO comment location |
| --- | --- | --- |
| Search | `src/pages/EmployeesPage.tsx` | Top of file, near other commented imports |
| Edit employee | `src/pages/EmployeeDetailPage.tsx` | Inside the profile header card |
| Delete employee | `src/pages/EmployeeDetailPage.tsx` | Inside the profile header card |
| List view toggle | `src/pages/EmployeesPage.tsx` + `src/components/employees/EmployeeRow.tsx` | Top of EmployeesPage; whole `EmployeeRow.tsx` is a placeholder |
| Avatar image upload | `src/components/ui/Avatar.tsx` | Top of file (above `interface AvatarProps`) |

There are also two **`TODO(user):`** slots intended for the human collaborator — see [Working with Coding Agents](#working-with-coding-agents) below.

## Working with Coding Agents

Conventions used throughout this codebase that an agent should preserve:

- **Strict TypeScript.** No `any`. Use `unknown` plus narrowing if you need an escape hatch.
- **Functional components only.** No class components.
- **Tailwind utility classes only.** No inline `style={}`, no CSS modules. Theme tokens live in `src/index.css` under `@theme` and are referenced as utilities (e.g. `bg-ink-900`, `text-accent-700`).
- **React Query for all server state.** Don't fetch with `useState` + `useEffect`. Query keys are produced by a factory (see `employeeKeys` in `src/hooks/useEmployees.ts`) — follow the same pattern for new entities.
- **The service layer is the boundary.** Components call hooks; hooks call services; services call `db`. Components and hooks must never call `db.*` directly.
- **Filenames match exports.** A component called `EmployeeCard` lives in `EmployeeCard.tsx` and is its primary export.

### User contribution slots

Two functions are deliberately left as stubs marked `TODO(user):` for the human collaborator to implement, because they involve trade-offs worth thinking through:

1. **`computeInitials` in `src/components/ui/Avatar.tsx`** — how to derive avatar initials from a person's name. One letter vs. two? Strip diacritics? Fallback for single-name people?
2. **`validateEmployeeForm` in `src/pages/NewEmployeePage.tsx`** — form validation strategy. What counts as a valid email? Length limits? On-submit only or also on-blur?

If you are an agent, do not silently overwrite those without confirming with the user — the choices shape the feel of the app.

For everything else, see [`CLAUDE.md`](./CLAUDE.md) for the agent-oriented context document.

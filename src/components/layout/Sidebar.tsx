import { NavLink } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Directory', icon: Users, end: true },
  { to: '/employees/new', label: 'Add Employee', icon: UserPlus, end: false },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-200/70 bg-surface md:flex">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-white">
          <Users className="h-4 w-4" />
        </div>
        <span className="font-display text-lg font-semibold text-ink-900">Acme</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
          Workspace
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-50 text-accent-700'
                  : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent-500" />
                )}
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-200/70 p-4 text-xs text-ink-500">
        <p className="font-medium text-ink-700">Team Directory</p>
        <p>v0.1.0 · demo build</p>
      </div>
    </aside>
  );
}

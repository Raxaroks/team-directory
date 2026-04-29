import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div className="flex h-full min-h-screen bg-canvas">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}

import seedData from './employees.json';
import type { Employee } from '../types/employee';

const STORAGE_KEY = 'team_directory_db';

function load(): Employee[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData as Employee[];
  }
  try {
    return JSON.parse(raw) as Employee[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData as Employee[];
  }
}

function save(data: Employee[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const db = {
  getAll(): Employee[] {
    return load();
  },

  getById(id: string): Employee | null {
    return load().find((e) => e.id === id) ?? null;
  },

  insert(employee: Employee): Employee {
    const data = load();
    data.push(employee);
    save(data);
    return employee;
  },

  update(id: string, patch: Partial<Omit<Employee, 'id'>>): Employee | null {
    const data = load();
    const idx = data.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    const updated = { ...data[idx], ...patch };
    data[idx] = updated;
    save(data);
    return updated;
  },

  remove(id: string): boolean {
    const data = load();
    const next = data.filter((e) => e.id !== id);
    if (next.length === data.length) return false;
    save(next);
    return true;
  },

  /**
   * Resets localStorage back to the original seed data from employees.json.
   * Call this from the browser console: db.reset()
   */
  reset(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
  },
};

if (typeof window !== 'undefined') {
  (window as unknown as { db: typeof db }).db = db;
  load();
}

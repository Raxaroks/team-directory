import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from './components/layout/AppShell';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import NewEmployeePage from './pages/NewEmployeePage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <EmployeesPage /> },
      { path: 'employees/new', element: <NewEmployeePage /> },
      { path: 'employees/:id', element: <EmployeeDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

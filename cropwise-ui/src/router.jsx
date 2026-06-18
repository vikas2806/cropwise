import { createBrowserRouter } from 'react-router-dom'
import AppShell    from './components/layout/AppShell'
import Dashboard   from './pages/Dashboard'
import MapExplorer from './pages/MapExplorer'
import Analytics   from './pages/Analytics'
import FieldDetail from './pages/FieldDetail'
import Alerts      from './pages/Alerts'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true,       element: <Dashboard /> },
      { path: 'map',       element: <MapExplorer /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'field/:id', element: <FieldDetail /> },
      { path: 'alerts',    element: <Alerts /> },
    ],
  },
])

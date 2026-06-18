import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppShell    from './components/layout/AppShell'
import LandingPage from './pages/LandingPage'
import Dashboard   from './pages/Dashboard'
import MapExplorer from './pages/MapExplorer'
import Analytics   from './pages/Analytics'
import FieldDetail from './pages/FieldDetail'
import Alerts      from './pages/Alerts'

export const router = createBrowserRouter([
  // Landing page — full screen, no AppShell
  { path: '/', element: <LandingPage /> },

  // App shell routes
  {
    path: '/',
    element: <AppShell />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'map',       element: <MapExplorer /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'field/:id', element: <FieldDetail /> },
      { path: 'alerts',    element: <Alerts /> },
    ],
  },
])

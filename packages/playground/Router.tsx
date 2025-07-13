import { createContext, useContext, useMemo, useReducer } from 'react'
import DashboardPage from './app/pages/dashboard.tsx'
import HomePage from './app/pages/index.tsx'
import LoginPage from './app/pages/login.tsx'
import type { ActionDispatch } from 'react'

type Route = `/${string}`

const RouteContext = createContext<{
  currentRoute: Route
  dispatchRoute: ActionDispatch<[route: string]>
} | null>(null)

export default function Router() {
  const [currentRoute, dispatchRoute] = useReducer(
    (_currentRoute, route: string) => route as Route,
    window.location.pathname as Route
  )

  const routeComponent = useMemo(() => {
    if (currentRoute === '/') {
      return <HomePage />
    }

    if (currentRoute === '/login') {
      return <LoginPage />
    }

    if (currentRoute === '/dashboard') {
      return <DashboardPage />
    }

    dispatchRoute('/error')
    history.pushState(null, '', '/error')

    return <h1>Not found</h1>
  }, [currentRoute])

  return <RouteContext value={{ currentRoute, dispatchRoute }}>{routeComponent}</RouteContext>
}

export function navigateTo(route: Route): void {
  const routerContext = useContext(RouteContext)
  routerContext?.dispatchRoute(route)

  history.pushState(null, '/error')
}

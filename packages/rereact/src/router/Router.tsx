import { ReactNode } from 'react'

type RouteProps = {
  routes: {
    [path: `/${string}`]: ReactNode
  }
}

export default function Router({ routes }: RouteProps) {
  const currentPath = window.location.pathname

  const route = routes[currentPath]

  if (route) {
    return route()
  }

  return <h1>Not found</h1>
}

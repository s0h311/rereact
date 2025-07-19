import type { ReactElement } from 'react'

export type RouteToComponent = {
  [path: `/${string}`]: ReactElement
}

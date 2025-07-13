import { createElement } from 'react'
import type { Routes } from './types.ts'

export default function RouterComponent(routes: Routes) {
  const path = window?.location.pathname ?? '/'

  // ##List and return ROUTES##

  return createElement('h1', {}, 'Not found')
}

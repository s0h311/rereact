// @ts-expect-error this path is correct, as it will resolve in the dist directory of the app
import Router from './Router.tsx'
// @ts-expect-error this path is correct, as it will resolve in the dist directory of the app
import routes from './routes.ts'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <Router routes={routes}></Router>
  </StrictMode>
)

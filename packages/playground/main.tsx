import { StrictMode } from 'react'
import Router from './Router.tsx'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <Router />
  </StrictMode>
)

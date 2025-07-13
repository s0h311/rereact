import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from '##RouterPath##'

export const REACT_ROOT_ELEMENT_ID = 'app'

const root = createRoot(document.getElementById(REACT_ROOT_ELEMENT_ID)!)

root.render(
  <StrictMode>
    <Router />
  </StrictMode>
)

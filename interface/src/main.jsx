import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import Inventory from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Inventory />
  </StrictMode>,
)

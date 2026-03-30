import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { BackendAuthProvider } from './context/BackendAuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BackendAuthProvider>
        <App />
      </BackendAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

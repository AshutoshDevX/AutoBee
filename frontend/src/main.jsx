import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { SignInPage } from './auth/SignInPage.jsx'
import { Home } from './Pages/Home.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { Footer } from './components/ui/Footer.jsx'
import { Layout } from './auth/Layout.jsx'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
          </Route>
          <Route path="/signin" element={<Layout />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)

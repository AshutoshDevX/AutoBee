import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Home } from './Pages/Home.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { Footer } from './components/ui/Footer.jsx'
import { Header } from './components/ui/Header.jsx'
import { SignInPage } from './auth/SignInPage.jsx'
import { SignUpPage } from './auth/SignUpPage.jsx'
import { Error } from './Pages/Error.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} signInUrl="/signin"
      signUpUrl="/signup">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)

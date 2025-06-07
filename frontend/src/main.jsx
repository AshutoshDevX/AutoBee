import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ClerkProvider } from '@clerk/clerk-react'
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import { SignInPage } from './auth/SignInPage.jsx'
import { SignUpPage } from './auth/SignUpPage.jsx'
import { Error } from './Pages/Error.jsx'
import { Toaster } from 'sonner';
import { Cars } from './Pages/main/Cars.jsx'
import { AdminLayout } from './Pages/Admin/AdminLayout.jsx'

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
          <Route path="/cars/:id" element={<Cars />} />
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
        <Toaster richColors />
        <Footer />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)

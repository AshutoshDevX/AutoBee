import { Route, Routes } from "react-router"
import { Home } from "./Pages/Home"
import "./App.css"
import { useContext } from "react"
import { AdminContext } from "./components/AdminContext"
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import { SignInPage } from './auth/SignInPage.jsx'
import { SignUpPage } from './auth/SignUpPage.jsx'
import { Error } from './Pages/Error.jsx'
import { Toaster } from 'sonner';
import { Cars } from './Pages/main/Cars.jsx'
import { AdminLayout } from './Pages/Admin/AdminLayout.jsx'
function App() {
  const [isAdminPage] = useContext(AdminContext);
  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Error />} />
          <Route path="/cars/:id" element={<Cars />} />
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
        <Toaster richColors />
        {!isAdminPage && <Footer />}
      </div>
    </>
  )
}

export default App

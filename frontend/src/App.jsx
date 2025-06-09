import { Route, Routes, useLocation } from "react-router"
import { Home } from "./Pages/Home"
import "./App.css"
// import { useContext } from "react"
// import { AdminContext } from "./components/AdminContext"
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import { SignInPage } from './auth/SignInPage.jsx'
import { SignUpPage } from './auth/SignUpPage.jsx'
import { Error } from './Pages/Error.jsx'
import { Toaster } from 'sonner';
import { Cars } from "./Pages/main/Cars/Cars.jsx"
import { AdminLayout } from './Pages/Admin/AdminLayout.jsx'
import { AdminPage } from "./Pages/Admin/AdminPage.jsx"
import { Settings } from "./Pages/main/Settings/Settings.jsx"
import { TestDrive } from "./Pages/main/test-drive/TestDrive.jsx"
function App() {
  // const [isAdminPage] = useContext(AdminContext);
  const { pathname } = useLocation();
  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Error />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPage />} />                {/* /admin */}
            <Route path="cars" element={<Cars />} />          {/* /admin/cars */}
            <Route path="settings" element={<Settings />} />  {/* /admin/settings */}
            <Route path="test-drives" element={<TestDrive />} />
          </Route>
        </Routes>
        <Toaster richColors />
        {pathname != "/admin/*" && <Footer />}
      </div>
    </>
  )
}

export default App

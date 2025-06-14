import { Route, Routes, useLocation } from "react-router"
import { Home } from "./Pages/Home"
import "./App.css"
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import { SignInPage } from './auth/SignInPage.jsx'
import { SignUpPage } from './auth/SignUpPage.jsx'
import { Error } from './Pages/Error.jsx'
import { Toaster } from 'sonner';
import { Cars } from "./Pages/Admin/cars/Cars.jsx"
import { AdminLayout } from './Pages/Admin/AdminLayout.jsx'
import { AdminPage } from "./Pages/Admin/AdminPage.jsx"
import { Settings } from "./Pages/Admin/settings/Settings.jsx"
import { TestDrive } from "./Pages/Admin/test-drive/TestDrive.jsx"
import { AddCarPage } from "./Pages/Admin/cars/components/AddCarPage.jsx"
import { CarsPage } from "./Pages/main/Cars/Cars.jsx"

function App() {
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
            <Route index element={<AdminPage />} />
            <Route path="cars" element={<Cars />} />
            <Route path="cars/create" element={<AddCarPage />} />
            <Route path="create" element={<AddCarPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="test-drives" element={<TestDrive />} />
          </Route>
          <Route path="/cars" element={<CarsPage />}>

          </Route>
        </Routes>
        <Toaster richColors />
        <Footer />
      </div>
    </>
  )
}

export default App

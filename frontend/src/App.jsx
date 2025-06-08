import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/clerk-react"
import { Navigate, Outlet } from "react-router"
import { Home } from "./Pages/Home"
import "./App.css"
import { useContext } from "react"
import { AdminContext } from "./components/AdminContext"
import { useEffect } from "react"
function App() {
  const [, setIsAdminPage] = useContext(AdminContext);

  useEffect(() => {
    setIsAdminPage(false);
  }, [])
  return (
    <>
      <div>
        <Outlet />
        <Home />
      </div>
    </>
  )
}

export default App

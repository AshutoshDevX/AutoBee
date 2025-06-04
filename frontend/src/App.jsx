import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/clerk-react"
import { Navigate, Outlet } from "react-router"
import { Home } from "./Pages/Home"
import "./App.css"

function App() {
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

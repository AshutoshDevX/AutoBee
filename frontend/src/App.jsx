import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/clerk-react"
import { Navigate, Outlet } from "react-router"


function App() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isSignedIn && isLoaded) {
    return <Navigate to={"/signin"} />
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Outlet />
      </div>
    </>
  )
}

export default App

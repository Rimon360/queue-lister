import { Navigate } from "react-router-dom"
import { useState, useEffect } from "react"

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const predefinedPassword = "true"

  useEffect(() => {
    const storedPassword = sessionStorage.getItem("login")
    if (storedPassword === predefinedPassword) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  if (isAuthenticated === null) return null // wait for check
  if (!isAuthenticated) return <Navigate to="/login" />

  return children
}

export default ProtectedRoute

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "../pages/Dashboard.jsx"
import History from "../pages/History.jsx"
import NotFound from "../pages/NotFound.jsx"
import Login from "../pages/Login.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "../pages/Dashboard.jsx"
import NotFound from "../pages/NotFound.jsx"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

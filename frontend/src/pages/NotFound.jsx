import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-gray-100">404</h1>
        <h2 className="text-3xl font-semibold text-gray-300">Página No Encontrada</h2>
        <p className="text-gray-400">La página que buscas no existe o ha sido movida.</p>
        <Link to="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Ir al Inicio
        </Link>
      </div>
    </div>
  )
}

export default NotFound

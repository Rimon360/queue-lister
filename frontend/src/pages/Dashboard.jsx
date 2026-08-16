import React, { useState, useEffect, useRef } from "react"
import axios from "../../axiosConfig.js"
import { getRandomInRange, wait } from "../util.js"
import TabNav from "../components/TabNav.jsx"

const Dashboard = () => {
  // Sample data for the queue
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
  const [queues, setQueues] = useState([])
  const [filteredQueues, setFilteredQueues] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  const [isRefresh, setIsRefresh] = useState(Date.now())
  const [refreshTime, setRefreshTime] = useState(0)
  useEffect(() => {
    let cancelled = false
    let int
    ;(async () => {
      // keep polling until the tab is left, otherwise the loop outlives the page
      while (!cancelled) {
        try {
          let result = await axios.get(BACKEND_URL + "/queue/get")
          if (cancelled) return
          let queues = result.data
          setTotalCount(queues.length)
          setQueues(queues)
          setFilteredQueues(queues)
        } catch (error) {}
        let v = getRandomInRange(10, 10)
        clearInterval(int)
        int = setInterval(() => {
          setRefreshTime(v--)
        }, 1000)
        await wait(v)
      }
    })()
    return () => {
      cancelled = true
      clearInterval(int)
    }
  }, [isRefresh])

  const [searchTerm, setSearchTerm] = useState("")
  // Handle search functionality
  useEffect(() => {
    let result = queues.length > 0 ? queues?.filter((queue) => queue._id.toLowerCase().includes(searchTerm.toLowerCase()) || queue.redirectUrl.toLowerCase().includes(searchTerm.toLowerCase())) : []
    setFilteredQueues(result)
  }, [searchTerm])

  // Refresh function (you can replace this with actual API call)

  const [copyText, setCopyText] = useState("Copiar")

  const handleDelete = async (id) => {
    if (1) {
      let result = await axios.post(BACKEND_URL + "/queue/delete/" + id)
      if (result.data.success) {
        let filtered = queues.length > 0 ? queues?.filter((queue) => queue._id !== id) : []
        setQueues(filtered)
        setFilteredQueues(filtered)
      }
    }
  }
  const handleDeleteLimited = async () => {
    console.log("hi")

    if (confirm("¿Estás seguro?")) {
      let result = await axios.post(BACKEND_URL + "/queue/delete-limited")
      if (result.data.success) {
        location.reload()
      }
    }
  }
  return (
    <div className="p-6 max-w-fit mx-auto">
      <TabNav />
      <div className="mb-6 flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-blue-800">Panel de Colas</h1>
        <button onClick={handleDeleteLimited} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center">
          Eliminar los 50 antiguos
        </button>
        <button onClick={(e) => location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          Actualizando en {refreshTime}s
        </button>
      </div>

      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="Search queues..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div> */}

      <div className="overflow-x-auto bg-gray-900 border border-gray-700 rounded-lg shadow">
        <h1 className="font-bold p-2 text-gray-200">Conteo total: {totalCount}</h1>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Url de Redirección</th>
              <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
              <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Tiempo Restante</th>
              <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Hora de Servicio</th>
              <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Última Actualización</th>
              <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Progreso</th>
              <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Error</th>
              <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Hora de Ingreso</th>
              <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Eliminar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-left">
            {filteredQueues.map((queue) => (
              <tr key={queue._id} className="hover:bg-gray-50">
                <td className="px-6 py-1 whitespace-nowrap">
                  <div className="flex gap-1 items-center ">
                    {!queue.redirectUrl && !queue.original_queue_url ? (
                      ""
                    ) : (
                      <button
                        onClick={() => {
                          window.navigator.clipboard.writeText(queue.redirectUrl || queue.original_queue_url)
                        }}
                        className="bg-green-900/50 px-4 mb-1 hover:bg-black hover:text-white text-green-400 rounded-md"
                      >
                        {copyText || "Copiar"}
                      </button>
                    )}
                    <p className="max-w-[300px] overflow-hidden text-ellipsis bg-blue-900/50 px-2 text-blue-500 rounded-md text-sm">{queue.redirectUrl || queue.original_queue_url || "Pendiente..."}</p>
                  </div>
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-green-400">{queue.forecastStatus || "-"}</td>
                <td className="px-2 py-1 whitespace-nowrap text-yellow-500">{queue.whichIsIn || "-"}</td>
                <td className="px-2 py-1 whitespace-nowrap text-yellow-500">{queue.expectedServiceTime || "-"}</td>
                <td className="px-2 py-1 whitespace-nowrap text-yellow-500">{queue.lastUpdatedUTC || "-"}</td>
                <td className="px-2 py-1 whitespace-nowrap text-yellow-500">{parseFloat(queue.progress || 0) * 100 + "%" || "-"}</td>
                <td className="px-2 py-1 whitespace-nowrap text-yellow-500">{queue.Error || "-"}</td>
                <td className="px-2 py-1 whitespace-nowrap text-yellow-500">{queue.createdAt || "-"}</td>
                <td className="px-2 py-1 whitespace-nowrap text-yellow-500">
                  <button
                    onClick={(e) => {
                      handleDelete(queue._id)
                    }}
                    className="bg-red-900/50 px-2 mb-1 text-red-500 rounded-md"
                  >
                    Elim
                  </button>
                </td>
              </tr>
            ))}
            {filteredQueues.length < 1 ? (
              <tr>
                <td colSpan={9} className="text-center p-2 text-gray-300">
                  Vacío
                </td>
              </tr>
            ) : (
              ""
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard

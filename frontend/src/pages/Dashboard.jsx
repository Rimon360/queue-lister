import React, { useState, useEffect, useRef } from "react"
import axios from "../../axiosConfig.js"
import { getRandomInRange, wait } from "../util.js"

const Dashboard = () => {
  // Sample data for the queue
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
  const [queues, setQueues] = useState([])
  const [filteredQueues, setFilteredQueues] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  const [isRefresh, setIsRefresh] = useState(Date.now())
  const [refreshTime, setRefreshTime] = useState(0)
  useEffect(() => {
    ;(async () => {
      while (true) {
        let result = await axios.get(BACKEND_URL + "/queue/get")
        let queues = result.data
        setTotalCount(queues.length)
        setFilteredQueues(queues)
        let v = getRandomInRange(5, 10)
        setRefreshTime(v)
        await wait(v)
      }
    })()
  }, [isRefresh])

  const [searchTerm, setSearchTerm] = useState("")
  // Handle search functionality
  useEffect(() => {
    let result = queues.length > 0 ? queues?.filter((queue) => queue._id.toLowerCase().includes(searchTerm.toLowerCase()) || queue.redirectUrl.toLowerCase().includes(searchTerm.toLowerCase())) : []
    setFilteredQueues(result)
  }, [searchTerm])

  // Refresh function (you can replace this with actual API call)

  const [copyText, setCopyText] = useState("Copy")

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

  return (
    <div className="p-6 max-w-fit mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">Queue Dashboard</h1>
        <button onClick={(e) => location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          Refreshing in {refreshTime}s
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

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <h1 className="font-bold p-2">Total count: {totalCount}</h1>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Redirect Url</th> 
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Left</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Time</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">last Updated</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">progress</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added Time</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-left">
            {filteredQueues.map((queue) => (
              <tr key={queue._id} className="hover:bg-gray-50">
                <td className="px-6 py-1 whitespace-nowrap">
                  <div className="flex gap-1 items-center ">
                    {!queue.redirectUrl ? (
                      ""
                    ) : (
                      <button
                        onClick={() => {
                          window.navigator.clipboard.writeText(queue.redirectUrl)
                        }}
                        className="bg-green-900/50 px-4 mb-1 hover:bg-black hover:text-white text-green-400 rounded-md"
                      >
                        {copyText || "Copy"}
                      </button>
                    )}
                    <p className="max-w-[300px] overflow-hidden text-ellipsis bg-blue-900/50 px-2 text-blue-500 rounded-md text-sm">{queue.redirectUrl || "Pending..."}</p>
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
                    Del
                  </button>
                </td>
              </tr>
            ))}
            {filteredQueues.length < 1 ? (
              <tr>
                <td colSpan={9} className="text-center p-2 text-gray-300">
                  Empty
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

import { useState, useEffect, useCallback } from "react"
import axios from "../../axiosConfig.js"
import TabNav from "../components/TabNav.jsx"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
const PER_PAGE = 50
const OUTCOMES = ["All", "Completed", "Expired", "TimedOut", "Abandoned", "Deleted"]

// the stored values stay in english (they are part of the api), only the labels are translated
const OUTCOME_LABEL = {
  All: "Todos",
  Completed: "Completado",
  Expired: "Expirado",
  TimedOut: "Tiempo Agotado",
  Abandoned: "Abandonado",
  Deleted: "Eliminado",
}

const COLUMNS = [
  { key: "redirectUrl", label: "Url de Redirección" },
  { key: "original_queue_url", label: "Url Original de Cola" },
  { key: "outcome", label: "Resultado" },
  { key: "forecastStatus", label: "Estado Final" },
  { key: "waitedMs", label: "Tiempo de Espera" },
  { key: "addedAt", label: "Agregado" },
  { key: "finishedAt", label: "Finalizado" },
]

const OUTCOME_STYLE = {
  Completed: "bg-green-900/50 text-green-400",
  Expired: "bg-red-900/50 text-red-500",
  TimedOut: "bg-orange-900/50 text-orange-400",
  Abandoned: "bg-yellow-900/50 text-yellow-500",
  Deleted: "bg-gray-700/50 text-gray-300",
}

const FIELD = "px-3 py-2 bg-gray-950 text-white border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
const GHOST_BTN = "px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md"

const toDateInput = (d) => d.toISOString().slice(0, 10)

const formatDate = (value) => {
  if (!value) return "-"
  const d = new Date(value)
  return isNaN(d) ? "-" : d.toLocaleString("es-ES")
}

const formatWaited = (ms) => {
  if (ms == null) return "-"
  const total = Math.max(Math.floor(ms / 1000), 0)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h) return `${h}h ${m}min`
  if (m) return `${m}min ${s}s`
  return `${s}s`
}

const History = () => {
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [outcome, setOutcome] = useState("All")
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [sortBy, setSortBy] = useState("finishedAt")
  const [sortDir, setSortDir] = useState("desc")

  // debounce the search box so typing doesn't fire a request per keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await axios.get(BACKEND_URL + "/queue/history", {
        params: { page, limit: PER_PAGE, outcome, search, from, to, sortBy, sortDir },
      })
      setRows(result.data.items || [])
      setTotal(result.data.total || 0)
      setPages(result.data.pages || 1)
      setCounts(result.data.counts || {})
    } catch (error) {
      setRows([])
      setTotal(0)
      setPages(1)
    }
    setLoading(false)
  }, [page, outcome, search, from, to, sortBy, sortDir])

  useEffect(() => {
    load()
  }, [load])

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortDir("desc")
    }
    setPage(1)
  }

  const applyPreset = (days) => {
    const start = new Date()
    start.setDate(start.getDate() - days)
    setFrom(toDateInput(start))
    setTo(toDateInput(new Date()))
    setPage(1)
  }

  const applyOlderThan = (days) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    setFrom("")
    setTo(toDateInput(cutoff))
    setPage(1)
  }

  const hasFilter = outcome !== "All" || !!search || !!from || !!to

  const handlePurge = async () => {
    if (total < 1) return
    const scope = hasFilter
      ? [outcome === "All" ? null : OUTCOME_LABEL[outcome], from || to ? `finalizado ${from || "cualquier fecha"} a ${to || "ahora"}` : null, search ? `que coincide con "${search}"` : null]
          .filter(Boolean)
          .join(", ")
      : "TODO el historial"
    if (!confirm(`Se eliminarán permanentemente ${total} registro${total === 1 ? "" : "s"} — ${scope}.\n\nEsta acción no se puede deshacer. ¿Continuar?`)) return
    try {
      const result = await axios.post(BACKEND_URL + "/queue/history/delete", { outcome, search, from, to, all: !hasFilter })
      if (result.data.success) {
        setPage(1)
        load()
      }
    } catch (error) {
      alert("No se pudo eliminar el historial")
    }
  }

  const resetFilters = () => {
    setOutcome("All")
    setSearchInput("")
    setSearch("")
    setFrom("")
    setTo("")
    setSortBy("finishedAt")
    setSortDir("desc")
    setPage(1)
  }

  return (
    <div className="p-6 max-w-fit mx-auto">
      <TabNav />

      <div className="mb-6 flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-blue-800">Historial de Colas</h1>
        <div className="flex gap-2 text-xs">
          {OUTCOMES.filter((o) => o !== "All").map((o) => (
            <span key={o} className={`px-2 py-1 rounded-md ${OUTCOME_STYLE[o]}`}>
              {OUTCOME_LABEL[o]}: {counts[o] || 0}
            </span>
          ))}
        </div>
      </div>

      {/* filtros */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-4 mb-4 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-400 mb-1">Buscar url</label>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="url de redirección / cola..." className={`${FIELD} w-64`} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-400 mb-1">Resultado</label>
          <select
            value={outcome}
            onChange={(e) => {
              setOutcome(e.target.value)
              setPage(1)
            }}
            className={FIELD}
          >
            {OUTCOMES.map((o) => (
              <option key={o} value={o}>
                {OUTCOME_LABEL[o]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-400 mb-1">Finalizado desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value)
              setPage(1)
            }}
            className={FIELD}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-400 mb-1">Finalizado hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value)
              setPage(1)
            }}
            className={FIELD}
          />
        </div>

        <div className="flex gap-2">
          <button onClick={() => applyPreset(0)} className={GHOST_BTN}>
            Hoy
          </button>
          <button onClick={() => applyPreset(7)} className={GHOST_BTN}>
            7 días
          </button>
          <button onClick={() => applyPreset(30)} className={GHOST_BTN}>
            30 días
          </button>
          <button onClick={() => applyOlderThan(30)} className={GHOST_BTN} title="Todo lo finalizado hace más de 30 días">
            Más de 30 días
          </button>
          <button onClick={resetFilters} className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md">
            Restablecer
          </button>
          <button
            onClick={handlePurge}
            disabled={total < 1}
            title={hasFilter ? "Eliminar todos los registros que coincidan con los filtros actuales" : "Sin filtros — esto eliminaría todo el historial"}
            className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Eliminar {total} mostrados
          </button>
        </div>
      </div>

      {/* tabla */}
      <div className="overflow-x-auto bg-gray-900 border border-gray-700 rounded-lg shadow">
        <h1 className="font-bold p-2 text-gray-200">
          {total} registro{total === 1 ? "" : "s"}
          {loading ? " (cargando...)" : ""}
        </h1>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} onClick={() => toggleSort(col.key)} className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none">
                  {col.label}
                  <span className="ml-1 text-[10px]">{sortBy === col.key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-left">
            {rows.map((row) => (
              <tr key={row._id}>
                <td className="px-2 py-1 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    {row.redirectUrl || row.original_queue_url ? (
                      <button
                        onClick={() => {
                          window.navigator.clipboard.writeText(row.redirectUrl || row.original_queue_url)
                        }}
                        className="bg-green-900/50 px-4 mb-1 hover:bg-black hover:text-white text-green-400 rounded-md"
                      >
                        Copiar
                      </button>
                    ) : (
                      ""
                    )}
                    <p className="max-w-[300px] overflow-hidden text-ellipsis bg-blue-900/50 px-2 text-blue-500 rounded-md text-sm">{row.redirectUrl || "-"}</p>
                  </div>
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <p className="max-w-[240px] overflow-hidden text-ellipsis text-sm text-gray-400">{row.original_queue_url || "-"}</p>
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-md text-xs ${OUTCOME_STYLE[row.outcome] || "bg-gray-700/50 text-gray-300"}`}>{OUTCOME_LABEL[row.outcome] || row.outcome || "-"}</span>
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-green-400 text-sm">{row.forecastStatus || "-"}</td>
                <td className="px-2 py-1 whitespace-nowrap text-yellow-500 text-sm">{formatWaited(row.waitedMs)}</td>
                <td className="px-2 py-1 whitespace-nowrap text-gray-400 text-sm">{formatDate(row.addedAt)}</td>
                <td className="px-2 py-1 whitespace-nowrap text-gray-400 text-sm">{formatDate(row.finishedAt)}</td>
              </tr>
            ))}
            {rows.length < 1 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="text-center p-4 text-gray-500">
                  {loading ? "Cargando..." : "Aún no hay historial"}
                </td>
              </tr>
            ) : (
              ""
            )}
          </tbody>
        </table>
      </div>

      {/* paginación */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-400">
          Página {page} de {pages}
        </span>
        <div className="flex gap-2">
          <button onClick={() => setPage(page - 1)} disabled={page <= 1} className={`${GHOST_BTN} px-4 disabled:opacity-40 disabled:cursor-not-allowed`}>
            Anterior
          </button>
          <button onClick={() => setPage(page + 1)} disabled={page >= pages} className={`${GHOST_BTN} px-4 disabled:opacity-40 disabled:cursor-not-allowed`}>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default History

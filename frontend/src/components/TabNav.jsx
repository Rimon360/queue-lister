import { NavLink } from "react-router-dom"

const tabs = [
  { to: "/", label: "Cola en Vivo", end: true },
  { to: "/history", label: "Historial" },
]

const TabNav = () => {
  return (
    <div className="flex gap-1 border-b border-gray-700 mb-6">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `px-5 py-2 text-sm font-semibold rounded-t-lg border-b-2 -mb-px transition-colors ${
              isActive ? "border-blue-500 text-blue-400 bg-gray-800" : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  )
}

export default TabNav

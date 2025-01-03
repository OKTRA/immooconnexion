import { Home, Users, LineChart, Settings } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function AdminBottomNav() {
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/super-admin/admin" 
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            isActive('/super-admin/admin') ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <LineChart className="h-6 w-6" />
          <span className="text-xs">Statistiques</span>
        </Link>
        
        <Link 
          to="/super-admin/agents" 
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            isActive('/super-admin/agents') ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Users className="h-6 w-6" />
          <span className="text-xs">Agents</span>
        </Link>
        
        <Link 
          to="/super-admin/plans" 
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            isActive('/super-admin/plans') ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs">Plans</span>
        </Link>
      </div>
    </div>
  )
}
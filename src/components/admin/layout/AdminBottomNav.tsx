import { ChartBar, Users, CreditCard } from "lucide-react"
import { useState } from "react"

export function AdminBottomNav() {
  const [activeTab, setActiveTab] = useState("stats")
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // Find the corresponding tab trigger and click it
    const tabTrigger = document.querySelector(`[data-state][value="${tab}"]`) as HTMLButtonElement
    if (tabTrigger) {
      tabTrigger.click()
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-around items-center h-16">
        <button 
          onClick={() => handleTabChange("stats")} 
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            activeTab === "stats" ? "text-primary" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <ChartBar className="h-6 w-6" />
          <span className="text-xs">Statistiques</span>
        </button>
        
        <button 
          onClick={() => handleTabChange("agents")} 
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            activeTab === "agents" ? "text-primary" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <Users className="h-6 w-6" />
          <span className="text-xs">Agents</span>
        </button>
        
        <button 
          onClick={() => handleTabChange("plans")} 
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            activeTab === "plans" ? "text-primary" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <CreditCard className="h-6 w-6" />
          <span className="text-xs">Plans</span>
        </button>
      </div>
    </div>
  )
}
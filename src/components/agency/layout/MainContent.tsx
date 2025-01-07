import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { SubscriptionNotification } from "@/components/subscription/SubscriptionNotification"

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const isMobile = useIsMobile()

  return (
    <main className={cn(
      "flex-1 p-4 md:p-8",
      !isMobile && "ml-[250px]"
    )}>
      <SubscriptionNotification />
      {children}
    </main>
  )
}
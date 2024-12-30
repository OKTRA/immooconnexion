import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import React, { useState, createContext, useContext } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IconMenu2, IconX } from "@tabler/icons-react"

interface Links {
  label: string
  href: string
  icon: React.JSX.Element | React.ReactNode
}

interface SidebarContextProps {
  state: "expanded" | "collapsed"
  setState: React.Dispatch<React.SetStateAction<"expanded" | "collapsed">>
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export const SidebarProvider = ({
  children,
  defaultState = "expanded",
}: {
  children: React.ReactNode
  defaultState?: "expanded" | "collapsed"
}) => {
  const [state, setState] = useState<"expanded" | "collapsed">(defaultState)

  return (
    <SidebarContext.Provider value={{ state, setState }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  )
}

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { state, setState } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-background border-r w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: isExpanded ? "300px" : "60px",
      }}
      onMouseEnter={() => setState("expanded")}
      onMouseLeave={() => setState("collapsed")}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { state, setState } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <>
      <div
        className={cn(
          "h-14 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-background w-full border-b",
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-foreground"
            onClick={() => setState(isExpanded ? "collapsed" : "expanded")}
          />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-background p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-foreground cursor-pointer"
                onClick={() => setState("collapsed")}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export const SidebarLink = ({
  link,
  className,
}: {
  link: Links
  className?: string
}) => {
  const { state } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
    >
      {link.icon}
      <motion.span
        animate={{
          display: isExpanded ? "inline-block" : "none",
          opacity: isExpanded ? 1 : 0,
        }}
        className="text-foreground text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  )
}
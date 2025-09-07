"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type SidebarContext = {
  isMobile: boolean
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ isMobile, isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const SidebarMain = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn("flex-1 flex flex-col min-h-0", className)}
      {...props}
    />
  )
})
SidebarMain.displayName = "SidebarMain"

export const Sidebar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { isMobile, isOpen, setIsOpen } = useSidebar();
    
    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="right" className="p-0 w-[85%] max-w-sm">
                    {children}
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <aside
            ref={ref}
            className={cn("w-80 border-l bg-background/60 backdrop-blur-xl", className)}
            {...props}
        >
            {children}
        </aside>
    )
});
Sidebar.displayName = 'Sidebar';


export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
    const { isOpen, setIsOpen } = useSidebar();
    return (
        <Button
            ref={ref}
            variant="ghost"
            size="icon"
            className={cn(className)}
            onClick={() => setIsOpen(!isOpen)}
            {...props}
        >
            <PanelLeft className="h-5 w-5"/>
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    )
});
SidebarTrigger.displayName = 'SidebarTrigger';

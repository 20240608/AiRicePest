'use client'

import { createContext, useContext, useState } from 'react'

type LayoutContextType = {
  collapsible: 'icon' | 'none' | 'offcanvas' | undefined
  variant: 'inset' | 'sidebar' | 'floating' | undefined
  setCollapsible: (collapsible: 'icon' | 'none' | 'offcanvas' | undefined) => void
  setVariant: (variant: 'inset' | 'sidebar' | 'floating' | undefined) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [collapsible, setCollapsible] = useState<'icon' | 'none' | 'offcanvas' | undefined>('icon')
  const [variant, setVariant] = useState<'inset' | 'sidebar' | 'floating' | undefined>('inset')

  return (
    <LayoutContext.Provider value={{
      collapsible,
      variant,
      setCollapsible,
      setVariant,
    }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
export * from "./Actions"
export * from "./Desktop"
export * from "./Footer"
export * from "./Item"
export * from "./Items"
export * from "./List";
export * from "./Mobile"
export * from "./Toggle"

'use client'

import * as React from 'react'

import { useSidebar } from '@/hooks'
import { cn } from '@/lib/utils'

export interface SidebarProps extends React.ComponentProps<'div'> {}

export function Sidebar({ className, children }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebar()

  return (
    <div
      data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className={cn(className, 'h-full flex-col dark:bg-zinc-950')}
    >
      {children}
    </div>
  )
}
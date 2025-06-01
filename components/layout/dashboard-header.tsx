'use client'

import type React from "react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  action?: React.ReactNode
}

export function DashboardHeader({ heading, text, action }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb--1">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

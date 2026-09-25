import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

export interface NavItem {
  id: string
  label: string
  icon: React.ComponentType
}

export interface SidebarProps {
  appName?: string
  appAbbr?: string
  nav?: NavItem[]
  activeId?: string
  onNavChange?: (id: string) => void
  defaultCollapsed?: boolean
}

const PLACEHOLDER_USER = {
  name: 'Admin ProcoBaja',
  role: 'Administrador',
  initials: 'AP',
}

export function Sidebar({
  appName = 'Proco Baja',
  appAbbr = 'PB',
  nav = [],
  activeId,
  onNavChange,
  defaultCollapsed = false,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  return (
    <aside
      className="flex flex-col h-full shrink-0 transition-all duration-200 bg-navy-900"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 bg-accent">
            <span className="text-white font-bold text-xs tracking-tight">{appAbbr}</span>
          </div>
          {!collapsed && (
            <span className="text-white font-semibold text-sm tracking-wide truncate">
              {appName}
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto text-white/40 hover:text-white/80 transition-colors"
          >
            <ChevronLeftIcon />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 text-white/40 hover:text-white/80 transition-colors"
        >
          <ChevronRightIcon />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {nav.map(({ id, label, icon: Icon }) => {
          const active = activeId === id
          return (
            <button
              key={id}
              onClick={() => onNavChange?.(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors group
                ${active
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
            >
              <span className={`shrink-0 transition-colors ${active ? 'text-accent' : ''}`}>
                <Icon />
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="shrink-0 border-t border-white/10 px-4 py-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 text-xs font-semibold shrink-0 bg-navy-600">
          {PLACEHOLDER_USER.initials}
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white/80 text-xs font-medium truncate">{PLACEHOLDER_USER.name}</p>
            <p className="text-white/30 text-[11px] truncate">{PLACEHOLDER_USER.role}</p>
          </div>
        )}
      </div>
    </aside>
  )
}

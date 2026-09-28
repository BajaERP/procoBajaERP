import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'
import { LogoMark } from './Logo'
import { useAuth } from '../contexts/AuthContext'

export interface NavItem {
  id: string
  label: string
  icon: React.ComponentType
}

export interface SidebarProps {
  appName?: string
  nav?: NavItem[]
  activeId?: string
  onNavChange?: (id: string) => void
  defaultCollapsed?: boolean
}

const ROLE_LABEL: Record<string, string> = {
  gestor: 'Gestor',
  membro: 'Membro',
  financeiro: 'Financeiro',
  lider: 'Líder',
  capitao: 'Capitão',
  orientador: 'Orientador',
}

export function Sidebar({
  appName = 'Proco Baja',
  nav = [],
  activeId,
  onNavChange,
  defaultCollapsed = false,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const { user } = useAuth()

  const name = user?.name ?? 'Visitante'
  const role = user ? ROLE_LABEL[user.role] ?? user.role : 'Sem sessão'

  return (
    <aside
      className="flex flex-col h-full shrink-0 transition-all duration-200 bg-canvas dark:bg-surface-chrome-dark border-l-4 border-red border-r border-hairline"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-hairline shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <LogoMark size={28} className="shrink-0" />
          {!collapsed && (
            <span className="text-ink font-semibold text-sm tracking-wide truncate">
              {appName}
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto text-mute hover:text-ink transition-colors"
            title="Recolher"
          >
            <ChevronLeftIcon />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 text-mute hover:text-ink transition-colors"
          title="Expandir"
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
                  ? 'bg-red/5 text-red'
                  : 'text-body hover:bg-surface-soft hover:text-ink'
                }`}
            >
              <span className={`shrink-0 transition-colors ${active ? 'text-red' : 'text-mute group-hover:text-ink'}`}>
                <Icon />
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1 h-1 rounded-full bg-red" />
              )}
            </button>
          )
        })}
      </nav>

      {/* User footer — boar logo anchors the user row to the team brand.
          The wordmark and the user identity live in the same chip; the
          red square already carries the brand, so we don't need a second
          colored block behind the initials. */}
      <div className="shrink-0 border-t border-hairline px-4 py-3 flex items-center gap-3">
        <LogoMark size={28} className="shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-ink text-xs font-medium truncate">{name}</p>
            <p className="text-mute text-[11px] truncate">{role}</p>
          </div>
        )}
      </div>
    </aside>
  )
}

import { useState, type RefObject } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons'
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
  mobileOpen?: boolean
  onMobileClose?: () => void
  closeButtonRef?: RefObject<HTMLButtonElement | null>
  mobileDialogRef?: RefObject<HTMLElement | null>
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
  mobileOpen = false,
  onMobileClose,
  closeButtonRef,
  mobileDialogRef,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const { user } = useAuth()

  const name = user?.name ?? 'Visitante'
  const role = user
    ? `${ROLE_LABEL[user.role] ?? user.role}${user.id === 'demo' ? ' · demonstração' : ''}`
    : 'Sem sessão'

  const content = (isMobile: boolean, isCollapsed: boolean) => (
    <>
      <div className="flex items-center h-14 px-4 border-b border-hairline shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <LogoMark size={28} className="shrink-0" />
          {!isCollapsed && (
            <span className="text-ink font-semibold text-sm tracking-wide truncate">
              {appName}
            </span>
          )}
        </div>
        {isMobile ? (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onMobileClose}
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md text-mute hover:bg-surface-soft dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            aria-label="Fechar menu de navegação"
          >
            <CloseIcon />
          </button>
        ) : !isCollapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-mute hover:text-ink hover:bg-surface-soft dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            title="Recolher"
            aria-label="Recolher menu"
          >
            <ChevronLeftIcon />
          </button>
        ) : null}
      </div>

      {!isMobile && isCollapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-mute hover:text-ink hover:bg-surface-soft dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
          title="Expandir"
          aria-label="Expandir menu"
        >
          <ChevronRightIcon />
        </button>
      )}

      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto py-4 space-y-1">
        {nav.map(({ id, label, icon: Icon }) => {
          const active = activeId === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                onNavChange?.(id)
                if (isMobile) onMobileClose?.()
              }}
              title={isCollapsed ? label : undefined}
              aria-current={active ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red
                ${active
                  ? 'bg-red/5 text-red dark:text-red-300'
                  : 'text-body hover:bg-surface-soft dark:hover:bg-white/5 hover:text-ink'
                }`}
            >
              <span className={`shrink-0 transition-colors ${active ? 'text-red dark:text-red-300' : 'text-mute group-hover:text-ink'}`}>
                <Icon />
              </span>
              {!isCollapsed && <span className="truncate">{label}</span>}
              {!isCollapsed && active && (
                <span className="ml-auto w-1 h-1 rounded-full bg-red" />
              )}
            </button>
          )
        })}
      </nav>

      <div className="shrink-0 border-t border-hairline px-4 py-3 flex items-center gap-3">
        <LogoMark size={28} className="shrink-0" />
        {!isCollapsed && (
          <div className="overflow-hidden">
            <p className="text-ink text-xs font-medium truncate">{name}</p>
            <p className="text-mute text-[11px] truncate">{role}</p>
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      <aside
        className="hidden md:flex md:flex-col md:h-full md:shrink-0 md:transition-[width] md:duration-200 bg-canvas dark:bg-surface-chrome-dark border-l-4 border-red border-r border-hairline"
        style={{ width: collapsed ? 64 : 240 }}
      >
        {content(false, collapsed)}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" id="mobile-navigation-panel">
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-black/50"
            onClick={onMobileClose}
            aria-label="Fechar menu de navegação"
          />
          <aside
            ref={mobileDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="relative z-10 flex h-full w-[min(18rem,calc(100vw-1.5rem))] flex-col overflow-hidden bg-canvas dark:bg-surface-chrome-dark border-l-4 border-red border-r border-hairline shadow-xl"
          >
            {content(true, false)}
          </aside>
        </div>
      )}
    </>
  )
}

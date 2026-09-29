import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { RefObject } from 'react'
import {
  BellIcon,
  HelpIcon,
  MenuIcon,
  SearchIcon,
  LogoutIcon,
} from './icons'
import { useAuth } from '../contexts/AuthContext'

export interface TopBarBreadcrumb {
  label: string
  href?: string
}

export interface TopBarProps {
  breadcrumbs?: TopBarBreadcrumb[]
  title?: string
  searchPlaceholder?: string
  onOpenMobileMenu?: () => void
  mobileMenuOpen?: boolean
  menuButtonRef?: RefObject<HTMLButtonElement | null>
}

export function TopBar({
  breadcrumbs = [],
  title,
  searchPlaceholder = 'Buscar…',
  onOpenMobileMenu,
  mobileMenuOpen = false,
  menuButtonRef,
}: TopBarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close profile menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!menuOpen) return
    function onMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  function handleLogout() {
    setMenuOpen(false)
    logout()
    navigate('/', { replace: true })
  }

  const initials = user?.initials ?? '?'
  const name = user?.name ?? 'Visitante'
  const ra = user?.ra ?? ''

  return (
    <header className="h-14 border-b border-hairline dark:border-hairline-dark bg-canvas dark:bg-surface-chrome-dark flex items-center px-3 sm:px-4 md:px-6 gap-2 sm:gap-4 shrink-0 transition-colors">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onOpenMobileMenu}
        className="md:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-body dark:text-white hover:bg-surface-soft dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
        aria-label="Abrir menu de navegação"
        aria-controls={mobileMenuOpen ? 'mobile-navigation-panel' : undefined}
        aria-expanded={mobileMenuOpen}
      >
        <MenuIcon />
      </button>
      {/* Title area */}
      <div className="flex-1 min-w-0">
        {breadcrumbs.length > 0 && (
          <nav className="text-xs text-mute flex items-center gap-1.5 truncate">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-body transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {title && (
          <h1 className="text-sm font-semibold text-ink dark:text-white truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-mute w-3.5 h-3.5" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-60 pl-8 pr-3 py-1.5 rounded-md border border-hairline dark:border-hairline-dark bg-surface-soft dark:bg-surface-card-dark text-sm text-ink dark:text-white placeholder-ash focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          title="Notificações"
          aria-label="Notificações, 3 não lidas"
          className="relative p-2 rounded-md text-mute hover:bg-surface-soft dark:hover:bg-white/5 transition-colors"
        >
          <BellIcon />
          <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-1 flex items-center justify-center bg-red rounded-full text-[9px] font-bold text-white">
            3
          </span>
        </button>

        <button
          title="Ajuda"
          aria-label="Ajuda"
          className="p-2 rounded-md text-mute hover:bg-surface-soft dark:hover:bg-white/5 transition-colors"
        >
          <HelpIcon />
        </button>

        {/* Profile menu */}
        <div className="relative ml-1" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            title={name}
            aria-label="Abrir menu da conta"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="w-7 h-7 rounded-full bg-red flex items-center justify-center text-white text-xs font-semibold hover:opacity-80 transition-opacity"
          >
            {initials}
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-1rem)] rounded-lg border border-hairline dark:border-hairline-dark bg-canvas dark:bg-surface-chrome-dark overflow-hidden z-50"
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-hairline-soft dark:border-hairline-dark">
                <p className="text-sm font-semibold text-ink dark:text-white truncate">
                  {name}
                </p>
                {ra && (
                  <p className="text-xs text-mute truncate">
                    RA {ra}
                  </p>
                )}
              </div>

              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/app/configuracoes')
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-sm text-body dark:text-white hover:bg-surface-soft dark:hover:bg-white/5 transition-colors border-t border-hairline-soft dark:border-hairline-dark"
              >
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-surface-card dark:bg-white/10 font-mono">⚙</span>
                <span>Configurações</span>
              </button>

              <button
                role="menuitem"
                onClick={handleLogout}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-sm text-red dark:text-red-300 hover:bg-red/5 transition-colors border-t border-hairline-soft dark:border-hairline-dark"
              >
                <LogoutIcon />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

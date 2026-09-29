import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { RefObject } from 'react'
import { GearIcon, MenuIcon, LogoutIcon } from './icons'
import { useAuth } from '../contexts/AuthContext'

export interface TopBarBreadcrumb {
  label: string
  href?: string
}

export interface TopBarProps {
  breadcrumbs?: TopBarBreadcrumb[]
  onOpenMobileMenu?: () => void
  mobileMenuOpen?: boolean
  menuButtonRef?: RefObject<HTMLButtonElement | null>
}

export function TopBar({
  breadcrumbs = [],
  onOpenMobileMenu,
  mobileMenuOpen = false,
  menuButtonRef,
}: TopBarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)

  // Close profile menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!menuOpen) return
    function onMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setMenuOpen(false)
        accountButtonRef.current?.focus()
      }
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
          <nav aria-label="Caminho de navegação" className="text-xs text-mute flex items-center gap-1.5 truncate">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-body transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span aria-current={i === breadcrumbs.length - 1 ? 'page' : undefined}>
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center">
        {/* Profile menu */}
        <div className="relative ml-1" ref={menuRef}>
          <button
            ref={accountButtonRef}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            title={name}
            aria-label="Abrir menu da conta"
            aria-controls={menuOpen ? 'account-menu' : undefined}
            aria-expanded={menuOpen}
            className="inline-flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red text-white text-xs font-semibold">
              {initials}
            </span>
          </button>

          {menuOpen && (
            <div
              id="account-menu"
              className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-1rem)] rounded-lg border border-hairline dark:border-hairline-dark bg-canvas dark:bg-surface-chrome-dark overflow-hidden z-50 shadow-lg"
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
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/app/configuracoes')
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-sm text-body dark:text-white hover:bg-surface-soft dark:hover:bg-white/5 transition-colors border-t border-hairline-soft dark:border-hairline-dark"
              >
                <span className="text-mute" aria-hidden="true"><GearIcon /></span>
                <span>Configurações</span>
              </button>

              <button
                type="button"
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

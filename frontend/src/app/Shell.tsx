import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import {
  GridIcon,
  ShieldIcon,
  UsersIcon,
  TaskIcon,
  WalletIcon,
  TrophyIcon,
  BookIcon,
  GearIcon,
} from '../components/icons'

// Ordem reflete importância para gestores — Gestão fica no topo porque
// é a landing default após login e crescerá em mais responsabilidades.
const NAV = [
  { id: 'gestao', label: 'Gestão', to: '/app/gestao', icon: 'Shield' },
  { id: 'dashboard', label: 'Dashboard', to: '/app/dashboard', icon: 'Grid' },
  { id: 'equipe', label: 'Equipe', to: '/app/equipe', icon: 'Users' },
  { id: 'atividades', label: 'Atividades', to: '/app/atividades', icon: 'Task' },
  { id: 'financeiro', label: 'Financeiro', to: '/app/financeiro', icon: 'Wallet' },
  { id: 'competicoes', label: 'Competições', to: '/app/competicoes', icon: 'Trophy' },
  { id: 'documentacao', label: 'Documentação', to: '/app/documentacao', icon: 'Book' },
  { id: 'configuracoes', label: 'Configurações', to: '/app/configuracoes', icon: 'Gear' },
] as const

const ICON_MAP: Record<string, React.ComponentType> = {
  Shield: ShieldIcon,
  Grid: GridIcon,
  Users: UsersIcon,
  Task: TaskIcon,
  Wallet: WalletIcon,
  Trophy: TrophyIcon,
  Book: BookIcon,
  Gear: GearIcon,
}

const ROUTE_LABELS: Record<string, string> = {
  gestao: 'Gestão',
  dashboard: 'Dashboard',
  equipe: 'Equipe',
  atividades: 'Atividades',
  financeiro: 'Financeiro',
  competicoes: 'Competições',
  documentacao: 'Documentação',
  configuracoes: 'Configurações',
}

export function Shell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const mobileDialogRef = useRef<HTMLElement>(null)

  const segment = location.pathname.replace('/app/', '')

  const pageLabel = ROUTE_LABELS[segment] ?? segment

  const navItems = useMemo(
    () =>
      NAV.map(({ id, label, icon }) => ({
        id,
        label,
        icon: ICON_MAP[icon],
      })),
    []
  )

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false)
    requestAnimationFrame(() => menuButtonRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!mobileNavOpen) return
    closeButtonRef.current?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMobileNav()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = mobileDialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileNavOpen, closeMobileNav])

  function handleNavChange(id: string) {
    const item = NAV.find((n) => n.id === id)
    if (item) {
      navigate(item.to)
    }
  }

  return (
    <div className="flex h-dvh min-h-0 bg-surface-soft dark:bg-surface-dark font-sans overflow-hidden transition-colors">
      <Sidebar
        appName="Proco Baja"
        nav={navItems}
        activeId={segment}
        onNavChange={handleNavChange}
        mobileOpen={mobileNavOpen}
        onMobileClose={closeMobileNav}
        closeButtonRef={closeButtonRef}
        mobileDialogRef={mobileDialogRef}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden" inert={mobileNavOpen || undefined}>
        <TopBar
          breadcrumbs={[{ label: 'Proco Baja' }, { label: pageLabel }]}
          onOpenMobileMenu={() => setMobileNavOpen(true)}
          mobileMenuOpen={mobileNavOpen}
          menuButtonRef={menuButtonRef}
        />

        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden bg-surface-soft dark:bg-surface-dark transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

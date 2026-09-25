import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import {
  GridIcon,
  UsersIcon,
  TaskIcon,
  WalletIcon,
  TrophyIcon,
  BookIcon,
  GearIcon,
} from '../components/icons'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', to: '/app/dashboard', icon: 'Grid' },
  { id: 'equipe', label: 'Equipe', to: '/app/equipe', icon: 'Users' },
  { id: 'atividades', label: 'Atividades', to: '/app/atividades', icon: 'Task' },
  { id: 'financeiro', label: 'Financeiro', to: '/app/financeiro', icon: 'Wallet' },
  { id: 'competicoes', label: 'Competições', to: '/app/competicoes', icon: 'Trophy' },
  { id: 'documentacao', label: 'Documentação', to: '/app/documentacao', icon: 'Book' },
  { id: 'configuracoes', label: 'Configurações', to: '/app/configuracoes', icon: 'Gear' },
] as const

const ICON_MAP: Record<string, React.ComponentType> = {
  Grid: GridIcon,
  Users: UsersIcon,
  Task: TaskIcon,
  Wallet: WalletIcon,
  Trophy: TrophyIcon,
  Book: BookIcon,
  Gear: GearIcon,
}

const ROUTE_LABELS: Record<string, string> = {
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

  function handleNavChange(id: string) {
    const item = NAV.find((n) => n.id === id)
    if (item) {
      navigate(item.to)
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar
        appName="Proco Baja"
        appAbbr="PB"
        nav={navItems}
        activeId={segment}
        onNavChange={handleNavChange}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          breadcrumbs={[{ label: 'Proco Baja' }, { label: pageLabel }]}
          title={pageLabel}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

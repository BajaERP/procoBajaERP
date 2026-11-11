import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { useAuth } from '../contexts/AuthContext'
import {
	LayoutGrid as GridIcon,
	UsersRound as PeopleIcon,
	Folder as FolderIcon,
	Users as UsersIcon,
	ListTodo as TaskIcon,
	Wallet as WalletIcon,
	Trophy as TrophyIcon,
	BookText as BookIcon,
	Settings as GearIcon,
} from 'lucide-react'

const NAV = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		to: '/app/dashboard',
		icon: GridIcon,
		group: 'VISÃO GERAL',
	},
	{
		id: 'equipe',
		label: 'Equipe e Subsistemas',
		to: '/app/equipe',
		icon: UsersIcon,
		group: 'GESTÃO DO PROJETO',
	},
	{
		id: 'atividades',
		label: 'Atividades e Sprints',
		to: '/app/atividades',
		icon: TaskIcon,
		group: 'GESTÃO DO PROJETO',
	},
	{
		id: 'pessoas',
		label: 'Pessoas e Participação',
		to: '/app/pessoas',
		icon: PeopleIcon,
		group: 'GESTÃO DO PROJETO',
	},
	{
		id: 'competicoes',
		label: 'Competições e Eventos',
		to: '/app/competicoes',
		icon: TrophyIcon,
		group: 'GESTÃO DO PROJETO',
	},
	{
		id: 'financeiro',
		label: 'Gestão Financeira',
		to: '/app/financeiro',
		icon: WalletIcon,
		group: 'ADMINISTRAÇÃO E REGISTROS',
	},
	{
		id: 'documentacao',
		label: 'Documentação',
		to: '/app/documentacao',
		icon: FolderIcon,
		group: 'ADMINISTRAÇÃO E REGISTROS',
	},
	{
		id: 'governanca',
		label: 'Governança',
		to: '/app/governanca',
		icon: BookIcon,
		group: 'ADMINISTRAÇÃO E REGISTROS',
	},
	{
		id: 'configuracoes',
		label: 'Configurações',
		to: '/app/configuracoes',
		icon: GearIcon,
		group: '',
	},
] as const

const ROUTE_LABELS: Record<string, string> = Object.fromEntries(
	NAV.map(({ id, label }) => [id, label]),
)
ROUTE_LABELS.gestao = 'Gestão'

export function Shell() {
	const { demoNotice } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const [mobileNavOpen, setMobileNavOpen] = useState(false)
	const menuButtonRef = useRef<HTMLButtonElement>(null)
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const mobileDialogRef = useRef<HTMLElement>(null)

	const [segment, subsegment] = location.pathname
		.replace('/app/', '')
		.split('/')

	const pageLabel = ROUTE_LABELS[segment] ?? segment

	const childLabel =
		segment === 'equipe'
			? (
					{
						integrantes: 'Integrantes',
						subsistemas: 'Subsistemas',
						cargos: 'Cargos e permissões',
					} as Record<string, string>
				)[subsegment]
			: undefined

	const closeMobileNav = useCallback(() => {
		setMobileNavOpen(false)
		requestAnimationFrame(() => menuButtonRef.current?.focus())
	}, [])

	useEffect(() => {
		const desktop = window.matchMedia('(min-width: 768px)')
		const onBreakpointChange = (event: MediaQueryListEvent) => {
			if (event.matches) setMobileNavOpen(false)
		}
		desktop.addEventListener('change', onBreakpointChange)
		if (desktop.matches) setMobileNavOpen(false)
		return () => desktop.removeEventListener('change', onBreakpointChange)
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
			const focusable =
				mobileDialogRef.current?.querySelectorAll<HTMLElement>(
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
		if (item) navigate(item.to)
	}

	return (
		<div className="flex h-dvh min-h-0 bg-surface-soft dark:bg-surface-dark font-sans overflow-hidden transition-colors">
			<Sidebar
				appName="ProcoBaja ERP"
				nav={NAV}
				activeId={segment}
				onNavChange={handleNavChange}
				mobileOpen={mobileNavOpen}
				onMobileClose={closeMobileNav}
				closeButtonRef={closeButtonRef}
				mobileDialogRef={mobileDialogRef}
			/>

			<div
				className="flex flex-col flex-1 min-w-0 overflow-hidden"
				inert={mobileNavOpen || undefined}
			>
				<TopBar
					breadcrumbs={[
						{ label: 'ProcoBaja ERP' },
						{
							label: pageLabel,
							...(childLabel ? { href: `#/app/${segment}` } : {}),
						},
						...(childLabel ? [{ label: childLabel }] : []),
					]}
					onOpenMobileMenu={() => setMobileNavOpen(true)}
					mobileMenuOpen={mobileNavOpen}
					menuButtonRef={menuButtonRef}
				/>

				<main className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden bg-surface-soft dark:bg-surface-dark transition-colors">
					{import.meta.env.DEV && demoNotice && (
						<p
							role="status"
							className="border-b border-state-warning bg-state-warning-bg px-4 py-2 text-sm text-state-warning"
						>
							{demoNotice}
						</p>
					)}
					<Outlet />
				</main>
			</div>
		</div>
	)
}

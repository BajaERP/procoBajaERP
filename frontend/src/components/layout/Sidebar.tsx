import { useState, type RefObject } from 'react'
import {
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	X as CloseIcon,
} from 'lucide-react'
import { LogoMark } from '../shared/Logo'
import { ROLE_LABELS, useAuth } from '../../contexts/AuthContext'

export interface NavItem {
	id: string
	label: string
	icon: React.ComponentType
	group: string
}

export interface SidebarProps {
	appName?: string
	nav?: readonly NavItem[]
	activeId?: string
	onNavChange?: (id: string) => void
	defaultCollapsed?: boolean
	mobileOpen?: boolean
	onMobileClose?: () => void
	closeButtonRef?: RefObject<HTMLButtonElement | null>
	mobileDialogRef?: RefObject<HTMLElement | null>
}

export function Sidebar({
	appName = 'ProcoBaja ERP',
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
		? `${ROLE_LABELS[user.role]}${user.id === 'demo' ? ' · demonstração' : ''}`
		: 'Sem sessão'

	const content = (isMobile: boolean, isCollapsed: boolean) => (
		<>
			<div className="flex h-14 shrink-0 items-center border-b border-hairline pl-4 pr-2">
				<div className="flex items-center gap-2.5 min-w-0">
					<LogoMark size={28} className="shrink-0" />
					{!isCollapsed && (
						<span className="text-ink font-semibold text-sm truncate">
							{appName}
						</span>
					)}
				</div>
				{isMobile ? (
					<button
						ref={closeButtonRef}
						type="button"
						onClick={onMobileClose}
						className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-mute hover:bg-surface-soft dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
						aria-label="Fechar menu de navegação"
					>
						<CloseIcon size={18} aria-hidden="true" />
					</button>
				) : !isCollapsed ? (
					<button
						type="button"
						onClick={() => setCollapsed(true)}
						className="ml-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-mute hover:text-ink hover:bg-surface-soft dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
						title="Recolher"
						aria-label="Recolher menu"
					>
						<ChevronLeftIcon size={16} aria-hidden="true" />
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
					<ChevronRightIcon size={16} aria-hidden="true" />
				</button>
			)}

			<nav
				aria-label="Navegação principal"
				className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-0.5 ${isCollapsed ? 'px-1' : 'px-2'}`}
			>
				{nav.map(({ id, label, icon: Icon, group }, index) => {
					const active = activeId === id
					return (
						<div key={id}>
							{!isCollapsed &&
								group &&
								(index === 0 ||
									nav[index - 1].group !== group) && (
									<p className="px-0.5 pt-1 pb-1 text-[9px] font-bold text-mute">
										{group}
									</p>
								)}
							<button
								type="button"
								onClick={() => {
									onNavChange?.(id)
									if (isMobile) onMobileClose?.()
								}}
								title={isCollapsed ? label : undefined}
								aria-label={isCollapsed ? label : undefined}
								aria-current={active ? 'page' : undefined}
								className={`w-full flex items-center gap-3 rounded-md py-2 text-xs font-medium transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                ${
					active
						? 'bg-selected text-link'
						: 'bg-canvas dark:bg-surface-chrome-dark text-body hover:bg-surface-soft dark:hover:bg-white/5 hover:text-ink'
				}`}
							>
								<span
									aria-hidden="true"
									className={`shrink-0 [&_svg]:h-4 [&_svg]:w-4 transition-colors ${active ? 'text-link' : 'text-mute group-hover:text-ink'}`}
								>
									<Icon />
								</span>
								{!isCollapsed && (
									<span className="min-w-0 flex-1 truncate text-left">
										{label}
									</span>
								)}
							</button>
						</div>
					)
				})}
			</nav>

			<div
				className={`shrink-0 border-t border-hairline py-3 flex items-center gap-3 ${isCollapsed ? 'justify-center px-1' : 'px-4'}`}
			>
				<LogoMark
					size={22}
					variant="transparent"
					className="shrink-0 invert dark:invert-0"
				/>
				{!isCollapsed && (
					<div className="overflow-hidden">
						<p className="text-ink text-[11px] font-semibold truncate">
							{name}
						</p>
						<p className="text-mute text-[10px] truncate">{role}</p>
					</div>
				)}
			</div>
		</>
	)

	return (
		<>
			<aside
				className="hidden md:flex md:flex-col md:h-full md:shrink-0 md:transition-[width] md:duration-200 bg-canvas dark:bg-surface-card-dark border-l-4 border-l-red border-r border-r-hairline"
				style={{ width: collapsed ? 64 : 240 }}
			>
				{content(false, collapsed)}
			</aside>

			{mobileOpen && (
				<div
					className="fixed inset-0 z-50 md:hidden"
					id="mobile-navigation-panel"
				>
					<button
						type="button"
						className="absolute inset-0 h-full w-full bg-black/50"
						onClick={onMobileClose}
						aria-hidden="true"
						tabIndex={-1}
					/>
					<aside
						ref={mobileDialogRef}
						role="dialog"
						aria-modal="true"
						aria-label="Menu de navegação"
						className="relative z-10 flex h-full w-[min(15rem,calc(100vw-1.5rem))] flex-col overflow-hidden bg-canvas dark:bg-surface-card-dark border-l-4 border-l-red border-r border-r-hairline shadow-xl"
					>
						{content(true, false)}
					</aside>
				</div>
			)}
		</>
	)
}

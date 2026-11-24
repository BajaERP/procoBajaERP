import { useEffect, useRef, useState } from 'react'
import { ChevronDown, RotateCcw, Wrench } from 'lucide-react'
import { DEMO_PERSPECTIVE_LABELS, useAuth } from '../../contexts/AuthContext'
import { identitiesForPerspective } from '../../services/demoSession'
import type { DemoPerspective } from '../../services/equipeTypes'

export function DevProfileSwitcher() {
	const {
		user,
		demoIdentities,
		demoPerspective,
		demoNotice,
		setDemoPerspective,
		setDemoIdentity,
		restoreDemo,
	} = useAuth()
	const [open, setOpen] = useState(false)
	const panelRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const choices = identitiesForPerspective(demoIdentities, demoPerspective)

	useEffect(() => {
		if (!open) return
		function onPointerDown(event: MouseEvent) {
			if (!panelRef.current?.contains(event.target as Node))
				setOpen(false)
		}
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setOpen(false)
				buttonRef.current?.focus()
			}
		}
		document.addEventListener('mousedown', onPointerDown)
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('mousedown', onPointerDown)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [open])

	if (!import.meta.env.DEV || !user?.isDemo) return null

	const roleLabel = user.financial
		? 'Gestor Financeiro'
		: DEMO_PERSPECTIVE_LABELS[user.role]

	async function confirmRestore() {
		if (
			!window.confirm(
				'Restaurar todos os dados demonstrativos e voltar ao Gestor padrão?',
			)
		)
			return
		await restoreDemo()
		setOpen(false)
		buttonRef.current?.focus()
	}

	return (
		<div ref={panelRef} className="relative">
			<button
				ref={buttonRef}
				type="button"
				onClick={() => setOpen((current) => !current)}
				aria-label={`Ferramentas de desenvolvimento, ${user.name}, ${roleLabel}`}
				aria-expanded={open}
				aria-controls={open ? 'dev-profile-panel' : undefined}
				className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-xs font-semibold text-mute hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
			>
				<Wrench size={16} aria-hidden="true" />
				<span>Dev</span>
				<span className="hidden max-w-28 truncate lg:inline">
					· {roleLabel}
				</span>
			</button>
			{open && (
				<div
					id="dev-profile-panel"
					className="fixed right-2 top-14 z-50 max-h-[calc(100dvh-4rem)] w-72 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-lg border border-hairline bg-surface-raised p-4 shadow-lg sm:absolute sm:right-0 sm:top-full sm:mt-2"
				>
					<p className="text-sm font-semibold text-ink">
						Ferramentas de desenvolvimento
					</p>
					<p className="mt-1 text-xs text-mute">
						Identidades fictícias; nenhuma permissão real é
						alterada.
					</p>
					<label
						htmlFor="dev-profile"
						className="mt-4 block text-xs font-semibold text-body"
					>
						Perfil de demonstração
					</label>
					<div className="relative mt-2">
						<select
							id="dev-profile"
							value={demoPerspective}
							onChange={(event) =>
								setDemoPerspective(
									event.target.value as DemoPerspective,
								)
							}
							className="w-full min-h-11 cursor-pointer appearance-none rounded-md border border-hairline bg-canvas py-2.5 pl-3 pr-10 text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red dark:[color-scheme:dark]"
						>
							{Object.entries(DEMO_PERSPECTIVE_LABELS).map(
								([role, label]) => (
									<option key={role} value={role}>
										{label}
									</option>
								),
							)}
						</select>
						<ChevronDown
							size={18}
							aria-hidden="true"
							className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-icon-muted"
						/>
					</div>
					<label
						htmlFor="dev-user"
						className="mt-4 block text-xs font-semibold text-body"
					>
						Pessoa ativa
					</label>
					<div className="relative mt-2">
						<select
							id="dev-user"
							value={
								choices.some((choice) => choice.id === user.id)
									? user.id
									: ''
							}
							onChange={(event) =>
								setDemoIdentity(event.target.value)
							}
							className="w-full min-h-11 cursor-pointer appearance-none rounded-md border border-hairline bg-canvas py-2.5 pl-3 pr-10 text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red dark:[color-scheme:dark]"
						>
							{!choices.length && (
								<option value="">
									Nenhuma pessoa disponível
								</option>
							)}
							{choices.map((choice) => (
								<option key={choice.id} value={choice.id}>
									{choice.name}
									{choice.passwordChangePending
										? ' · troca pendente'
										: ''}
								</option>
							))}
						</select>
						<ChevronDown
							size={18}
							aria-hidden="true"
							className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-icon-muted"
						/>
					</div>
					<p className="mt-3 text-xs text-mute">
						{user.subsistema ?? 'Sem subsistema'}
						{user.passwordChangePending
							? ' · troca de senha pendente'
							: ''}
					</p>
					{demoNotice && (
						<p
							role="status"
							className="mt-3 text-xs text-state-warning"
						>
							{demoNotice}
						</p>
					)}
					<button
						type="button"
						onClick={() => void confirmRestore()}
						className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-hairline bg-canvas px-3 text-xs font-semibold text-body hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
					>
						<RotateCcw size={16} aria-hidden="true" /> Restaurar
						dados demonstrativos
					</button>
				</div>
			)}
		</div>
	)
}

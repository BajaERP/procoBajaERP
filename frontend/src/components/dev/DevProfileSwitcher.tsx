import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Wrench } from 'lucide-react'
import { ROLE_LABELS, useAuth, type UserRole } from '../../contexts/AuthContext'

export function DevProfileSwitcher() {
	const { user, setDemoRole } = useAuth()
	const [open, setOpen] = useState(false)
	const panelRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

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

	if (!user || user.id !== 'demo') return null

	return (
		<div ref={panelRef} className="relative">
			<button
				ref={buttonRef}
				type="button"
				onClick={() => setOpen((current) => !current)}
				aria-label={`Ferramentas de desenvolvimento, perfil ${ROLE_LABELS[user.role]}`}
				aria-expanded={open}
				aria-controls={open ? 'dev-profile-panel' : undefined}
				className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-xs font-semibold text-mute hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
			>
				<Wrench size={16} aria-hidden="true" />
				<span>Dev</span>
				<span className="max-w-16 truncate sm:max-w-none">
					· {ROLE_LABELS[user.role]}
				</span>
			</button>
			{open && (
				<div
					id="dev-profile-panel"
					className="fixed right-2 top-14 z-50 w-72 max-w-[calc(100vw-1rem)] rounded-lg border border-hairline bg-surface-raised p-4 shadow-lg sm:absolute sm:right-0 sm:top-full sm:mt-2"
				>
					<p className="text-sm font-semibold text-ink">
						Ferramentas de desenvolvimento
					</p>
					<p className="mt-1 text-xs text-mute">
						Altere apenas o perfil da sessão de demonstração.
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
							aria-label="Perfil de demonstração"
							value={user.role}
							onChange={(event) =>
								setDemoRole(event.target.value as UserRole)
							}
							className="w-full cursor-pointer appearance-none rounded-md border border-hairline bg-canvas py-2.5 pr-10 pl-3 text-sm font-medium text-ink transition-colors hover:border-ash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised dark:[color-scheme:dark]"
						>
							{(
								Object.entries(ROLE_LABELS) as [
									UserRole,
									string,
								][]
							).map(([role, label]) => (
								<option key={role} value={role}>
									{label}
								</option>
							))}
						</select>
						<ChevronDown
							size={18}
							aria-hidden="true"
							className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-icon-muted"
						/>
					</div>
					<p className="mt-3 text-xs text-mute">
						A troca não altera permissões reais.
					</p>
				</div>
			)}
		</div>
	)
}

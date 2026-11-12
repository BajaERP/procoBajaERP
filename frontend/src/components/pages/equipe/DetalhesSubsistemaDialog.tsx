import { useEffect, useRef } from 'react'
import { Crown, Pencil, Users, X } from 'lucide-react'
import type { AuthUser } from '../../../contexts/AuthContext'
import type { SubsistemaConsultavel } from '../../../services/equipeTypes'
import { podeAdministrarPerfil } from '../../../services/cadastroIntegrante'
import { labelPerfilSubsistema } from '../../../services/subsistemas'

export function DetalhesSubsistemaDialog({
	subsistema,
	podeAdministrar,
	atorId,
	atorPerfil,
	onEdit,
	onChangeLeader,
	onTransfer,
	onDeactivate,
	onClose,
}: {
	subsistema: SubsistemaConsultavel
	podeAdministrar: boolean
	atorId: string
	atorPerfil: AuthUser['role']
	onEdit: () => void
	onChangeLeader: () => void
	onTransfer: (integranteId: string) => void
	onDeactivate: () => void
	onClose: () => void
}) {
	const dialogRef = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		const dialog = dialogRef.current!
		const previousFocus = document.activeElement
		const previousOverflow = document.body.style.overflow
		dialog.showModal()
		document.body.style.overflow = 'hidden'
		return () => {
			dialog.close()
			document.body.style.overflow = previousOverflow
			if (
				previousFocus instanceof HTMLElement &&
				previousFocus.isConnected
			)
				previousFocus.focus()
		}
	}, [])

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby="detalhes-subsistema-titulo"
			aria-describedby="detalhes-subsistema-descricao"
			onCancel={(event) => {
				event.preventDefault()
				onClose()
			}}
			onClick={(event) => {
				if (event.target === event.currentTarget) onClose()
			}}
			className="fixed inset-y-0 right-0 m-0 ml-auto flex h-dvh max-h-dvh w-full max-w-none flex-col overflow-hidden border-l border-hairline bg-surface-card p-0 text-ink backdrop:bg-overlay md:w-[555px] md:max-w-[calc(100vw-1rem)]"
		>
			<header className="flex shrink-0 items-start justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-7">
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<h2
							id="detalhes-subsistema-titulo"
							className="break-words text-xl font-bold text-ink"
						>
							{subsistema.nome}
						</h2>
						<span
							className={`rounded-full px-2.5 py-1 text-xs font-semibold ${subsistema.ativo ? 'bg-state-success-bg text-state-success' : 'bg-state-warning-bg text-state-warning'}`}
						>
							{subsistema.ativo ? 'Ativo' : 'Inativo'}
						</span>
					</div>
					<p
						id="detalhes-subsistema-descricao"
						className="mt-1 text-sm text-mute"
					>
						Detalhes e composição do subsistema.
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-mute hover:bg-surface-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-red"
					aria-label="Fechar detalhes"
				>
					<X size={19} aria-hidden="true" />
				</button>
			</header>
			<div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
				{subsistema.descricao && (
					<section>
						<h3 className="text-sm font-semibold text-body">
							Descrição
						</h3>
						<p className="mt-1 whitespace-pre-wrap text-sm text-ink">
							{subsistema.descricao}
						</p>
					</section>
				)}
				<section>
					<h3 className="text-sm font-semibold text-body">Líder</h3>
					<p className="mt-1 text-sm text-ink">
						{subsistema.lider?.nome ?? 'Sem Líder'}
					</p>
				</section>
				{subsistema.integrantes && (
					<section aria-labelledby="detalhes-subsistema-composicao">
						<h3
							id="detalhes-subsistema-composicao"
							className="flex items-center gap-2 text-sm font-semibold text-body"
						>
							<Users size={16} aria-hidden="true" /> Composição (
							{subsistema.integrantes.length})
						</h3>
						{subsistema.integrantes.length ? (
							<ul className="mt-2 divide-y divide-hairline rounded-md border border-hairline">
								{subsistema.integrantes.map((integrante) => (
									<li
										key={integrante.id}
										className="flex min-h-12 flex-wrap items-center justify-between gap-2 px-3 py-2"
									>
										<span className="min-w-0 flex-1 break-words text-sm text-ink">
											{integrante.nome}
										</span>
										<span className="text-right text-xs text-mute">
											{labelPerfilSubsistema(
												integrante.perfil,
												integrante.financeiro,
											)}
											{!integrante.ativo && ' · Inativo'}
										</span>
										{podeAdministrar &&
											integrante.id !== atorId &&
											podeAdministrarPerfil(
												atorPerfil,
												integrante.perfil,
											) && (
												<button
													type="button"
													onClick={() =>
														onTransfer(
															integrante.id,
														)
													}
													className="min-h-9 rounded-md border border-hairline bg-canvas px-3 text-xs font-semibold text-ink hover:bg-surface-soft"
												>
													Transferir
												</button>
											)}
									</li>
								))}
							</ul>
						) : (
							<p className="mt-2 text-sm text-mute">
								Nenhum integrante ativo na composição.
							</p>
						)}
					</section>
				)}
			</div>
			<footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-hairline bg-surface-card px-5 py-4 sm:px-7">
				<button
					type="button"
					onClick={onClose}
					className="min-h-11 rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft"
				>
					Fechar
				</button>
				{podeAdministrar && (
					<>
						{subsistema.ativo && (
							<button
								type="button"
								onClick={onDeactivate}
								className="inline-flex min-h-11 items-center gap-2 rounded-md border border-state-error bg-canvas px-4 text-sm font-semibold text-state-error hover:bg-state-error-bg"
							>
								Desativar subsistema
							</button>
						)}
						<button
							type="button"
							onClick={onEdit}
							className="inline-flex min-h-11 items-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed"
						>
							<Pencil size={15} aria-hidden="true" /> Editar
						</button>
						<button
							type="button"
							onClick={onChangeLeader}
							className="inline-flex min-h-11 items-center gap-2 rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft"
						>
							<Crown size={15} aria-hidden="true" />
							{subsistema.lider
								? 'Substituir Líder'
								: 'Definir Líder'}
						</button>
					</>
				)}
			</footer>
		</dialog>
	)
}

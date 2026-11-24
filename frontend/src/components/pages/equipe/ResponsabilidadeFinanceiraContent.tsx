import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Building2, RotateCcw, UserRound, X } from 'lucide-react'
import type { AuthUser } from '../../../contexts/AuthContext'
import { equipeService } from '../../../services/equipe'
import type { ConsultaResponsabilidadeFinanceira } from '../../../services/equipeTypes'
import { LogoMark } from '../../shared/Logo'

type LoadState =
	| { status: 'loading' }
	| { status: 'error'; message: string }
	| { status: 'ready'; data: ConsultaResponsabilidadeFinanceira }

export function ResponsabilidadeFinanceiraContent({
	user,
	revision,
	onClose,
}: {
	user: AuthUser
	revision: number
	onClose: () => void
}) {
	const panelRef = useRef<HTMLDialogElement>(null)
	const [state, setState] = useState<LoadState>({ status: 'loading' })
	const [attempt, setAttempt] = useState(0)

	useEffect(() => {
		const dialog = panelRef.current!
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

	useEffect(() => {
		let active = true
		setState({ status: 'loading' })
		equipeService
			.consultarResponsabilidadeFinanceira({
				id: user.id,
				perfil: user.role,
				subsistemaId: user.subsistemaId,
			})
			.then((data) => {
				if (active) setState({ status: 'ready', data })
			})
			.catch((error: unknown) => {
				if (active)
					setState({
						status: 'error',
						message:
							error instanceof Error
								? error.message
								: 'Não foi possível consultar o subsistema Financeiro.',
					})
			})
		return () => {
			active = false
		}
	}, [attempt, revision, user.id, user.role, user.subsistemaId])

	return (
		<dialog
			ref={panelRef}
			aria-labelledby="responsabilidade-heading"
			onCancel={(event) => {
				event.preventDefault()
				onClose()
			}}
			onClick={(event) => {
				if (event.target === event.currentTarget) onClose()
			}}
			className="fixed inset-0 m-0 flex h-dvh max-h-dvh w-full max-w-none flex-col overflow-hidden border-0 bg-surface-card p-0 text-ink shadow-xl backdrop:bg-overlay md:inset-y-0 md:left-auto md:right-0 md:h-dvh md:w-[min(42vw,600px)] md:min-w-[420px] md:rounded-none md:border-l md:border-hairline md:backdrop:bg-black/60"
		>
			<header className="flex shrink-0 items-center justify-between gap-4 border-b border-hairline px-5 py-4 md:px-7">
				<div className="flex min-w-0 items-center gap-3">
					<LogoMark size={28} className="shrink-0 md:hidden" />
					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-mute">
							Equipe e subsistemas
						</p>
						<h2 className="text-base font-bold text-ink">
							Responsabilidade financeira
						</h2>
					</div>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-mute hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
					aria-label="Fechar responsabilidade financeira"
				>
					<X size={19} aria-hidden="true" />
				</button>
			</header>
			<div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-7">
				<section
					aria-labelledby="responsabilidade-heading"
					className="min-w-0"
				>
					<h2
						id="responsabilidade-heading"
						className="text-2xl font-bold tracking-tight text-ink"
					>
						Gestor Financeiro
					</h2>
					<p className="mt-2 max-w-prose text-sm leading-relaxed text-mute">
						A responsabilidade financeira acompanha automaticamente
						o Gestor ativo associado ao subsistema Financeiro.
						Alterações de vínculo, perfil ou situação atualizam essa
						responsabilidade.
					</p>

					{state.status === 'loading' ? (
						<div
							role="status"
							aria-live="polite"
							className="mt-6 space-y-3"
						>
							<p className="text-sm text-mute">
								Consultando o Financeiro...
							</p>
							<div className="h-36 animate-pulse rounded-xl border border-hairline bg-surface-soft motion-reduce:animate-none" />
						</div>
					) : state.status === 'error' ? (
						<div
							role="alert"
							className="mt-6 rounded-xl border border-state-error bg-state-error-bg p-5"
						>
							<div className="flex items-start gap-3 text-state-error">
								<AlertCircle
									className="mt-0.5 shrink-0"
									size={20}
									aria-hidden="true"
								/>
								<div className="min-w-0">
									<h3 className="font-semibold">
										Falha ao consultar
									</h3>
									<p className="mt-1 text-sm">
										{state.message}
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setAttempt((value) => value + 1)}
								className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft"
							>
								<RotateCcw size={16} aria-hidden="true" />{' '}
								Tentar novamente
							</button>
						</div>
					) : (
						<div className="mt-6 space-y-4">
							<article className="rounded-xl border border-hairline bg-surface-card p-4 sm:p-6">
								<div className="flex items-start gap-3">
									<span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-selected text-link">
										<UserRound
											size={20}
											aria-hidden="true"
										/>
									</span>
									<div className="min-w-0">
										<p className="text-xs font-semibold uppercase tracking-wide text-mute">
											Responsável atual
										</p>
										<h3 className="mt-1 break-words text-lg font-bold text-ink">
											{state.data.responsavel?.nome ??
												'Nenhum Gestor ativo'}
										</h3>
										<p className="mt-1 text-sm text-body">
											{state.data.responsavel
												? 'Gestor associado ao subsistema Financeiro'
												: 'A responsabilidade ficará vaga até um Gestor ativo ser associado ao subsistema.'}
										</p>
									</div>
								</div>
							</article>

							<div className="rounded-xl border border-hairline bg-surface-soft p-4 sm:p-5">
								<div className="flex items-start gap-3">
									<Building2
										className="mt-0.5 shrink-0 text-mute"
										size={19}
										aria-hidden="true"
									/>
									<div className="min-w-0">
										<h3 className="font-semibold text-ink">
											{state.data.subsistema?.nome ??
												'Subsistema Financeiro'}
										</h3>
										<p className="mt-1 text-sm text-mute">
											{state.data.subsistema?.ativo
												? 'Ativo'
												: 'Inativo · a composição pode ser preparada antes da ativação'}
										</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</section>
			</div>
		</dialog>
	)
}

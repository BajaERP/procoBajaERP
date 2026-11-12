import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
	AlertCircle,
	ArrowRightLeft,
	Check,
	LoaderCircle,
	RotateCcw,
	UserRound,
	X,
} from 'lucide-react'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import type { AuthUser } from '../../../contexts/AuthContext'
import { equipeService } from '../../../services/equipe'
import type { ConsultaResponsabilidadeFinanceira } from '../../../services/equipeTypes'
import { LogoMark } from '../../shared/Logo'

type LoadState =
	| { status: 'loading' }
	| { status: 'error'; message: string }
	| { status: 'ready'; data: ConsultaResponsabilidadeFinanceira }

type Operation = 'assign' | 'transfer'

const buttonClass =
	'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50'

export function ResponsabilidadeFinanceiraContent({
	user,
	onClose,
}: {
	user: AuthUser
	onClose: () => void
}) {
	const panelRef = useRef<HTMLDialogElement>(null)
	const [state, setState] = useState<LoadState>({ status: 'loading' })
	const [attempt, setAttempt] = useState(0)
	const [operation, setOperation] = useState<Operation | null>(null)
	const [saving, setSaving] = useState(false)
	const podeAdministrar = user.role === 'capitao' && user.isDemo

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
								: 'Não foi possível carregar a responsabilidade financeira.',
					})
			})
		return () => {
			active = false
		}
	}, [attempt, user.id, user.role, user.subsistemaId])

	function reload() {
		setState({ status: 'loading' })
		setAttempt((value) => value + 1)
	}

	async function remove() {
		if (!podeAdministrar || saving || state.status !== 'ready') return
		const current = state.data.responsavel
		if (!current) return
		if (
			!window.confirm(
				`Retirar a responsabilidade financeira de ${current.nome}? A conta continuará ativa como Gestor.`,
			)
		)
			return
		setSaving(true)
		try {
			await equipeService.retirarResponsabilidadeFinanceira(user.id)
			toast.success('Responsabilidade financeira retirada.', {
				toasterId: 'responsabilidade-financeira',
			})
			reload()
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Não foi possível retirar a responsabilidade financeira.',
				{ toasterId: 'responsabilidade-financeira' },
			)
		} finally {
			setSaving(false)
		}
	}

	return (
		<dialog
			ref={panelRef}
			aria-labelledby="responsabilidade-heading"
			onCancel={(event) => {
				event.preventDefault()
				if (!operation && !saving) onClose()
			}}
			onClick={(event) => {
				if (
					event.target === event.currentTarget &&
					!operation &&
					!saving
				)
					onClose()
			}}
			className="fixed inset-0 m-0 flex h-dvh max-h-dvh w-full max-w-none flex-col overflow-hidden border-0 bg-surface-card p-0 text-ink shadow-xl backdrop:bg-overlay md:inset-y-0 md:left-auto md:right-0 md:h-dvh md:w-[min(42vw,600px)] md:min-w-[420px] md:rounded-none md:border-l md:border-hairline md:backdrop:bg-black/60"
		>
			<header className="flex shrink-0 items-center justify-between gap-4 border-b border-hairline px-5 py-4 md:px-7">
				<button
					type="button"
					onClick={onClose}
					disabled={saving}
					className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-ink hover:text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red disabled:opacity-50 md:hidden"
				>
					<LogoMark size={28} className="shrink-0" />
					<ChevronLeft size={18} aria-hidden="true" /> Equipe e
					subsistemas
				</button>
				<h2 className="hidden text-base font-bold text-ink md:block">
					Gestor Financeiro
				</h2>
				<button
					type="button"
					onClick={onClose}
					disabled={saving}
					className="hidden size-11 items-center justify-center rounded-md text-mute hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red disabled:opacity-50 md:inline-flex"
					aria-label="Fechar Gestor Financeiro"
				>
					<X size={19} aria-hidden="true" />
				</button>
			</header>
			<div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 md:px-7 md:py-6">
				<section
					aria-labelledby="responsabilidade-heading"
					className="min-w-0"
				>
					<div className="mb-5">
						<h2
							id="responsabilidade-heading"
							className="text-2xl font-bold tracking-tight text-ink"
						>
							Gestor Financeiro
						</h2>
						<p className="mt-1 text-sm text-mute">
							Atribuição financeira
						</p>
					</div>

					{state.status === 'loading' ? (
						<div
							role="status"
							aria-live="polite"
							className="space-y-3"
						>
							<p className="text-sm text-mute">
								Carregando responsabilidade financeira...
							</p>
							<div className="h-36 animate-pulse rounded-xl border border-hairline bg-surface-card motion-reduce:animate-none" />
						</div>
					) : state.status === 'error' ? (
						<div
							role="alert"
							className="rounded-xl border border-state-error bg-state-error-bg p-5"
						>
							<div className="flex items-start gap-3 text-state-error">
								<AlertCircle
									className="mt-0.5 shrink-0"
									size={20}
									aria-hidden="true"
								/>
								<div className="min-w-0">
									<h3 className="font-semibold">
										Falha ao carregar a atribuição
									</h3>
									<p className="mt-1 text-sm">
										{state.message}
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={reload}
								className={`${buttonClass} mt-4`}
							>
								<RotateCcw size={16} aria-hidden="true" />{' '}
								Tentar novamente
							</button>
						</div>
					) : state.data.responsavel ? (
						<article className="rounded-xl border border-hairline bg-surface-card p-4 sm:p-6">
							<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex min-w-0 items-start gap-3">
									<span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-selected text-link">
										<UserRound
											size={20}
											aria-hidden="true"
										/>
									</span>
									<div className="min-w-0">
										<p className="text-xs font-semibold uppercase tracking-wide text-mute">
											Gestor Financeiro
										</p>
										<h3 className="mt-1 break-words text-lg font-bold text-ink">
											{state.data.responsavel.nome}
										</h3>
										<p className="mt-1 text-sm text-body">
											Gestor ·{' '}
											{state.data.responsavel
												.subsistema ?? 'sem subsistema'}
										</p>
										<span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-state-success-bg px-2.5 py-1 text-xs font-semibold text-state-success">
											<Check
												size={13}
												aria-hidden="true"
											/>{' '}
											Gestor ativo · atribuição ativa
										</span>
									</div>
								</div>
								{podeAdministrar && (
									<div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2">
										<button
											type="button"
											onClick={() =>
												setOperation('transfer')
											}
											className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed disabled:opacity-50"
											disabled={
												saving ||
												state.data.gestoresElegiveis
													.length === 0
											}
										>
											<ArrowRightLeft
												size={16}
												aria-hidden="true"
											/>{' '}
											Transferir
										</button>
										<button
											type="button"
											onClick={remove}
											className={buttonClass}
											disabled={saving}
										>
											Retirar atribuição
										</button>
									</div>
								)}
							</div>
							{podeAdministrar &&
								state.data.gestoresElegiveis.length === 0 && (
									<p className="mt-3 text-sm text-state-warning">
										Não há outro Gestor ativo disponível
										para transferir a atribuição.
									</p>
								)}
							<p className="mt-5 border-t border-hairline pt-4 text-sm text-mute">
								A atribuição não altera o perfil nem desativa a
								conta. Para desativar ou mudar o perfil, retire
								ou transfira esta responsabilidade primeiro.
							</p>
						</article>
					) : (
						<article className="rounded-xl border border-hairline bg-surface-card p-4 sm:p-6">
							<p className="text-xs font-semibold uppercase tracking-wide text-mute">
								Atribuição vaga
							</p>
							<h3 className="mt-2 text-lg font-bold text-ink">
								Nenhum Gestor Financeiro
							</h3>
							<p className="mt-1 text-sm text-body">
								Não há uma responsabilidade financeira atribuída
								no momento.
							</p>
							{podeAdministrar ? (
								<button
									type="button"
									onClick={() => setOperation('assign')}
									disabled={
										state.data.gestoresElegiveis.length ===
											0 || saving
									}
									className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
								>
									<UserRound size={16} aria-hidden="true" />{' '}
									Atribuir Gestor Financeiro
								</button>
							) : (
								<p className="mt-4 text-sm text-mute">
									Somente o Capitão pode atribuir a
									responsabilidade financeira.
								</p>
							)}
							{podeAdministrar &&
								state.data.gestoresElegiveis.length === 0 && (
									<p className="mt-2 text-sm text-state-warning">
										Não há Gestor ativo disponível para
										receber a atribuição.
									</p>
								)}
						</article>
					)}
					<div className="mt-4 rounded-lg border border-state-info bg-state-info-bg p-4 text-sm text-body">
						<p className="font-semibold text-ink">
							Regra de atribuição
						</p>
						<p className="mt-1">
							Somente o Capitão pode atribuir, retirar ou
							transferir. Pode haver zero ou um responsável. O
							Gestor precisa estar ativo; o estado do subsistema
							não interfere.
						</p>
					</div>
				</section>
			</div>
			<footer className="hidden shrink-0 border-t border-hairline p-5 md:block md:px-7">
				<button
					type="button"
					onClick={onClose}
					disabled={saving}
					className="min-h-11 w-full rounded-md border border-hairline bg-canvas px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red disabled:opacity-50"
				>
					Concluir
				</button>
			</footer>
			{operation && state.status === 'ready' && podeAdministrar && (
				<FinancialOperationDialog
					key={`${operation}:${state.data.responsavel?.id ?? ''}`}
					operation={operation}
					actorId={user.id}
					state={state.data}
					saving={saving}
					setSaving={setSaving}
					onClose={() => setOperation(null)}
					onSaved={() => {
						setOperation(null)
						reload()
					}}
				/>
			)}
		</dialog>
	)
}

function FinancialOperationDialog({
	operation,
	actorId,
	state,
	saving,
	setSaving,
	onClose,
	onSaved,
}: {
	operation: Operation
	actorId: string
	state: ConsultaResponsabilidadeFinanceira
	saving: boolean
	setSaving: (saving: boolean) => void
	onClose: () => void
	onSaved: () => void
}) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [gestorId, setGestorId] = useState('')
	const [error, setError] = useState('')
	const [fieldError, setFieldError] = useState('')
	const candidates = state.gestoresElegiveis
	const title =
		operation === 'assign'
			? 'Atribuir Gestor Financeiro'
			: 'Transferir Gestor Financeiro'

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

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (saving) return
		if (!gestorId) {
			setFieldError('Selecione um Gestor ativo.')
			return
		}
		const gestor = candidates.find((item) => item.id === gestorId)
		if (!gestor) {
			setFieldError('Selecione um Gestor ativo disponível.')
			return
		}
		const action = operation === 'assign' ? 'atribuir' : 'transferir'
		if (
			!window.confirm(
				`Confirma ${action} a responsabilidade financeira para ${gestor.nome}?`,
			)
		)
			return
		setSaving(true)
		setError('')
		try {
			if (operation === 'assign')
				await equipeService.atribuirResponsabilidadeFinanceira(
					actorId,
					gestor.id,
				)
			else
				await equipeService.transferirResponsabilidadeFinanceira(
					actorId,
					gestor.id,
				)
			toast.success(
				operation === 'assign'
					? 'Gestor Financeiro atribuído.'
					: 'Responsabilidade financeira transferida.',
				{ toasterId: 'responsabilidade-financeira' },
			)
			onSaved()
		} catch (caught) {
			const message =
				caught instanceof Error
					? caught.message
					: 'Não foi possível salvar a atribuição.'
			setError(message)
			toast.error(message, { toasterId: 'responsabilidade-financeira' })
		} finally {
			setSaving(false)
		}
	}

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby="finance-dialog-title"
			onCancel={(event) => {
				event.preventDefault()
				if (!saving) onClose()
			}}
			onClick={(event) => {
				if (event.target === event.currentTarget && !saving) onClose()
			}}
			className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto rounded-t-2xl border border-hairline bg-surface-card p-0 text-ink shadow-xl backdrop:bg-black/55 md:inset-0 md:bottom-auto md:top-1/2 md:m-auto md:max-h-[min(90dvh,36rem)] md:w-[min(100%-2rem,32rem)] md:translate-y-[-50%] md:rounded-xl"
		>
			<form onSubmit={submit} className="p-5 md:p-6">
				<div
					className="mx-auto mb-4 h-1 w-12 rounded-full bg-ash md:hidden"
					aria-hidden="true"
				/>
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0">
						<h2
							id="finance-dialog-title"
							className="text-lg font-bold text-ink"
						>
							{title}
						</h2>
						<p className="mt-2 text-sm text-mute">
							Somente o Capitão pode fazer esta alteração. Escolha
							um Gestor com conta ativa.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-mute hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
						aria-label="Fechar"
						disabled={saving}
					>
						<X size={20} aria-hidden="true" />
					</button>
				</div>
				<label
					htmlFor="finance-manager"
					className="mt-6 block text-sm font-medium text-body"
				>
					Gestor ativo
				</label>
				<select
					id="finance-manager"
					value={gestorId}
					onChange={(event) => {
						setGestorId(event.target.value)
						setFieldError('')
						setError('')
					}}
					aria-invalid={!!fieldError}
					aria-describedby={
						fieldError ? 'finance-manager-error' : undefined
					}
					className="mt-2 min-h-12 w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink focus-visible:border-red dark:[color-scheme:dark] aria-invalid:border-state-error"
				>
					<option value="">Selecione um Gestor</option>
					{candidates.map((item) => (
						<option key={item.id} value={item.id}>
							{item.nome}
							{item.subsistema ? ` · ${item.subsistema}` : ''}
						</option>
					))}
				</select>
				{fieldError && (
					<p
						id="finance-manager-error"
						className="mt-1 text-sm text-state-error"
					>
						{fieldError}
					</p>
				)}
				<p className="mt-4 rounded-lg border border-state-info bg-state-info-bg p-3 text-sm text-body">
					A atribuição é adicional e mantém o perfil Gestor. O
					subsistema pode estar ativo ou inativo.
				</p>
				{error && (
					<p
						role="alert"
						className="mt-4 rounded-lg border border-state-error bg-state-error-bg p-3 text-sm text-state-error"
					>
						{error}
					</p>
				)}
				<div className="mt-6 grid gap-2 md:grid-cols-2 md:justify-end">
					<button
						type="button"
						onClick={onClose}
						className={`${buttonClass} md:order-1`}
						disabled={saving}
					>
						Cancelar
					</button>
					<button
						type="submit"
						className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed disabled:cursor-not-allowed disabled:opacity-60"
						disabled={saving || candidates.length === 0}
					>
						{saving ? (
							<LoaderCircle
								size={17}
								className="animate-spin motion-reduce:animate-none"
								aria-hidden="true"
							/>
						) : (
							<Check size={17} aria-hidden="true" />
						)}
						{saving
							? 'Salvando...'
							: operation === 'assign'
								? 'Atribuir'
								: 'Transferir responsabilidade'}
					</button>
				</div>
			</form>
		</dialog>
	)
}

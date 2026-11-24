import { useEffect, useRef, useState, type FormEvent } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../../contexts/AuthContext'
import { equipeService } from '../../../services/equipe'
import type { OpcoesSucessaoCapitao } from '../../../services/equipeTypes'

type OptionsState =
	| { status: 'loading' }
	| { status: 'error'; message: string }
	| { status: 'ready'; data: OpcoesSucessaoCapitao }

export function SucessaoCapitaoDialog({
	atorId,
	onClose,
}: {
	atorId: string
	onClose: () => void
}) {
	const { adotarIdentidadeDemo } = useAuth()
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [options, setOptions] = useState<OptionsState>({ status: 'loading' })
	const [attempt, setAttempt] = useState(0)
	const [sucessorId, setSucessorId] = useState('')
	const [subsistemaDestinoId, setSubsistemaDestinoId] = useState('')
	const [saving, setSaving] = useState(false)

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

	useEffect(() => {
		let active = true
		equipeService
			.opcoesSucessaoCapitao(atorId)
			.then((data) => {
				if (active) {
					setOptions({ status: 'ready', data })
					setSucessorId(data.sucessores[0]?.id ?? '')
					setSubsistemaDestinoId(data.subsistemasDestino[0]?.id ?? '')
				}
			})
			.catch((error: unknown) => {
				if (active)
					setOptions({
						status: 'error',
						message:
							error instanceof Error
								? error.message
								: 'Não foi possível carregar as opções de sucessão.',
					})
			})
		return () => {
			active = false
		}
	}, [atorId, attempt])

	const selecionado =
		options.status === 'ready'
			? (options.data.sucessores.find((item) => item.id === sucessorId) ??
				null)
			: null
	const podeConfirmar = Boolean(
		options.status === 'ready' &&
		selecionado &&
		subsistemaDestinoId &&
		options.data.subsistemasDestino.some(
			(item) => item.id === subsistemaDestinoId,
		),
	)

	function close() {
		if (!saving) onClose()
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (saving || !podeConfirmar || !selecionado) return
		setSaving(true)
		try {
			await equipeService.sucederCapitao(
				atorId,
				selecionado.id,
				subsistemaDestinoId,
			)
			await adotarIdentidadeDemo(atorId, 'membro')
			toast.success('Sucessão da capitania concluída.', {
				toasterId: 'sucessao-capitao',
			})
			onClose()
		} catch (error: unknown) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Não foi possível concluir a sucessão.',
				{ toasterId: 'sucessao-capitao' },
			)
		} finally {
			setSaving(false)
		}
	}

	return (
		<>
			<dialog
				ref={dialogRef}
				aria-labelledby="sucessao-capitao-titulo"
				aria-describedby="sucessao-capitao-descricao"
				onCancel={(event) => {
					event.preventDefault()
					close()
				}}
				onClick={(event) => {
					if (event.target === event.currentTarget) close()
				}}
				className="fixed inset-0 m-auto flex h-[calc(100dvh-1rem)] max-h-dvh w-full max-w-none flex-col overflow-hidden border border-hairline bg-surface-card p-0 text-ink backdrop:bg-overlay sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-[600px] sm:rounded-lg"
			>
				<div className="flex shrink-0 items-start justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-7">
					<div>
						<h2
							id="sucessao-capitao-titulo"
							className="text-xl font-bold text-ink"
						>
							Passar a capitania
						</h2>
						<p
							id="sucessao-capitao-descricao"
							className="mt-1 text-sm text-mute"
						>
							Escolha quem assumirá como Capitão e onde você
							continuará como Membro.
						</p>
					</div>
					<button
						type="button"
						onClick={close}
						disabled={saving}
						className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-mute hover:bg-surface-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-red"
						aria-label="Fechar sucessão da capitania"
					>
						<X size={19} aria-hidden="true" />
					</button>
				</div>
				{options.status === 'loading' ? (
					<div
						role="status"
						className="px-5 py-12 text-center text-sm text-mute"
					>
						<LoaderCircle
							size={20}
							className="mx-auto mb-2 animate-spin motion-reduce:animate-none"
							aria-hidden="true"
						/>
						Carregando opções...
					</div>
				) : options.status === 'error' ? (
					<div role="alert" className="p-5 sm:p-7">
						<p className="text-sm text-state-error">
							{options.message}
						</p>
						<button
							type="button"
							onClick={() => {
								setOptions({ status: 'loading' })
								setAttempt((value) => value + 1)
							}}
							className="mt-4 min-h-11 rounded-md border border-hairline px-4 text-sm font-semibold text-ink hover:bg-surface-soft"
						>
							Tentar novamente
						</button>
					</div>
				) : (
					<form
						onSubmit={submit}
						className="flex min-h-0 flex-1 flex-col"
					>
						<div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
							<label
								htmlFor="sucessao-capitao-sucessor"
								className="block text-sm font-medium text-body"
							>
								Próximo Capitão
								<select
									id="sucessao-capitao-sucessor"
									name="sucessorId"
									autoFocus
									value={sucessorId}
									disabled={
										options.data.sucessores.length === 0
									}
									onChange={(event) =>
										setSucessorId(event.target.value)
									}
									className="mt-1.5 min-h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink focus-visible:border-red"
								>
									{options.data.sucessores.length > 0 ? (
										options.data.sucessores.map((item) => (
											<option
												key={item.id}
												value={item.id}
											>
												{item.nome} ·{' '}
												{item.perfil === 'gestor'
													? 'Gestor'
													: 'Membro'}
												{item.financeiro
													? ' · Gestor Financeiro'
													: ''}
												{item.subsistema
													? ` · ${item.subsistema}`
													: ''}
											</option>
										))
									) : (
										<option value="">
											Nenhum Gestor ou Membro ativo
										</option>
									)}
								</select>
							</label>
							<label
								htmlFor="sucessao-capitao-destino"
								className="block text-sm font-medium text-body"
							>
								Seu subsistema como Membro
								<select
									id="sucessao-capitao-destino"
									name="subsistemaDestinoId"
									autoFocus={
										options.data.sucessores.length === 0
									}
									value={subsistemaDestinoId}
									disabled={
										options.data.subsistemasDestino
											.length === 0
									}
									onChange={(event) =>
										setSubsistemaDestinoId(
											event.target.value,
										)
									}
									className="mt-1.5 min-h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink focus-visible:border-red"
								>
									{options.data.subsistemasDestino.length >
									0 ? (
										options.data.subsistemasDestino.map(
											(item) => (
												<option
													key={item.id}
													value={item.id}
												>
													{item.nome}
												</option>
											),
										)
									) : (
										<option value="">
											Nenhum subsistema ativo
										</option>
									)}
								</select>
							</label>
							<div
								role="status"
								className="rounded-md border border-hairline bg-surface-soft p-4 text-sm text-body"
							>
								{options.data.sucessores.length === 0 ? (
									'Não há Gestor ou Membro ativo disponível para assumir a capitania.'
								) : options.data.subsistemasDestino.length ===
								  0 ? (
									'Não há subsistema ativo para receber você como Membro. Ative um subsistema antes de concluir a sucessão.'
								) : selecionado ? (
									<>
										<p>
											<strong className="font-semibold text-ink">
												{selecionado.nome}
											</strong>{' '}
											assumirá como Capitão e ficará sem
											subsistema.
										</p>
										<p className="mt-2">
											Você passará a Membro do subsistema
											selecionado. As duas alterações
											serão salvas juntas.
										</p>
										{selecionado.financeiro && (
											<p className="mt-2">
												A responsabilidade financeira
												ficará vaga até outro Gestor
												ativo assumir o subsistema
												Financeiro.
											</p>
										)}
									</>
								) : null}
							</div>
							{options.data.subsistemasDestino.length === 0 && (
								<p
									role="alert"
									className="text-sm text-state-error"
								>
									É necessário ter um subsistema ativo para
									concluir a sucessão.
								</p>
							)}
						</div>
						<footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-hairline bg-surface-card px-5 py-4 sm:px-7">
							<button
								type="button"
								onClick={close}
								disabled={saving}
								className="min-h-11 rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={saving || !podeConfirmar}
								className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed disabled:cursor-not-allowed disabled:opacity-50"
							>
								{saving && (
									<LoaderCircle
										size={16}
										className="animate-spin motion-reduce:animate-none"
										aria-hidden="true"
									/>
								)}
								Confirmar sucessão
							</button>
						</footer>
					</form>
				)}
			</dialog>
		</>
	)
}

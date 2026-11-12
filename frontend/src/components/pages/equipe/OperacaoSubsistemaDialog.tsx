import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, LoaderCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { equipeService } from '../../../services/equipe'
import type {
	OpcoesDesativacaoSubsistema,
	OpcoesTransferenciaIntegrante,
	SubsistemaConsultavel,
} from '../../../services/equipeTypes'
import { labelPerfilSubsistema } from '../../../services/subsistemas'
import { Notifications } from '../../shared/Notifications'

type State<T> =
	| { status: 'loading' }
	| { status: 'error'; message: string }
	| { status: 'ready'; data: T }

export function OperacaoSubsistemaDialog({
	atorId,
	subsistema,
	integranteId,
	onSaved,
	onClose,
}: {
	atorId: string
	subsistema: SubsistemaConsultavel
	integranteId?: string
	onSaved: () => void
	onClose: () => void
}) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const transferindo = integranteId !== undefined
	const [options, setOptions] = useState<
		State<OpcoesTransferenciaIntegrante | OpcoesDesativacaoSubsistema>
	>({ status: 'loading' })
	const [destinoId, setDestinoId] = useState('')
	const [destinos, setDestinos] = useState<Record<string, string>>({})
	const [review, setReview] = useState(false)
	const [failure, setFailure] = useState<string | null>(null)
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
		const request = transferindo
			? equipeService.opcoesTransferenciaIntegrante(atorId, integranteId)
			: equipeService.opcoesDesativacaoSubsistema(atorId, subsistema.id)
		request
			.then((data) => {
				if (active) setOptions({ status: 'ready', data })
			})
			.catch((error: unknown) => {
				if (active)
					setOptions({
						status: 'error',
						message:
							error instanceof Error
								? error.message
								: 'Não foi possível preparar a operação.',
					})
			})
		return () => {
			active = false
		}
	}, [atorId, integranteId, subsistema.id, transferindo])

	function close() {
		if (!saving) onClose()
	}

	function reviewAction(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (options.status !== 'ready') return
		if (transferindo && !destinoId) {
			setFailure('Escolha um subsistema de destino.')
			return
		}
		if (!transferindo) {
			const { integrantes } = options.data as OpcoesDesativacaoSubsistema
			const missing = integrantes.find((item) => !destinos[item.id])
			if (missing) {
				setFailure(`Escolha um destino para ${missing.nome}.`)
				return
			}
		}
		setFailure(null)
		setReview(true)
	}

	async function confirm() {
		if (saving || options.status !== 'ready') return
		setSaving(true)
		setFailure(null)
		try {
			if (transferindo) {
				await equipeService.transferirIntegrante(
					atorId,
					integranteId,
					destinoId,
				)
				toast.success(
					'Integrante transferido. O histórico foi preservado.',
					{
						toasterId: 'subsistema-operacao',
					},
				)
			} else {
				await equipeService.desativarSubsistema(
					atorId,
					subsistema.id,
					destinos,
				)
				toast.success(
					'Subsistema desativado. Os vínculos e o histórico foram preservados.',
					{ toasterId: 'subsistema-operacao' },
				)
			}
			onSaved()
			onClose()
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: 'Não foi possível concluir a operação.'
			setFailure(message)
			toast.error(message, { toasterId: 'subsistema-operacao' })
		} finally {
			setSaving(false)
		}
	}

	const transferOptions = transferindo
		? options.status === 'ready'
			? (options.data as OpcoesTransferenciaIntegrante)
			: null
		: null
	const disableOptions = !transferindo
		? options.status === 'ready'
			? (options.data as OpcoesDesativacaoSubsistema)
			: null
		: null
	const integrante = disableOptions?.integrantes.find(
		(item) => item.id === integranteId,
	)
	const membroEmTransferencia =
		transferOptions && integranteId
			? subsistema.integrantes?.find((item) => item.id === integranteId)
			: null

	return (
		<>
			<Notifications id="subsistema-operacao" />
			<dialog
				ref={dialogRef}
				aria-labelledby="operacao-subsistema-titulo"
				aria-describedby="operacao-subsistema-descricao"
				onCancel={(event) => {
					event.preventDefault()
					close()
				}}
				onClick={(event) => {
					if (event.target === event.currentTarget) close()
				}}
				className="fixed inset-0 m-auto flex h-[calc(100dvh-1rem)] max-h-dvh w-full max-w-none flex-col overflow-hidden border border-hairline bg-surface-card p-0 text-ink backdrop:bg-overlay sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-[640px] sm:rounded-lg"
			>
				<header className="flex shrink-0 items-start justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-7">
					<div>
						<h2
							id="operacao-subsistema-titulo"
							className="text-xl font-bold text-ink"
						>
							{transferindo
								? review
									? 'Confirmar transferência'
									: 'Transferir integrante'
								: review
									? 'Confirmar desativação'
									: 'Desativar subsistema'}
						</h2>
						<p
							id="operacao-subsistema-descricao"
							className="mt-1 text-sm text-mute"
						>
							{transferindo
								? `${membroEmTransferencia?.nome ?? 'Integrante'} · ${subsistema.nome}`
								: subsistema.nome}
						</p>
					</div>
					<button
						type="button"
						onClick={close}
						className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-mute hover:bg-surface-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-red"
						aria-label="Fechar operação"
					>
						<X size={19} aria-hidden="true" />
					</button>
				</header>
				{options.status === 'loading' ? (
					<div
						role="status"
						className="p-8 text-center text-sm text-mute"
					>
						<LoaderCircle
							className="mx-auto mb-2 animate-spin"
							size={20}
							aria-hidden="true"
						/>
						Carregando opções...
					</div>
				) : options.status === 'error' ? (
					<p role="alert" className="p-6 text-sm text-state-error">
						{options.message}
					</p>
				) : (
					<form
						onSubmit={
							review
								? (event) => {
										event.preventDefault()
										void confirm()
									}
								: reviewAction
						}
						className="flex min-h-0 flex-1 flex-col"
					>
						<div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">
							{transferindo ? (
								transferOptions?.bloqueio ? (
									<p
										role="alert"
										className="rounded-md border border-state-warning bg-state-warning-bg p-4 text-sm text-state-warning"
									>
										{transferOptions.bloqueio}
									</p>
								) : review ? (
									<div className="rounded-md border border-hairline bg-canvas p-4 text-sm">
										<p>
											{membroEmTransferencia?.nome} será
											transferido de{' '}
											<strong>{subsistema.nome}</strong>{' '}
											para{' '}
											<strong>
												{
													transferOptions?.destinos.find(
														(item) =>
															item.id ===
															destinoId,
													)?.nome
												}
											</strong>
											.
										</p>
										<p className="mt-2 text-mute">
											O histórico será preservado. A
											operação atualiza o vínculo de uma
											só vez.
										</p>
									</div>
								) : (
									<label className="block text-sm font-medium text-body">
										Subsistema de destino
										<select
											value={destinoId}
											onChange={(event) => {
												setDestinoId(event.target.value)
												setFailure(null)
											}}
											className="mt-1.5 min-h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink"
										>
											<option value="">
												Selecione um subsistema
											</option>
											{transferOptions?.destinos.map(
												(item) => (
													<option
														key={item.id}
														value={item.id}
													>
														{item.nome}
														{!item.ativo
															? ' · Inativo'
															: ''}
													</option>
												),
											)}
										</select>
										<span className="mt-1 block text-xs font-normal text-mute">
											A transferência comum pode ter como
											destino um subsistema inativo.
										</span>
									</label>
								)
							) : disableOptions?.bloqueio ? (
								<p
									role="alert"
									className="rounded-md border border-state-warning bg-state-warning-bg p-4 text-sm text-state-warning"
								>
									{disableOptions.bloqueio}
								</p>
							) : review ? (
								<div>
									<p className="text-sm text-body">
										O subsistema será desativado. Os
										vínculos serão transferidos e o
										histórico será preservado.
									</p>
									<ul className="mt-3 divide-y divide-hairline rounded-md border border-hairline">
										{disableOptions?.integrantes.map(
											(item) => (
												<li
													key={item.id}
													className="flex flex-wrap justify-between gap-2 px-3 py-2 text-sm"
												>
													<span>
														{item.nome}
														{!item.ativo &&
															' · Conta desativada'}
														{item.perfil ===
															'lider' &&
															' · passará a Membro'}
													</span>
													<span className="text-mute">
														→{' '}
														{
															disableOptions.destinos.find(
																(destino) =>
																	destino.id ===
																	destinos[
																		item.id
																	],
															)?.nome
														}
													</span>
												</li>
											),
										)}
									</ul>
									{!disableOptions?.integrantes.length && (
										<p className="mt-3 text-sm text-mute">
											Este subsistema está vazio e não
											precisa de destino.
										</p>
									)}
								</div>
							) : (
								<div>
									<p className="text-sm text-body">
										Escolha um subsistema ativo para cada
										integrante, inclusive para contas
										desativadas.
									</p>
									<ul className="mt-3 space-y-3">
										{disableOptions?.integrantes.map(
											(item) => (
												<li
													key={item.id}
													className="rounded-md border border-hairline p-3"
												>
													<div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">
														<span className="font-semibold text-ink">
															{item.nome}
															{!item.ativo &&
																' · Conta desativada'}
														</span>
														<span className="text-xs text-mute">
															{item.perfil ===
															'lider'
																? 'Líder · passará a Membro'
																: labelPerfilSubsistema(
																		item.perfil,
																	)}
														</span>
													</div>
													<label className="block text-xs font-medium text-body">
														Destino ativo
														<select
															required
															value={
																destinos[
																	item.id
																] ?? ''
															}
															onChange={(
																event,
															) => {
																setDestinos(
																	(
																		current,
																	) => ({
																		...current,
																		[item.id]:
																			event
																				.target
																				.value,
																	}),
																)
																setFailure(null)
															}}
															className="mt-1 min-h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink"
														>
															<option value="">
																Selecione um
																destino
															</option>
															{disableOptions.destinos.map(
																(destino) => (
																	<option
																		key={
																			destino.id
																		}
																		value={
																			destino.id
																		}
																	>
																		{
																			destino.nome
																		}
																	</option>
																),
															)}
														</select>
													</label>
												</li>
											),
										)}
									</ul>
									{!disableOptions?.integrantes.length && (
										<p className="mt-3 text-sm text-mute">
											Este subsistema está vazio e não
											precisa de destino.
										</p>
									)}
								</div>
							)}
							{failure && (
								<p
									role="alert"
									className="text-sm text-state-error"
								>
									{failure}
								</p>
							)}
						</div>
						<footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-hairline bg-surface-card px-5 py-4 sm:px-7">
							<button
								type="button"
								onClick={
									review ? () => setReview(false) : close
								}
								className="inline-flex min-h-11 items-center gap-2 rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft"
							>
								{review && (
									<ArrowLeft size={15} aria-hidden="true" />
								)}
								{review ? 'Voltar' : 'Cancelar'}
							</button>
							{!(
								(transferindo && transferOptions?.bloqueio) ||
								(!transferindo && disableOptions?.bloqueio)
							) && (
								<button
									type="submit"
									disabled={saving}
									className="inline-flex min-h-11 items-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed disabled:cursor-wait disabled:opacity-60"
								>
									{saving && (
										<LoaderCircle
											size={16}
											className="animate-spin"
											aria-hidden="true"
										/>
									)}
									{saving
										? 'Salvando...'
										: review
											? 'Confirmar operação'
											: 'Revisar operação'}
								</button>
							)}
						</footer>
					</form>
				)}
			</dialog>
		</>
	)
}

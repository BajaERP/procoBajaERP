import { useEffect, useRef, useState, type FormEvent } from 'react'
import { LoaderCircle, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { equipeService } from '../../../services/equipe'
import type {
	DadosSubsistema,
	ErrosSubsistema,
	OpcoesSubsistema,
	SubsistemaConsultavel,
} from '../../../services/equipeTypes'
import {
	SubsistemaError,
	validarSubsistema,
} from '../../../services/subsistemas'
import { Notifications } from '../../shared/Notifications'

type OptionsState =
	| { status: 'loading' }
	| { status: 'error'; message: string }
	| { status: 'ready'; data: OpcoesSubsistema }

export function AdministrarSubsistemaDialog({
	atorId,
	subsistema,
	onSaved,
	onClose,
}: {
	atorId: string
	subsistema: SubsistemaConsultavel | null
	onSaved: () => void
	onClose: () => void
}) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [options, setOptions] = useState<OptionsState>({ status: 'loading' })
	const [attempt, setAttempt] = useState(0)
	const [nome, setNome] = useState(subsistema?.nome ?? '')
	const [integranteIds, setIntegranteIds] = useState<string[]>([])
	const [errors, setErrors] = useState<ErrosSubsistema>({})
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
		equipeService
			.opcoesSubsistema(atorId, subsistema?.id)
			.then((data) => {
				if (active) {
					setOptions({ status: 'ready', data })
					setIntegranteIds(data.integranteIds)
				}
			})
			.catch((error: unknown) => {
				if (active)
					setOptions({
						status: 'error',
						message:
							error instanceof Error
								? error.message
								: 'Não foi possível preparar a edição.',
					})
			})
		return () => {
			active = false
		}
	}, [atorId, subsistema?.id, attempt])

	function close() {
		if (!saving) onClose()
	}

	function toggleIntegrante(id: string) {
		setIntegranteIds((current) =>
			current.includes(id)
				? current.filter((item) => item !== id)
				: [...current, id],
		)
		setErrors((current) => ({ ...current, integranteIds: undefined }))
		setFailure(null)
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (saving || options.status !== 'ready') return
		const dados: DadosSubsistema = {
			...(subsistema ? { id: subsistema.id } : {}),
			nome,
			integranteIds,
		}
		const campos = validarSubsistema(dados)
		if (Object.keys(campos).length) {
			setErrors(campos)
			setFailure('Confira os campos indicados.')
			toast.error('Confira os campos indicados.', {
				toasterId: 'subsistema',
			})
			dialogRef.current
				?.querySelector<HTMLInputElement>('#subsistema-nome')
				?.focus()
			return
		}
		setSaving(true)
		setFailure(null)
		try {
			await equipeService.salvarSubsistema(atorId, dados)
			toast.success(
				subsistema
					? 'Subsistema atualizado.'
					: 'Subsistema criado inativo e sem Líder.',
				{ toasterId: 'subsistema' },
			)
			onSaved()
			onClose()
		} catch (error: unknown) {
			const fields = error instanceof SubsistemaError ? error.campos : {}
			setErrors(fields)
			const message =
				error instanceof Error
					? error.message
					: 'Não foi possível salvar o subsistema.'
			setFailure(message)
			toast.error(message, { toasterId: 'subsistema' })
			if (fields.nome)
				dialogRef.current
					?.querySelector<HTMLInputElement>('#subsistema-nome')
					?.focus()
		} finally {
			setSaving(false)
		}
	}

	return (
		<>
			<Notifications id="subsistema" />
			<dialog
				ref={dialogRef}
				aria-labelledby="subsistema-titulo"
				aria-describedby="subsistema-descricao"
				onCancel={(event) => {
					event.preventDefault()
					close()
				}}
				onClick={(event) => {
					if (event.target === event.currentTarget) close()
				}}
				className="fixed inset-0 m-auto flex h-[calc(100dvh-1rem)] max-h-dvh w-full max-w-none flex-col overflow-hidden border border-hairline bg-surface-card p-0 text-ink backdrop:bg-overlay sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-[640px] sm:rounded-lg"
			>
				<div className="flex shrink-0 items-start justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-7">
					<div>
						<h2
							id="subsistema-titulo"
							className="text-xl font-bold text-ink"
						>
							{subsistema
								? 'Editar subsistema'
								: 'Novo subsistema'}
						</h2>
						<p
							id="subsistema-descricao"
							className="mt-1 text-sm text-mute"
						>
							Prepare o nome e os integrantes da composição.
						</p>
					</div>
					<button
						type="button"
						onClick={close}
						className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-mute hover:bg-surface-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-red"
						aria-label="Fechar"
					>
						<X size={19} aria-hidden="true" />
					</button>
				</div>
				{options.status === 'loading' ? (
					<div
						role="status"
						className="min-h-0 flex-1 overflow-y-auto px-5 py-12 text-center text-sm text-mute"
					>
						<LoaderCircle
							size={20}
							className="mx-auto mb-2 animate-spin motion-reduce:animate-none"
							aria-hidden="true"
						/>
						Carregando integrantes disponíveis...
					</div>
				) : options.status === 'error' ? (
					<div
						role="alert"
						className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7"
					>
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
						noValidate
						className="flex min-h-0 flex-1 flex-col"
					>
						<div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
							<label
								htmlFor="subsistema-nome"
								className="block text-sm font-medium text-body"
							>
								Nome do subsistema
								<input
									id="subsistema-nome"
									name="nome"
									maxLength={120}
									value={nome}
									onChange={(event) => {
										setNome(event.target.value)
										setErrors((current) => ({
											...current,
											nome: undefined,
										}))
										setFailure(null)
									}}
									aria-invalid={!!errors.nome}
									aria-describedby={
										errors.nome
											? 'subsistema-nome-erro'
											: undefined
									}
									className="mt-1.5 min-h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink aria-invalid:border-state-error dark:[color-scheme:dark]"
								/>
							</label>
							{errors.nome && (
								<p
									id="subsistema-nome-erro"
									className="-mt-4 text-xs text-state-error"
								>
									{errors.nome}
								</p>
							)}
							<fieldset>
								<legend className="text-sm font-medium text-body">
									Composição
								</legend>
								<p className="mt-1 text-xs text-mute">
									Selecione Membros e Orientadores ativos.
									Líderes permanecem na composição até a
									definição de liderança.
								</p>
								{errors.integranteIds && (
									<p className="mt-2 text-xs text-state-error">
										{errors.integranteIds}
									</p>
								)}
								<ul className="mt-3 max-h-60 space-y-1 overflow-y-auto rounded-md border border-hairline p-2">
									{options.data.integrantesDisponiveis
										.length ? (
										options.data.integrantesDisponiveis.map(
											(item) => (
												<li key={item.id}>
													<label className="flex min-h-11 cursor-pointer items-center gap-3 rounded px-2 py-2 hover:bg-surface-soft">
														<input
															type="checkbox"
															checked={
																integranteIds.includes(
																	item.id,
																) ||
																item.subsistemaId ===
																	subsistema?.id
															}
															disabled={
																item.subsistemaId !==
																	null &&
																item.subsistemaId !==
																	undefined
															}
															onChange={() =>
																toggleIntegrante(
																	item.id,
																)
															}
															className="size-4 accent-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
														/>
														<span className="min-w-0 flex-1 text-sm text-ink">
															{item.nome}
														</span>
														<span className="text-right text-xs text-mute">
															{item.subsistemaId !==
																null &&
															item.subsistemaId !==
																undefined
																? item.subsistemaId ===
																	subsistema?.id
																	? 'Já pertence a este subsistema'
																	: 'Já pertence a outro subsistema'
																: item.perfil ===
																	  'orientador'
																	? 'Orientador'
																	: 'Membro'}
														</span>
													</label>
												</li>
											),
										)
									) : (
										<li className="px-2 py-4 text-sm text-mute">
											Não há Membros ou Orientadores
											ativos disponíveis.
										</li>
									)}
								</ul>
							</fieldset>
							<p className="text-xs text-mute">
								O subsistema permanece inativo até receber um
								Líder.
							</p>
							{failure && (
								<p
									role="alert"
									className="text-sm text-state-error"
								>
									{failure}
								</p>
							)}
						</div>
						<div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-hairline bg-surface-card px-5 py-4 sm:px-7">
							<button
								type="button"
								onClick={close}
								className="min-h-11 rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={saving}
								className="inline-flex min-h-11 items-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed disabled:cursor-wait disabled:opacity-60"
							>
								{saving ? (
									<LoaderCircle
										size={16}
										className="animate-spin motion-reduce:animate-none"
										aria-hidden="true"
									/>
								) : (
									<Save size={16} aria-hidden="true" />
								)}
								{saving ? 'Salvando...' : 'Salvar subsistema'}
							</button>
						</div>
					</form>
				)}
			</dialog>
		</>
	)
}

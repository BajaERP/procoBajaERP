import { useEffect, useRef, useState, type FormEvent } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { equipeService } from '../../../services/equipe'
import {
	notificarFalhaLideranca,
	notificarSucessoLideranca,
} from '../../../services/liderancaFeedback'
import { Notifications } from '../../shared/Notifications'
import type {
	OpcoesDefinicaoLider,
	SubsistemaConsultavel,
} from '../../../services/equipeTypes'

type OptionsState =
	| { status: 'loading' }
	| { status: 'error'; message: string }
	| { status: 'ready'; data: OpcoesDefinicaoLider }

export function DefinirLiderDialog({
	atorId,
	subsistema,
	onSaved,
	onClose,
}: {
	atorId: string
	subsistema: SubsistemaConsultavel
	onSaved: () => void
	onClose: () => void
}) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [options, setOptions] = useState<OptionsState>({ status: 'loading' })
	const [attempt, setAttempt] = useState(0)
	const [integranteId, setIntegranteId] = useState('')
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
			.opcoesDefinicaoLider(atorId, subsistema.id)
			.then((data) => {
				if (active) {
					setOptions({ status: 'ready', data })
					setIntegranteId(data.integrantesDisponiveis[0]?.id ?? '')
				}
			})
			.catch((error: unknown) => {
				if (active)
					setOptions({
						status: 'error',
						message:
							error instanceof Error
								? error.message
								: 'Não foi possível carregar os Membros ativos.',
					})
			})
		return () => {
			active = false
		}
	}, [atorId, subsistema.id, attempt])

	const selecionado =
		options.status === 'ready'
			? (options.data.integrantesDisponiveis.find(
					(item) => item.id === integranteId,
				) ?? null)
			: null

	function close() {
		if (!saving) onClose()
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (saving || options.status !== 'ready' || !selecionado) return
		setSaving(true)
		try {
			await equipeService.definirLider(
				atorId,
				subsistema.id,
				selecionado.id,
			)
			notificarSucessoLideranca(subsistema.nome)
			onSaved()
			onClose()
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: 'Não foi possível definir o Líder.'
			notificarFalhaLideranca(message)
		} finally {
			setSaving(false)
		}
	}

	return (
		<>
			<dialog
				ref={dialogRef}
				aria-labelledby="definir-lider-titulo"
				aria-describedby="definir-lider-descricao"
				onCancel={(event) => {
					event.preventDefault()
					close()
				}}
				onClick={(event) => {
					if (event.target === event.currentTarget) close()
				}}
				className="fixed inset-0 m-auto flex h-[calc(100dvh-1rem)] max-h-dvh w-full max-w-none flex-col overflow-hidden border border-hairline bg-surface-card p-0 text-ink backdrop:bg-overlay sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-[640px] sm:rounded-lg"
			>
				<Notifications id="lideranca-modal" />
				<div className="flex shrink-0 items-start justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-7">
					<div>
						<h2
							id="definir-lider-titulo"
							className="text-xl font-bold text-ink"
						>
							{subsistema.lider
								? 'Substituir Líder'
								: 'Definir Líder'}
						</h2>
						<p
							id="definir-lider-descricao"
							className="mt-1 text-sm text-mute"
						>
							Escolha um Membro ativo para liderar{' '}
							{subsistema.nome}.
						</p>
					</div>
					<button
						type="button"
						onClick={close}
						disabled={saving}
						className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-mute hover:bg-surface-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-red"
						aria-label="Fechar definição de Líder"
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
						Carregando Membros ativos...
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
						className="flex min-h-0 flex-1 flex-col"
					>
						<div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
							<label
								htmlFor="definir-lider-membro"
								className="block text-sm font-medium text-body"
							>
								Novo Líder
								<select
									id="definir-lider-membro"
									name="integranteId"
									autoFocus
									value={integranteId}
									disabled={
										options.data.integrantesDisponiveis
											.length === 0
									}
									onChange={(event) =>
										setIntegranteId(event.target.value)
									}
									className="mt-1.5 min-h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink focus-visible:border-red"
								>
									{options.data.integrantesDisponiveis.map(
										(item) => (
											<option
												key={item.id}
												value={item.id}
											>
												{item.nome}
												{' · '}
												{item.subsistemaNome ??
													'Sem subsistema'}
											</option>
										),
									)}
									{options.data.integrantesDisponiveis
										.length === 0 && (
										<option value="">
											Nenhum Membro ativo
										</option>
									)}
								</select>
							</label>
							{selecionado ? (
								<div
									role="status"
									className="rounded-md border border-hairline bg-surface-soft p-4 text-sm text-body"
								>
									<p>
										<strong className="font-semibold text-ink">
											{selecionado.nome}
										</strong>{' '}
										passará a Líder de {subsistema.nome}.
									</p>
									{selecionado.subsistemaId !==
										subsistema.id && (
										<p className="mt-2">
											Será transferido de{' '}
											{selecionado.subsistemaNome ??
												'sem subsistema'}{' '}
											para {subsistema.nome} na mesma
											operação.
										</p>
									)}
									{options.data.liderAtual && (
										<p className="mt-2">
											{options.data.liderAtual.nome}{' '}
											voltará a Membro em{' '}
											{subsistema.nome}.
										</p>
									)}
									{!options.data.subsistemaAtivo && (
										<p className="mt-2">
											{subsistema.nome} será ativado ao
											receber seu primeiro Líder.
										</p>
									)}
									<p className="mt-2">
										Todas essas mudanças serão aplicadas em
										uma única operação.
									</p>
								</div>
							) : (
								<p
									role="status"
									className="rounded-md border border-hairline bg-surface-soft p-4 text-sm text-mute"
								>
									Não há Membros ativos disponíveis para
									definir como Líder.
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
								disabled={saving || !selecionado}
								className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed disabled:cursor-not-allowed disabled:opacity-50"
							>
								{saving && (
									<LoaderCircle
										size={16}
										className="animate-spin motion-reduce:animate-none"
										aria-hidden="true"
									/>
								)}
								{options.data.liderAtual
									? 'Confirmar substituição'
									: 'Confirmar definição'}
							</button>
						</footer>
					</form>
				)}
			</dialog>
		</>
	)
}

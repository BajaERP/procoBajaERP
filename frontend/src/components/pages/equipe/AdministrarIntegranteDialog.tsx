import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Copy, KeyRound, LoaderCircle, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { ROLE_LABELS, type UserRole } from '../../../contexts/AuthContext'
import { equipeService } from '../../../services/equipe'
import {
	AdministracaoIntegranteError,
	validarEdicaoIntegrante,
} from '../../../services/cadastroIntegrante'
import type {
	AlteracaoIntegrante,
	ErrosEdicaoIntegrante,
	IntegranteVisivel,
	OpcoesAdministracaoIntegrante,
} from '../../../services/equipeTypes'
import type { AuthUser } from '../../../contexts/AuthContext'
import { Notifications } from '../../shared/Notifications'

const controlClass =
	'w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-sm text-ink aria-invalid:border-state-error dark:[color-scheme:dark]'
const buttonClass =
	'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50'

type State =
	| { status: 'loading' }
	| { status: 'error'; message: string }
	| {
			status: 'ready'
			integrante: IntegranteVisivel
			opcoes: OpcoesAdministracaoIntegrante
	  }

export function AdministrarIntegranteDialog({
	ator,
	integranteId,
	onClose,
}: {
	ator: AuthUser
	integranteId: string
	onClose: () => void
}) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [state, setState] = useState<State>({ status: 'loading' })
	const [attempt, setAttempt] = useState(0)
	const [saving, setSaving] = useState(false)
	const [failure, setFailure] = useState<string | null>(null)
	const [errors, setErrors] = useState<ErrosEdicaoIntegrante>({})
	const [password, setPassword] = useState<string | null>(null)
	const [copied, setCopied] = useState(false)
	const [selectedProfile, setSelectedProfile] = useState<UserRole | ''>('')
	const [selectedSubsystemId, setSelectedSubsystemId] = useState('')

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
		async function load() {
			try {
				const [integrante, opcoes] = await Promise.all([
					equipeService.obterDetalheIntegrante?.(
						{
							id: ator.id,
							perfil: ator.role,
							subsistemaId: ator.subsistemaId,
						},
						integranteId,
					),
					equipeService.opcoesAdministracaoIntegrante?.(
						ator.id,
						integranteId,
					),
				])
				if (!integrante)
					throw new Error(
						'Este integrante não está visível para sua identidade.',
					)
				if (!opcoes)
					throw new Error('A administração não está disponível.')
				if (active) {
					setSelectedProfile(integrante.perfil)
					setSelectedSubsystemId(integrante.subsistemaId ?? '')
					setState({ status: 'ready', integrante, opcoes })
				}
			} catch (error) {
				if (active)
					setState({
						status: 'error',
						message:
							error instanceof Error
								? error.message
								: 'Não foi possível carregar os detalhes.',
					})
			}
		}
		void load()
		return () => {
			active = false
		}
	}, [ator, integranteId, attempt])

	const integrante = (state.status === 'ready' ? state.integrante : null)!
	const opcoes = (state.status === 'ready' ? state.opcoes : null)!
	const precisaSelecionarSubsistema =
		!!integrante &&
		!!opcoes?.podeEditarDados &&
		!!selectedProfile &&
		selectedProfile !== 'capitao' &&
		(integrante.perfil === 'capitao' ||
			(integrante.subsistemaId === null &&
				selectedProfile !== 'orientador'))

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!integrante || !opcoes?.podeEditarDados || saving) return
		const form = new FormData(event.currentTarget)
		const changes: AlteracaoIntegrante = {}
		const nome = String(form.get('nome') ?? '')
		const identificador = String(form.get('identificador') ?? '')
		if (nome !== integrante.nome) changes.nome = nome
		if (identificador !== (integrante.identificador ?? ''))
			changes.identificador = identificador
		const perfil = String(
			form.get('perfil') ?? '',
		) as AlteracaoIntegrante['perfil']
		if (perfil && perfil !== integrante.perfil) {
			changes.perfil = perfil
			if (perfil === 'capitao') changes.subsistemaId = null
			else if (precisaSelecionarSubsistema)
				changes.subsistemaId = selectedSubsystemId || null
		}
		const invalid = validarEdicaoIntegrante(changes)
		if (
			!invalid.subsistemaId &&
			perfil &&
			perfil !== 'capitao' &&
			perfil !== 'orientador' &&
			precisaSelecionarSubsistema &&
			!selectedSubsystemId
		)
			invalid.subsistemaId = 'Selecione um subsistema.'
		if (
			!invalid.subsistemaId &&
			selectedSubsystemId &&
			precisaSelecionarSubsistema &&
			!opcoes.subsistemas.some(
				(subsistema) => subsistema.id === selectedSubsystemId,
			)
		)
			invalid.subsistemaId = 'Selecione um subsistema disponível.'
		if (Object.keys(invalid).length) {
			setErrors(invalid)
			setFailure('Confira os campos indicados.')
			toast.error('Confira os campos indicados.', {
				toasterId: 'administracao',
			})
			return
		}
		if (!Object.keys(changes).length) {
			toast.info('Nenhuma alteração para salvar.', {
				toasterId: 'administracao',
			})
			return
		}
		void (async () => {
			setSaving(true)
			setFailure(null)
			try {
				await equipeService.administrarIntegrante?.(
					ator.id,
					integrante.id,
					changes,
				)
				setErrors({})
				toast.success('Dados do integrante atualizados.', {
					toasterId: 'administracao',
				})
				setAttempt((value) => value + 1)
			} catch (error) {
				const fields =
					error instanceof AdministracaoIntegranteError
						? error.campos
						: {}
				setErrors(fields)
				const message =
					error instanceof Error
						? error.message
						: 'Não foi possível atualizar os dados.'
				setFailure(message)
				toast.error(message, { toasterId: 'administracao' })
			} finally {
				setSaving(false)
			}
		})()
	}

	async function changeStatus() {
		if (!integrante || !opcoes?.podeAlterarStatus || saving) return
		const next = !integrante.ativo
		const action = next ? 'reativar' : 'desativar'
		if (
			!window.confirm(
				`Confirma ${action} ${integrante.nome}? O histórico será preservado.`,
			)
		)
			return
		setSaving(true)
		try {
			await equipeService.administrarIntegrante?.(
				ator.id,
				integrante.id,
				{ ativo: next },
			)
			toast.success(
				next
					? 'Conta reativada.'
					: 'Conta desativada. O histórico foi preservado.',
				{ toasterId: 'administracao' },
			)
			setAttempt((value) => value + 1)
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: 'Não foi possível alterar a situação.'
			setFailure(message)
			toast.error(message, { toasterId: 'administracao' })
		} finally {
			setSaving(false)
		}
	}

	async function resetPassword() {
		if (!integrante || !opcoes?.podeRedefinirSenha || saving) return
		if (
			!window.confirm(
				`Gerar uma nova senha provisória para ${integrante.nome}?`,
			)
		)
			return
		setSaving(true)
		try {
			const value = await equipeService.redefinirSenhaProvisoria?.(
				ator.id,
				integrante.id,
			)
			if (!value) throw new Error('Não foi possível redefinir a senha.')
			setPassword(value)
			toast.success('Senha provisória redefinida.', {
				toasterId: 'administracao',
			})
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: 'Não foi possível redefinir a senha.'
			setFailure(message)
			toast.error(message, { toasterId: 'administracao' })
		} finally {
			setSaving(false)
		}
	}

	async function copyPassword() {
		if (!password) return
		try {
			await navigator.clipboard.writeText(password)
			setCopied(true)
			toast.success('Senha copiada.', { toasterId: 'administracao' })
		} catch {
			toast.error(
				'Não foi possível copiar. Selecione a senha e copie manualmente.',
				{ toasterId: 'administracao' },
			)
		}
	}

	function close() {
		if (saving) return
		setPassword(null)
		onClose()
	}

	const fieldError = (field: keyof AlteracaoIntegrante) =>
		errors[field] ? (
			<p
				id={`admin-${field}-error`}
				className="mt-1 text-xs text-state-error"
			>
				{errors[field]}
			</p>
		) : null

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby="admin-title"
			aria-describedby="admin-description"
			onCancel={(event) => {
				event.preventDefault()
				close()
			}}
			onClick={(event) => {
				if (event.target === event.currentTarget) close()
			}}
			className="fixed inset-0 m-auto max-h-dvh w-full max-w-none overflow-y-auto border border-hairline bg-surface-card p-0 text-ink backdrop:bg-overlay sm:max-h-[calc(100dvh-2rem)] sm:max-w-[640px] sm:rounded-lg"
		>
			<Notifications id="administracao" />
			<header className="relative border-b border-hairline px-4 py-5 sm:px-7">
				<h2 id="admin-title" className="pr-12 text-xl font-bold">
					{password
						? 'Senha provisória redefinida'
						: (integrante?.nome ?? 'Detalhes do integrante')}
				</h2>
				<p
					id="admin-description"
					className="mt-1 pr-8 text-sm text-mute"
				>
					Consulte os dados visíveis e administre esta conta conforme
					suas permissões.
				</p>
				<button
					type="button"
					onClick={close}
					disabled={saving}
					aria-label="Fechar detalhes"
					className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-md text-mute hover:bg-surface-raised disabled:opacity-50"
				>
					<X size={20} aria-hidden="true" />
				</button>
			</header>
			{password ? (
				<div className="space-y-5 px-4 py-6 sm:px-7">
					<p className="text-sm text-body">
						<strong>{integrante?.nome}</strong> deverá trocar a
						senha no próximo acesso.
					</p>
					<div className="rounded-md border border-state-warning bg-state-warning-bg p-4 text-sm text-state-warning">
						<strong>Exibida uma única vez.</strong>
						<p className="mt-1">
							Copie e entregue agora. Ao fechar, não poderá
							consultar novamente.
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-3 rounded-md border border-hairline bg-canvas p-3">
						<code className="min-w-0 flex-1 select-all break-all font-mono text-lg">
							{password}
						</code>
						<button
							type="button"
							onClick={() => void copyPassword()}
							className={buttonClass}
						>
							{copied ? (
								<Check size={16} aria-hidden="true" />
							) : (
								<Copy size={16} aria-hidden="true" />
							)}
							{copied ? 'Copiada' : 'Copiar senha'}
						</button>
					</div>
					<p className="text-xs text-mute">
						Demonstração local: esta senha não autentica uma conta
						real e não é armazenada.
					</p>
					<div className="flex justify-end">
						<button
							type="button"
							onClick={close}
							className={`${buttonClass} border-transparent bg-red text-white hover:bg-red-pressed`}
						>
							Concluir e ocultar senha
						</button>
					</div>
				</div>
			) : state.status === 'loading' ? (
				<p role="status" className="p-7 text-sm text-mute">
					Carregando detalhes...
				</p>
			) : state.status === 'error' ? (
				<div className="space-y-4 p-7">
					<p role="alert" className="text-sm text-state-error">
						{state.message}
					</p>
					<button
						type="button"
						className={buttonClass}
						onClick={() => {
							setState({ status: 'loading' })
							setAttempt((value) => value + 1)
						}}
					>
						Tentar novamente
					</button>
				</div>
			) : (
				<form onSubmit={submit} noValidate>
					<fieldset
						disabled={saving}
						className="space-y-5 px-4 py-6 sm:px-7"
					>
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<label
									htmlFor="admin-nome"
									className="mb-1.5 block text-xs font-medium text-body"
								>
									Nome completo
								</label>
								<input
									id="admin-nome"
									name="nome"
									defaultValue={integrante.nome}
									maxLength={150}
									readOnly={!opcoes.podeEditarDados}
									aria-invalid={!!errors.nome}
									aria-describedby={
										errors.nome
											? 'admin-nome-error'
											: undefined
									}
									className={controlClass}
								/>
								{fieldError('nome')}
							</div>
							<div>
								<label
									htmlFor="admin-identificador"
									className="mb-1.5 block text-xs font-medium text-body"
								>
									{integrante.perfil === 'orientador'
										? 'SIAPE'
										: 'RA'}
								</label>
								<input
									id="admin-identificador"
									name="identificador"
									defaultValue={
										integrante.identificador ?? ''
									}
									inputMode="numeric"
									maxLength={20}
									readOnly={!opcoes.podeEditarDados}
									aria-invalid={!!errors.identificador}
									aria-describedby={
										errors.identificador
											? 'admin-identificador-error'
											: undefined
									}
									className={`${controlClass} font-mono`}
								/>
								{integrante.identificador === null && (
									<p className="mt-1 text-xs text-mute">
										Identificador restrito nesta identidade.
									</p>
								)}
								{fieldError('identificador')}
							</div>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<label
									htmlFor="admin-perfil"
									className="mb-1.5 block text-xs font-medium text-body"
								>
									Perfil
								</label>
								{opcoes.perfis.length ? (
									<>
										<select
											id="admin-perfil"
											name="perfil"
											value={selectedProfile}
											onChange={(event) => {
												const next = event.target
													.value as UserRole
												setSelectedProfile(next)
												if (next === 'capitao')
													setSelectedSubsystemId('')
											}}
											aria-invalid={!!errors.perfil}
											aria-describedby={`admin-perfil-help${errors.perfil ? ' admin-perfil-error' : ''}`}
											className={controlClass}
										>
											<option value={integrante.perfil}>
												{ROLE_LABELS[integrante.perfil]}
											</option>
											{opcoes.perfis
												.filter(
													(perfil) =>
														perfil !==
														integrante.perfil,
												)
												.map((perfil) => (
													<option
														key={perfil}
														value={perfil}
													>
														{ROLE_LABELS[perfil]}
													</option>
												))}
										</select>
										<p
											id="admin-perfil-help"
											className="mt-1 text-xs text-mute"
										>
											A definição e troca de Líder
											acontece no fluxo próprio do
											subsistema. Ao assumir Capitão, o
											vínculo com subsistema será
											removido.
										</p>
									</>
								) : (
									<p className="rounded-md border border-hairline bg-surface-soft px-3 py-2 text-sm">
										{ROLE_LABELS[integrante.perfil]}
										{integrante.financeiro
											? ' · responsabilidade financeira'
											: ''}
									</p>
								)}
								{fieldError('perfil')}
							</div>
							<div>
								<label
									htmlFor="admin-subsistema"
									className="mb-1.5 block text-xs font-medium text-body"
								>
									Subsistema
								</label>
								{precisaSelecionarSubsistema ? (
									<select
										id="admin-subsistema"
										value={selectedSubsystemId}
										required={
											selectedProfile !== 'orientador'
										}
										onChange={(event) =>
											setSelectedSubsystemId(
												event.target.value,
											)
										}
										aria-invalid={!!errors.subsistemaId}
										aria-describedby={`admin-subsistema-help${errors.subsistemaId ? ' admin-subsistemaId-error' : ''}`}
										className={controlClass}
									>
										<option value="">
											{selectedProfile === 'orientador'
												? 'Sem subsistema'
												: 'Selecione um subsistema'}
										</option>
										{opcoes.subsistemas.map(
											(subsistema) => (
												<option
													key={subsistema.id}
													value={subsistema.id}
												>
													{subsistema.nome}
													{subsistema.ativo
														? ''
														: ' (inativo)'}
												</option>
											),
										)}
									</select>
								) : (
									<p className="rounded-md border border-hairline bg-surface-soft px-3 py-2 text-sm">
										{selectedProfile === 'capitao' &&
										integrante.perfil !== 'capitao'
											? 'Sem subsistema ao assumir o perfil Capitão'
											: (integrante.subsistema ??
												'Sem subsistema')}
									</p>
								)}
								{precisaSelecionarSubsistema && (
									<p
										id="admin-subsistema-help"
										className="mt-1 text-xs text-mute"
									>
										{selectedProfile === 'orientador'
											? 'O subsistema é opcional para Orientador.'
											: 'Este perfil precisa pertencer a um subsistema.'}
									</p>
								)}
								{fieldError('subsistemaId')}
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-2 text-sm">
							<span
								className={`rounded-full px-2.5 py-1 text-xs font-semibold ${integrante.ativo ? 'bg-state-success-bg text-state-success' : 'bg-state-warning-bg text-state-warning'}`}
							>
								{integrante.ativo ? 'Ativo' : 'Inativo'}
							</span>
							{integrante.passwordChangePending && (
								<span className="rounded-full bg-state-info-bg px-2.5 py-1 text-xs font-semibold text-state-info">
									Troca de senha pendente
								</span>
							)}
						</div>
						{opcoes.bloqueioStatus && (
							<p className="rounded-md border border-state-warning bg-state-warning-bg p-3 text-xs text-state-warning">
								{opcoes.bloqueioStatus}
							</p>
						)}
						{failure && (
							<p
								role="alert"
								className="text-sm text-state-error"
							>
								{failure}
							</p>
						)}
					</fieldset>
					<footer className="flex flex-col gap-3 border-t border-hairline px-4 py-5 sm:flex-row sm:flex-wrap sm:justify-between sm:px-7">
						<div className="flex flex-col gap-2 sm:flex-row">
							{opcoes.podeAlterarStatus && (
								<button
									type="button"
									onClick={() => void changeStatus()}
									className={buttonClass}
									disabled={saving}
								>
									{integrante.ativo
										? 'Desativar conta'
										: 'Reativar conta'}
								</button>
							)}
							{opcoes.podeRedefinirSenha && (
								<button
									type="button"
									onClick={() => void resetPassword()}
									className={buttonClass}
									disabled={saving}
								>
									<KeyRound size={16} aria-hidden="true" />
									Redefinir senha provisória
								</button>
							)}
						</div>
						<div className="flex flex-col-reverse gap-2 sm:flex-row">
							<button
								type="button"
								onClick={close}
								className={buttonClass}
								disabled={saving}
							>
								Fechar
							</button>
							{opcoes.podeEditarDados && (
								<button
									type="submit"
									className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed disabled:opacity-50"
									disabled={saving}
								>
									{saving ? (
										<LoaderCircle
											size={16}
											className="animate-spin"
											aria-hidden="true"
										/>
									) : (
										<Save size={16} aria-hidden="true" />
									)}
									Salvar alterações
								</button>
							)}
						</div>
					</footer>
				</form>
			)}
		</dialog>
	)
}

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Copy, Info, LoaderCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { ROLE_LABELS } from '../../../contexts/AuthContext'
import { equipeService } from '../../../services/equipe'
import {
	CadastroIntegranteError,
	validarCadastroIntegrante,
} from '../../../services/cadastroIntegrante'
import type {
	CadastroIntegrante,
	ErrosCadastroIntegrante,
	OpcoesCadastroIntegrante,
	PerfilCadastro,
} from '../../../services/equipeTypes'
import { Notifications } from '../../shared/Notifications'

const controlClass =
	'w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ash aria-invalid:border-state-error dark:[color-scheme:dark]'
const secondaryClass =
	'rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft disabled:opacity-50'
const primaryClass =
	'rounded-md bg-red px-5 text-sm font-semibold text-white hover:bg-red-pressed disabled:cursor-wait disabled:opacity-60'

type OptionsState =
	| { status: 'loading' }
	| { status: 'error'; message: string }
	| { status: 'ready'; data: OpcoesCadastroIntegrante }

export function CadastroIntegranteDialog({
	atorId,
	onClose,
}: {
	atorId: string
	onClose: () => void
}) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const headingRef = useRef<HTMLHeadingElement>(null)
	const mounted = useRef(false)
	const submitting = useRef(false)
	const [options, setOptions] = useState<OptionsState>({ status: 'loading' })
	const [attempt, setAttempt] = useState(0)
	const [dados, setDados] = useState<CadastroIntegrante>({
		nome: '',
		identificador: '',
		perfil: 'membro',
		subsistemaId: null,
	})
	const [erros, setErros] = useState<ErrosCadastroIntegrante>({})
	const [failure, setFailure] = useState<string | null>(null)
	const [saving, setSaving] = useState(false)
	const [simulateFailure, setSimulateFailure] = useState(false)
	const [senha, setSenha] = useState<string | null>(null)
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		mounted.current = true
		const dialog = dialogRef.current!
		const previousFocus = document.activeElement
		const previousOverflow = document.body.style.overflow
		dialog.showModal()
		document.body.style.overflow = 'hidden'
		return () => {
			mounted.current = false
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
			.opcoesCadastroIntegrante(atorId)
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
								: 'Não foi possível preparar o cadastro.',
					})
			})
		return () => {
			active = false
		}
	}, [atorId, attempt])

	useEffect(() => {
		if (senha) headingRef.current?.focus()
		else if (options.status === 'ready')
			dialogRef.current
				?.querySelector<HTMLInputElement>('#cadastro-nome')
				?.focus()
	}, [options.status, senha])

	function update<K extends keyof CadastroIntegrante>(
		field: K,
		value: CadastroIntegrante[K],
	) {
		setDados((current) => ({
			...current,
			[field]: value,
			...(field === 'perfil' && value === 'capitao'
				? { subsistemaId: null }
				: {}),
		}))
		setErros((current) => ({
			...current,
			[field]: undefined,
			...(field === 'perfil'
				? { identificador: undefined, subsistemaId: undefined }
				: {}),
		}))
		setFailure(null)
	}

	function showErrors(fields: ErrosCadastroIntegrante, message: string) {
		setErros(fields)
		setFailure(message)
		toast.error(message, { toasterId: 'cadastro' })
		const first = Object.keys(fields)[0]
		if (first)
			dialogRef.current
				?.querySelector<HTMLElement>(`#cadastro-${first}`)
				?.focus()
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (submitting.current || options.status !== 'ready') return
		const fields = validarCadastroIntegrante(dados, options.data)
		if (Object.keys(fields).length) {
			showErrors(fields, 'Confira os campos indicados.')
			return
		}
		submitting.current = true
		setSaving(true)
		setFailure(null)
		try {
			if (simulateFailure)
				await equipeService.simularFalhaNoProximoCadastro?.()
			setSimulateFailure(false)
			const result = await equipeService.cadastrarIntegrante(
				atorId,
				dados,
			)
			if (!mounted.current) return
			setSenha(result.senhaProvisoria)
			toast.success('Integrante cadastrado com sucesso.', {
				toasterId: 'cadastro',
			})
		} catch (error: unknown) {
			if (!mounted.current) return
			showErrors(
				error instanceof CadastroIntegranteError ? error.campos : {},
				error instanceof Error
					? error.message
					: 'Não foi possível cadastrar. Tente novamente.',
			)
		} finally {
			submitting.current = false
			if (mounted.current) setSaving(false)
		}
	}

	function close() {
		if (submitting.current) return
		setSenha(null)
		onClose()
	}

	async function copyPassword() {
		if (!senha) return
		try {
			await navigator.clipboard.writeText(senha)
			setCopied(true)
			toast.success('Senha copiada.', { toasterId: 'cadastro' })
		} catch {
			toast.error(
				'Não foi possível copiar. Selecione a senha e copie manualmente.',
				{ toasterId: 'cadastro' },
			)
		}
	}

	function fieldError(field: keyof CadastroIntegrante) {
		return erros[field] ? (
			<p
				id={`cadastro-${field}-erro`}
				className="mt-1.5 text-xs text-state-error"
			>
				{erros[field]}
			</p>
		) : null
	}

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby="cadastro-titulo"
			aria-describedby="cadastro-descricao"
			onCancel={(event) => {
				event.preventDefault()
				close()
			}}
			onClick={(event) => {
				if (event.target === event.currentTarget) close()
			}}
			className="fixed inset-0 m-auto max-h-dvh w-full max-w-none overflow-y-auto border border-hairline bg-surface-card p-0 text-ink backdrop:bg-overlay sm:max-h-[calc(100dvh-2rem)] sm:max-w-[670px] sm:rounded-lg"
		>
			<div>
				<header className="relative border-b border-hairline px-4 py-5 sm:px-7 sm:py-6">
					<h2
						ref={headingRef}
						id="cadastro-titulo"
						tabIndex={-1}
						className="pr-10 text-xl font-bold sm:text-[22px]"
					>
						{senha ? 'Integrante cadastrado' : 'Novo integrante'}
					</h2>
					<p
						id="cadastro-descricao"
						className="mt-2 pr-6 text-sm text-mute"
					>
						{senha
							? 'Entregue a senha provisória à pessoa cadastrada.'
							: 'Cadastre uma pessoa sem sair da listagem.'}
					</p>
					<button
						type="button"
						onClick={close}
						disabled={saving}
						aria-label={
							senha ? 'Fechar e ocultar senha' : 'Fechar cadastro'
						}
						className="absolute right-2 top-3 inline-flex items-center justify-center rounded-md text-mute hover:bg-surface-raised disabled:opacity-50 sm:right-4 sm:top-4"
					>
						<X size={20} aria-hidden="true" />
					</button>
				</header>
				{senha ? (
					<>
						<div className="space-y-5 px-4 py-6 sm:px-7">
							<p className="break-words text-sm text-body">
								<strong>{dados.nome.trim()}</strong> foi
								cadastrado com troca de senha obrigatória no
								próximo acesso.
							</p>
							<div className="rounded-lg border border-state-warning bg-state-warning-bg p-4 text-sm text-state-warning">
								<strong>
									Esta senha é exibida uma única vez.
								</strong>
								<p className="mt-1">
									Ao fechar esta janela, ela não poderá ser
									consultada novamente. Copie e entregue antes
									de continuar.
								</p>
							</div>
							<div>
								<p
									id="senha-label"
									className="mb-2 text-sm font-medium text-body"
								>
									Senha provisória
								</p>
								<div className="flex flex-wrap items-center gap-3 rounded-md border border-hairline bg-canvas p-3">
									<code
										aria-labelledby="senha-label"
										className="min-w-0 flex-1 select-all break-all font-mono text-lg text-ink"
									>
										{senha}
									</code>
									<button
										type="button"
										onClick={() => void copyPassword()}
										className={`${secondaryClass} inline-flex items-center gap-2`}
									>
										{copied ? (
											<Check
												size={16}
												aria-hidden="true"
											/>
										) : (
											<Copy
												size={16}
												aria-hidden="true"
											/>
										)}
										{copied ? 'Copiada' : 'Copiar senha'}
									</button>
								</div>
							</div>
							<p className="text-xs text-mute">
								Cadastro demonstrativo. Esta senha não autentica
								uma conta real.
							</p>
						</div>
						<footer className="flex justify-end border-t border-hairline px-4 py-5 sm:px-7">
							<button
								type="button"
								onClick={close}
								className={`${primaryClass} w-full sm:w-auto`}
							>
								Concluir e ocultar senha
							</button>
						</footer>
					</>
				) : options.status === 'loading' ? (
					<p role="status" className="p-7 text-sm text-mute">
						Preparando cadastro...
					</p>
				) : options.status === 'error' ? (
					<div className="space-y-4 p-7">
						<p role="alert" className="text-sm text-state-error">
							{options.message}
						</p>
						<button
							type="button"
							className={secondaryClass}
							onClick={() => {
								setOptions({ status: 'loading' })
								setAttempt((value) => value + 1)
							}}
						>
							Tentar novamente
						</button>
					</div>
				) : (
					<form
						noValidate
						onSubmit={(event) => void submit(event)}
						aria-busy={saving}
					>
						<fieldset
							disabled={saving}
							className="space-y-5 px-4 py-6 sm:px-7"
						>
							<div className="grid gap-5 sm:grid-cols-2">
								<div>
									<label
										htmlFor="cadastro-nome"
										className="mb-2 block text-xs font-medium text-body"
									>
										Nome completo
									</label>
									<input
										id="cadastro-nome"
										value={dados.nome}
										onChange={(event) =>
											update('nome', event.target.value)
										}
										maxLength={150}
										required
										autoComplete="off"
										placeholder="Ex.: Lucas Martins"
										aria-invalid={!!erros.nome}
										aria-describedby={
											erros.nome
												? 'cadastro-nome-erro'
												: undefined
										}
										className={controlClass}
									/>
									{fieldError('nome')}
								</div>
								<div>
									<label
										htmlFor="cadastro-identificador"
										className="mb-2 block text-xs font-medium text-body"
									>
										{dados.perfil === 'orientador'
											? 'SIAPE'
											: 'Registro acadêmico (RA)'}
									</label>
									<input
										id="cadastro-identificador"
										value={dados.identificador}
										onChange={(event) =>
											update(
												'identificador',
												event.target.value,
											)
										}
										inputMode="numeric"
										maxLength={20}
										required
										autoComplete="off"
										placeholder={
											dados.perfil === 'orientador'
												? 'Ex.: 1234567'
												: 'Ex.: 2345691'
										}
										aria-invalid={!!erros.identificador}
										aria-describedby={
											erros.identificador
												? 'cadastro-identificador-erro'
												: undefined
										}
										className={`${controlClass} font-mono`}
									/>
									{fieldError('identificador')}
								</div>
							</div>
							<div>
								<label
									htmlFor="cadastro-perfil"
									className="mb-2 block text-xs font-medium text-body"
								>
									Perfil de acesso
								</label>
								<select
									id="cadastro-perfil"
									value={dados.perfil}
									onChange={(event) =>
										update(
											'perfil',
											event.target
												.value as PerfilCadastro,
										)
									}
									aria-invalid={!!erros.perfil}
									aria-describedby="cadastro-perfil-ajuda cadastro-perfil-erro"
									className={controlClass}
								>
									{options.data.perfis.map((perfil) => (
										<option key={perfil} value={perfil}>
											{ROLE_LABELS[perfil]}
										</option>
									))}
								</select>
								{fieldError('perfil')}
								<p
									id="cadastro-perfil-ajuda"
									className="mt-2 text-xs text-mute"
								>
									Para definir uma liderança, cadastre como
									Membro. A escolha do Líder é feita no
									subsistema.
								</p>
							</div>
							{dados.perfil !== 'capitao' ? (
								<div>
									<label
										htmlFor="cadastro-subsistemaId"
										className="mb-2 block text-xs font-medium text-body"
									>
										Subsistema
										{dados.perfil === 'orientador'
											? ' (opcional)'
											: ''}
									</label>
									<select
										id="cadastro-subsistemaId"
										value={dados.subsistemaId ?? ''}
										onChange={(event) =>
											update(
												'subsistemaId',
												event.target.value || null,
											)
										}
										required={dados.perfil !== 'orientador'}
										aria-invalid={!!erros.subsistemaId}
										aria-describedby={
											erros.subsistemaId
												? 'cadastro-subsistemaId-erro'
												: undefined
										}
										className={controlClass}
									>
										<option value="">
											{dados.perfil === 'orientador'
												? 'Sem subsistema'
												: 'Selecione um subsistema'}
										</option>
										{options.data.subsistemas.map(
											(item) => (
												<option
													key={item.id}
													value={item.id}
												>
													{item.nome}
													{item.ativo
														? ''
														: ' (inativo)'}
												</option>
											),
										)}
									</select>
									{fieldError('subsistemaId')}
								</div>
							) : (
								<p className="text-sm text-mute">
									O Capitão atua em toda a equipe e não
									pertence a um subsistema.
								</p>
							)}
							<div className="flex gap-3 rounded-lg bg-state-info-bg p-4 text-xs leading-relaxed text-state-info">
								<Info
									size={17}
									className="mt-0.5 shrink-0"
									aria-hidden="true"
								/>
								<p>
									A senha provisória será gerada ao cadastrar
									e exibida uma única vez. A conta será
									marcada para troca obrigatória no próximo
									acesso.
								</p>
							</div>
							{failure && (
								<p
									role="alert"
									className="text-sm text-state-error"
								>
									{failure}
								</p>
							)}
							{import.meta.env.DEV && (
								<label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-mute">
									<input
										type="checkbox"
										checked={simulateFailure}
										onChange={(event) =>
											setSimulateFailure(
												event.target.checked,
											)
										}
										className="size-4 accent-red"
									/>
									Simular falha neste cadastro (Dev)
								</label>
							)}
						</fieldset>
						<footer className="flex flex-col-reverse gap-3 border-t border-hairline px-4 py-5 sm:flex-row sm:justify-end sm:px-7">
							<button
								type="button"
								disabled={saving}
								onClick={close}
								className={secondaryClass}
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={saving}
								className={`${primaryClass} inline-flex items-center justify-center gap-2`}
							>
								{saving && (
									<LoaderCircle
										size={16}
										aria-hidden="true"
										className="animate-spin motion-reduce:animate-none"
									/>
								)}
								{saving
									? 'Cadastrando...'
									: 'Cadastrar integrante'}
							</button>
						</footer>
					</form>
				)}
			</div>
			<Notifications id="cadastro" />
		</dialog>
	)
}

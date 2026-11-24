import { useEffect, useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../../../contexts/AuthContext'
import { equipeService } from '../../../services/equipe'
import { DEMO_MODE } from '../../../services/demoMode'
import {
	PasswordChangeError,
	validatePasswordChange,
} from '../../../services/passwordChange'
import { Notifications } from '../../shared/Notifications'

const controlClass =
	'w-full min-h-11 rounded-md border border-hairline bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ash aria-invalid:border-state-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red dark:[color-scheme:dark]'

export function PasswordChangeForm({ required }: { required: boolean }) {
	const { changeOwnPassword, logout } = useAuth()
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [errors, setErrors] = useState<{
		currentPassword?: string
		newPassword?: string
	}>({})
	const [saving, setSaving] = useState(false)
	const [simulateFailure, setSimulateFailure] = useState(false)
	const submitting = useRef(false)
	const headingRef = useRef<HTMLHeadingElement>(null)
	const currentPasswordRef = useRef<HTMLInputElement>(null)
	const newPasswordRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (required) headingRef.current?.focus()
	}, [required])

	function focusFirstError(fields: {
		currentPassword?: string
		newPassword?: string
	}) {
		requestAnimationFrame(() => {
			if (fields.currentPassword) currentPasswordRef.current?.focus()
			else if (fields.newPassword) newPasswordRef.current?.focus()
		})
	}

	function clearError(field: 'currentPassword' | 'newPassword') {
		setErrors((current) => ({ ...current, [field]: undefined }))
	}

	async function handleRequiredLogout() {
		try {
			await logout()
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Não foi possível encerrar a sessão.',
				{ toasterId: 'troca-senha' },
			)
		}
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (submitting.current) return
		const fields = validatePasswordChange(currentPassword, newPassword)
		if (Object.keys(fields).length) {
			setErrors(fields)
			focusFirstError(fields)
			toast.error('Confira os campos indicados.', {
				toasterId: 'troca-senha',
			})
			return
		}

		submitting.current = true
		setSaving(true)
		setErrors({})
		try {
			if (DEMO_MODE && simulateFailure) {
				setSimulateFailure(false)
				await equipeService.simularFalhaNaProximaTrocaSenha?.()
			}
			await changeOwnPassword(currentPassword, newPassword)
			setCurrentPassword('')
			setNewPassword('')
			toast.success(
				DEMO_MODE
					? 'Troca demonstrativa concluída.'
					: 'Senha alterada com sucesso.',
				{
					toasterId: 'troca-senha',
				},
			)
		} catch (error: unknown) {
			setCurrentPassword('')
			setNewPassword('')
			const message =
				error instanceof Error
					? error.message
					: 'Não foi possível alterar a senha.'
			if (error instanceof PasswordChangeError) {
				setErrors(error.fields)
				focusFirstError(error.fields)
			}
			toast.error(message, { toasterId: 'troca-senha' })
		} finally {
			submitting.current = false
			setSaving(false)
		}
	}

	const cardClass = required
		? 'w-full max-w-xl rounded-lg border border-hairline bg-canvas p-5 shadow-sm sm:p-7'
		: 'space-y-4 border-t border-hairline pt-5'
	const titleId = required
		? 'troca-senha-titulo'
		: 'troca-senha-voluntaria-titulo'
	const content = (
		<section className={cardClass} aria-labelledby={titleId}>
			<header className="space-y-2">
				{required ? (
					<h1
						ref={headingRef}
						id={titleId}
						tabIndex={-1}
						className="text-xl font-bold text-ink"
					>
						Defina sua senha
					</h1>
				) : (
					<h3 id={titleId} className="text-sm font-semibold text-ink">
						Alterar senha
					</h3>
				)}
				<p className="text-sm text-mute">
					{DEMO_MODE
						? required
							? 'Esta identidade precisa definir uma senha própria para continuar na demonstração.'
							: 'Troque a senha da identidade fictícia nesta sessão de demonstração.'
						: required
							? 'Defina uma senha pessoal para continuar usando o ERP.'
							: 'Atualize a senha da sua conta.'}
				</p>
				{DEMO_MODE ? (
					<p className="text-xs text-mute">
						A senha atual é solicitada, mas não pode ser conferida
						pelo mock. A operação não autentica ninguém nem altera
						credenciais reais. Os campos não são salvos no
						navegador.
					</p>
				) : (
					<p className="text-xs text-mute">
						Confirme sua senha atual. Os campos não são salvos no
						navegador.
					</p>
				)}
			</header>

			<form
				className="mt-5 space-y-4"
				onSubmit={(event) => void submit(event)}
			>
				<div className="space-y-1.5">
					<label
						htmlFor="senha-atual"
						className="block text-sm font-medium text-body"
					>
						Senha atual
					</label>
					<input
						ref={currentPasswordRef}
						id="senha-atual"
						name="currentPassword"
						type="password"
						autoComplete="current-password"
						aria-required="true"
						value={currentPassword}
						onChange={(event) => {
							setCurrentPassword(event.target.value)
							clearError('currentPassword')
						}}
						aria-invalid={!!errors.currentPassword}
						aria-describedby={
							errors.currentPassword
								? 'senha-atual-erro'
								: 'senha-atual-ajuda'
						}
						className={controlClass}
					/>
					{errors.currentPassword ? (
						<p
							id="senha-atual-erro"
							className="text-xs text-state-error"
						>
							{errors.currentPassword}
						</p>
					) : (
						<p id="senha-atual-ajuda" className="text-xs text-mute">
							{DEMO_MODE
								? 'Campo obrigatório para a simulação; o valor não é verificado.'
								: 'Digite a senha usada atualmente na sua conta.'}
						</p>
					)}
				</div>

				<div className="space-y-1.5">
					<label
						htmlFor="senha-nova"
						className="block text-sm font-medium text-body"
					>
						Nova senha
					</label>
					<input
						ref={newPasswordRef}
						id="senha-nova"
						name="newPassword"
						type="password"
						autoComplete="new-password"
						aria-required="true"
						value={newPassword}
						onChange={(event) => {
							setNewPassword(event.target.value)
							clearError('newPassword')
						}}
						aria-invalid={!!errors.newPassword}
						aria-describedby={
							errors.newPassword
								? 'senha-nova-erro'
								: 'senha-nova-ajuda'
						}
						className={controlClass}
					/>
					{errors.newPassword ? (
						<p
							id="senha-nova-erro"
							className="text-xs text-state-error"
						>
							{errors.newPassword}
						</p>
					) : (
						<p id="senha-nova-ajuda" className="text-xs text-mute">
							Use de 8 a 64 caracteres. Letras acentuadas e
							símbolos podem reduzir o limite.
						</p>
					)}
				</div>

				{DEMO_MODE && (
					<label className="flex min-h-11 items-center gap-2 text-sm text-mute">
						<input
							type="checkbox"
							checked={simulateFailure}
							onChange={(event) =>
								setSimulateFailure(event.target.checked)
							}
							disabled={saving}
							className="size-4 accent-red"
						/>
						Simular falha nesta troca (Dev)
					</label>
				)}
				<button
					type="submit"
					disabled={saving}
					className="inline-flex min-h-11 items-center justify-center rounded-md bg-red px-5 text-sm font-semibold text-white hover:bg-red-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
				>
					{saving ? 'Trocando…' : 'Trocar senha'}
				</button>
				{required && (
					<button
						type="button"
						onClick={() => void handleRequiredLogout()}
						disabled={saving}
						className="ml-3 inline-flex min-h-11 items-center justify-center rounded-md border border-hairline px-5 text-sm font-semibold text-ink hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red disabled:cursor-wait disabled:opacity-60"
					>
						Sair
					</button>
				)}
			</form>
			<Notifications id="troca-senha" />
		</section>
	)

	if (!required) return content
	return (
		<main className="flex min-h-dvh items-start justify-center bg-surface-soft px-4 py-8 dark:bg-surface-dark sm:items-center sm:px-6">
			{content}
		</main>
	)
}

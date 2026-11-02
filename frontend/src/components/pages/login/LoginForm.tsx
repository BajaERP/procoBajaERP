import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
	const { login } = useAuth()
	const [ra, setRa] = useState('')
	const [password, setPassword] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const raRef = useRef<HTMLInputElement>(null)
	useEffect(() => {
		if (window.matchMedia('(min-width: 768px)').matches)
			raRef.current?.focus()
	}, [])

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		setError(null)
		if (!ra.trim() || !password) {
			setError('Informe RA e senha.')
			return
		}
		setSubmitting(true)
		try {
			await login(ra, password)
			onSuccess()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Falha ao entrar.')
			setSubmitting(false)
		}
	}

	const inputClass =
		'w-full min-h-11 rounded-md border border-hairline bg-canvas px-3 text-[13px] text-ink placeholder:text-mute outline-none focus:border-red focus:ring-2 focus:ring-red/30 disabled:opacity-50'

	return (
		<form onSubmit={handleSubmit} className="mt-10">
			<div>
				<label
					htmlFor="ra"
					className="mb-2 block text-xs font-semibold text-body"
				>
					Registro acadêmico (RA)
				</label>
				<input
					id="ra"
					ref={raRef}
					type="text"
					autoComplete="username"
					inputMode="numeric"
					maxLength={20}
					required
					placeholder="Ex.: 2345678"
					value={ra}
					onChange={(e) => setRa(e.target.value.replace(/\D/g, ''))}
					disabled={submitting}
					className={inputClass}
				/>
			</div>
			<div className="mt-8">
				<label
					htmlFor="password"
					className="mb-2 block text-xs font-semibold text-body"
				>
					Senha
				</label>
				<input
					id="password"
					type="password"
					autoComplete="current-password"
					required
					placeholder="••••••••••"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={submitting}
					className={inputClass}
				/>
			</div>
			<div className={error ? 'mt-7' : 'mt-16'}>
				{error && (
					<p
						role="alert"
						className="flex min-h-11 items-center gap-2 rounded-md border border-hairline bg-state-error-bg px-3 py-2 text-[13px] font-medium text-state-error"
					>
						<span aria-hidden="true">!</span>
						<span>{error}</span>
					</p>
				)}
				<button
					type="submit"
					disabled={submitting}
					className={`${error ? 'mt-5' : ''} w-full rounded-md bg-red px-3 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-red-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60`}
				>
					{submitting ? 'Entrando…' : 'Entrar'}
				</button>
			</div>
		</form>
	)
}

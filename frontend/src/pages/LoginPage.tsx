import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LogoMark } from '../components/Logo'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const [ra, setRa] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const raRef = useRef<HTMLInputElement>(null)
  const requestedDestination = (location.state as { from?: unknown } | null)?.from
  const destination =
    typeof requestedDestination === 'string' && requestedDestination.startsWith('/app/')
      ? requestedDestination
      : '/app/gestao'

  // If already signed in, bounce to the app
  useEffect(() => {
    if (isAuthenticated) navigate(destination, { replace: true })
  }, [destination, isAuthenticated, navigate])

  useEffect(() => {
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
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar.')
      setSubmitting(false)
    }
  }

  // The login card stays in light surface for visual focus in both modes;
  // only the page wash and text colors shift. The logo carries its own
  // brand-red bg so it reads cleanly on any backdrop.
  const cardBg = 'bg-canvas border-hairline dark:border-hairline-dark text-ink'
  const inputBg = 'bg-surface-soft dark:bg-surface-dark border-hairline dark:border-hairline-dark text-ink placeholder-ash focus:border-red focus:ring-red/30'
  const labelDim = 'text-mute'

  return (
    <main className="min-h-dvh flex items-center justify-center font-sans px-4 sm:px-6 py-8 bg-surface-soft dark:bg-surface-dark transition-colors">
      <div className="w-full max-w-sm space-y-6 sm:space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <LogoMark size={72} />
          <h1 className={`text-xs tracking-widest uppercase ${labelDim} transition-colors`}>
            Acesse sua conta
          </h1>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className={`rounded-2xl border p-4 sm:p-6 space-y-4 transition-colors ${cardBg}`}
        >
          <div className="space-y-1.5">
            <label htmlFor="ra" className={`text-[11px] font-semibold uppercase tracking-wide ${labelDim}`}>
              RA
            </label>
            <input
              id="ra"
              ref={raRef}
              type="text"
              autoComplete="username"
              inputMode="numeric"
              aria-label="RA"
              required
              placeholder="Digite seu RA"
              value={ra}
              onChange={(e) => setRa(e.target.value)}
              disabled={submitting}
              className={`w-full px-4 py-2.5 rounded-md border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50 ${inputBg}`}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className={`text-[11px] font-semibold uppercase tracking-wide ${labelDim}`}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-label="Senha"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className={`w-full px-4 py-2.5 rounded-md border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50 ${inputBg}`}
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-300 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-red hover:bg-red-pressed text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      <p className="text-center text-xs leading-relaxed text-mute" role="note">
        Acesso de demonstração. Não use credenciais reais; qualquer RA e senha preenchidos permitem entrar.
      </p>
      </div>
    </main>
  )
}

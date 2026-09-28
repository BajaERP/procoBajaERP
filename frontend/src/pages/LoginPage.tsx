import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogoMark } from '../components/Logo'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

// Plain email + password form. No backend yet — on submit the AuthContext
// stubs a user from the email and we redirect to /app/gestao.
export default function LoginPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { login, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  // If already signed in, bounce to the app
  useEffect(() => {
    if (isAuthenticated) navigate('/app/gestao', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError('Informe e-mail e senha.')
      return
    }
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/app/gestao', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar.')
      setSubmitting(false)
    }
  }

  // The login card stays in light surface for visual focus in both modes;
  // only the page wash and text colors shift. The logo carries its own
  // brand-red bg so it reads cleanly on any backdrop.
  const cardBg =
    theme === 'dark'
      ? 'bg-canvas border-hairline-soft text-ink'
      : 'bg-canvas border-hairline text-ink'
  const inputBg =
    theme === 'dark'
      ? 'bg-surface-soft border-hairline-soft text-ink placeholder-ash focus:border-red focus:ring-red/30'
      : 'bg-surface-soft border-hairline text-ink placeholder-ash focus:border-red focus:ring-red/30'
  const labelDim =
    theme === 'dark' ? 'text-mute' : 'text-mute'

  return (
    <div className="min-h-screen flex items-center justify-center font-sans px-6 bg-surface-soft dark:bg-surface-dark transition-colors">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <LogoMark size={72} />
          <p className={`text-xs tracking-widest uppercase ${labelDim} transition-colors`}>
            Acesse sua conta
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className={`rounded-2xl border p-6 space-y-4 transition-colors ${cardBg}`}
        >
          <div className="space-y-1.5">
            <label className={`text-[11px] font-semibold uppercase tracking-wide ${labelDim}`}>
              E-mail
            </label>
            <input
              ref={emailRef}
              type="text"
              autoComplete="username"
              placeholder="voce@procobaja.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50 ${inputBg}`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[11px] font-semibold uppercase tracking-wide ${labelDim}`}>
              Senha
            </label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50 ${inputBg}`}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-red hover:bg-red-pressed text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

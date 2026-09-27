import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { LogoutIcon, MoonIcon, SunIcon } from '../components/icons'

type ThemeChoice = 'light' | 'dark' | 'auto'

function resolveStoredTheme(): ThemeChoice {
  if (typeof window === 'undefined') return 'auto'
  const stored = window.localStorage.getItem('proco.theme')
  return stored === 'light' || stored === 'dark' ? stored : 'auto'
}

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // 'auto' is the absence of a stored override; we surface that here as a
  // 3rd option so the user can clear their override and follow the OS again.
  const stored = resolveStoredTheme()
  const choice: ThemeChoice = stored === 'auto' ? 'auto' : theme

  function applyChoice(next: ThemeChoice) {
    if (next === 'auto') {
      window.localStorage.removeItem('proco.theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    } else {
      setTheme(next)
    }
  }

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-ink">Configurações</h1>
        <p className="text-sm text-mute">
          Preferências de aparência e conta.
        </p>
      </header>

      {/* Aparência */}
      <section className="bg-canvas dark:bg-surface-card-dark rounded-xl border border-hairline p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-ink">Aparência</h2>
          <p className="text-sm text-mute mt-1">
            Escolha como o sistema deve se apresentar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ThemeCard
            label="Claro"
            description="Fundo claro, alto contraste."
            icon={<SunIcon />}
            active={choice === 'light'}
            onClick={() => applyChoice('light')}
            preview="light"
          />
          <ThemeCard
            label="Escuro"
            description="Fundo escuro, menor cansaço visual."
            icon={<MoonIcon />}
            active={choice === 'dark'}
            onClick={() => applyChoice('dark')}
            preview="dark"
          />
          <ThemeCard
            label="Sistema"
            description="Segue a preferência do seu sistema operacional."
            icon={
              <span className="w-4 h-4 inline-flex items-center justify-center text-[10px] font-bold border border-current rounded">
                A
              </span>
            }
            active={choice === 'auto'}
            onClick={() => applyChoice('auto')}
            preview="auto"
          />
        </div>
      </section>

      {/* Conta */}
      <section className="bg-canvas dark:bg-surface-card-dark rounded-xl border border-hairline p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-ink">Conta</h2>
          <p className="text-sm text-mute mt-1">
            Informações da sessão atual.
          </p>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome" value={user?.name ?? '—'} />
          <Field label="E-mail" value={user?.email ?? '—'} />
          <Field label="Função" value={user?.role ?? '—'} />
          <Field label="Sessão" value="Local (stub)" />
        </dl>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red/5 transition-colors"
        >
          <LogoutIcon />
          Encerrar sessão
        </button>
      </section>

      {/* Notificações — placeholder */}
      <section className="bg-canvas dark:bg-surface-card-dark rounded-xl border border-hairline p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Notificações</h2>
            <p className="text-sm text-mute mt-1">
              Em breve — preferência por canal (e-mail, push, in-app).
            </p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700">
            Em construção
          </span>
        </div>
      </section>
    </div>
  )
}

function ThemeCard({
  label,
  description,
  icon,
  active,
  onClick,
  preview,
}: {
  label: string
  description: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
  preview: 'light' | 'dark' | 'auto'
}) {
  // Mini preview bar — palette-only, no accent color here so the picker
  // is visually neutral about which accent color belongs to which theme.
  const previewBg =
    preview === 'dark'
      ? 'bg-surface-dark'
      : preview === 'auto'
        ? 'bg-gradient-to-r from-canvas to-surface-dark'
        : 'bg-canvas border border-hairline'

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`text-left rounded-xl border p-4 transition-all ${
        active
          ? 'border-red ring-2 ring-red/30 bg-red/5'
          : 'border-hairline hover:border-red/40'
      }`}
    >
      <div className={`h-12 rounded-md mb-3 ${previewBg}`} />
      <div className="flex items-center gap-2 mb-1">
        <span className="text-ink">{icon}</span>
        <span className="text-sm font-semibold text-ink">{label}</span>
        {active && (
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-red">
            Ativo
          </span>
        )}
      </div>
      <p className="text-xs text-mute">{description}</p>
    </button>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-mute font-semibold">
        {label}
      </dt>
      <dd className="text-sm text-ink mt-1 break-words">{value}</dd>
    </div>
  )
}

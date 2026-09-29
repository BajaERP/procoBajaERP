import { useNavigate } from 'react-router-dom'
import { useTheme, type ThemePreference } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { LogoutIcon, MoonIcon, SunIcon } from '../components/icons'

export default function ConfiguracoesPage() {
  const { preference, setPreference } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function applyChoice(next: ThemePreference) {
    setPreference(next)
  }

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="w-full max-w-3xl min-w-0 p-4 sm:p-8 space-y-6 sm:space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-ink">Configurações</h1>
        <p className="text-sm text-mute">
          Preferências de aparência e conta.
        </p>
      </header>

      {/* Aparência */}
      <section className="bg-canvas dark:bg-surface-card-dark rounded-lg border border-hairline dark:border-hairline-dark p-4 sm:p-6 space-y-4">
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
            active={preference === 'light'}
            onClick={() => applyChoice('light')}
            preview="light"
          />
          <ThemeCard
            label="Escuro"
            description="Fundo escuro, menor cansaço visual."
            icon={<MoonIcon />}
            active={preference === 'dark'}
            onClick={() => applyChoice('dark')}
            preview="dark"
          />
          <ThemeCard
            label="Sistema"
            description="Segue a preferência do seu sistema operacional."
            icon={
              <span className="w-4 h-4 inline-flex items-center justify-center text-[10px] font-bold border border-current rounded-md">
                A
              </span>
            }
            active={preference === 'auto'}
            onClick={() => applyChoice('auto')}
            preview="auto"
          />
        </div>
      </section>

      {/* Conta */}
      <section className="bg-canvas dark:bg-surface-card-dark rounded-lg border border-hairline dark:border-hairline-dark p-4 sm:p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-ink">Conta</h2>
          <p className="text-sm text-mute mt-1">
            Informações da sessão atual.
          </p>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome" value={user?.name ?? '—'} />
          <Field label="RA" value={user?.ra ?? '—'} />
          <Field label="Função" value={user ? 'Gestor (demonstração)' : '—'} />
          <Field label="Sessão" value="Demonstração local; sem autenticação no servidor" />
        </dl>

        <button
          onClick={handleLogout}
          className="inline-flex min-h-10 items-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-sm font-medium hover:bg-red/5 transition-colors"
        >
          <LogoutIcon />
          Encerrar sessão
        </button>
      </section>

      {/* Notificações — placeholder */}
      <section className="bg-canvas dark:bg-surface-card-dark rounded-lg border border-hairline dark:border-hairline-dark p-4 sm:p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Notificações</h2>
            <p className="text-sm text-mute mt-1">
              Em breve — preferência por canal (e-mail, push, in-app).
            </p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
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
      className={`text-left rounded-lg border border-hairline dark:border-hairline-dark p-4 transition-all ${
        active
          ? 'border-red dark:border-red-400 ring-2 ring-red/30 bg-red/5 dark:bg-red/10'
          : 'hover:border-red/40'
      }`}
    >
      <div className={`h-12 rounded-md mb-3 ${previewBg}`} />
      <div className="flex items-center gap-2 mb-1">
        <span className="text-ink">{icon}</span>
        <span className="text-sm font-semibold text-ink">{label}</span>
        {active && (
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-red dark:text-red-300">
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

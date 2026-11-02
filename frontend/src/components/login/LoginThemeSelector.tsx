import { useTheme } from '../../contexts/ThemeContext'

export function LoginThemeSelector() {
  const { theme, setPreference } = useTheme()
  return (
        <div className="mb-10 flex justify-center md:absolute md:right-[8.8%] md:top-8 md:mb-0">
          <div role="group" aria-label="Tema" className="inline-flex rounded-lg border border-hairline bg-canvas p-1">
            {(['light', 'dark'] as const).map((option) => (
              <button key={option} type="button" onClick={() => setPreference(option)} aria-pressed={theme === option}
                className={`min-h-11 min-w-16 rounded-md px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red ${theme === option ? 'bg-selected text-link' : 'text-body hover:bg-surface-card'}`}>
                {option === 'light' ? 'Claro' : 'Escuro'}
              </button>
            ))}
          </div>
        </div>
  )
}

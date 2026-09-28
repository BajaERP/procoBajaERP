import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogoMark } from '../components/Logo'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

// Default AFK screen — full-bleed wallpaper + center logo.
// Any click or keypress sends the user to /login. Already-authenticated
// users skip straight to /app/gestao.
export default function WelcomePage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { isAuthenticated } = useAuth()

  // Skip welcome for signed-in users
  useEffect(() => {
    if (isAuthenticated) navigate('/app/gestao', { replace: true })
  }, [isAuthenticated, navigate])

  // Any click or keypress goes to login
  useEffect(() => {
    const go = () => navigate('/login')
    window.addEventListener('keydown', go)
    return () => window.removeEventListener('keydown', go)
  }, [navigate])

  // The real boar logo carries its own brand-red background, so it reads
  // on either light or dark wallpaper without a tone swap. Hint color still
  // depends on the page bg for contrast.
  const hintColor =
    theme === 'dark' ? 'text-white/20' : 'text-mute'

  return (
    <div
      onClick={() => navigate('/login')}
      className="min-h-screen flex flex-col items-center justify-center cursor-pointer select-none font-sans bg-canvas dark:bg-surface-dark transition-colors"
    >
      <div className="relative flex flex-col items-center gap-5">
        <LogoMark size={120} />
        <div className="text-center">
          <p className="text-ink dark:text-white text-2xl font-bold tracking-[0.15em] transition-colors">
            PROCO BAJA
          </p>
          <p className="text-mute dark:text-white/40 text-sm tracking-widest uppercase mt-1 font-medium transition-colors">
            Sistema de Gestão
          </p>
        </div>
      </div>

      {/* Tap hint — kept minimal per spec. */}
      <p
        className={`absolute bottom-10 text-xs tracking-widest uppercase animate-pulse transition-colors ${hintColor}`}
      >
        Toque para continuar
      </p>
    </div>
  )
}

import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogoMark } from '../components/Logo'
import { useAuth } from '../contexts/AuthContext'

// Default AFK screen — full-bleed wallpaper + center logo.
// Any click or keypress sends the user to /login. Already-authenticated
// users skip straight to /app/gestao.
export default function WelcomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // Skip welcome for signed-in users
  useEffect(() => {
    if (isAuthenticated) navigate('/app/gestao', { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <main className="min-h-dvh w-full bg-canvas dark:bg-surface-dark font-sans transition-colors">
      <Link
        to="/login"
        aria-label="Abrir acesso de demonstração"
        className="relative flex min-h-dvh w-full flex-col items-center justify-center cursor-pointer select-none text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red"
      >
      <div className="relative flex flex-col items-center gap-5">
        <LogoMark size={120} />
        <div className="text-center">
          <h1 className="text-ink dark:text-white text-2xl font-bold tracking-[0.15em] transition-colors">
            PROCO BAJA
          </h1>
          <p className="text-mute text-sm tracking-widest uppercase mt-1 font-medium transition-colors">
            Sistema de Gestão
          </p>
        </div>
      </div>

      {/* Tap hint — kept minimal per spec. */}
      <p
        className="absolute bottom-10 text-xs tracking-widest uppercase text-mute transition-colors"
      >
        Toque para continuar
      </p>
      </Link>
    </main>
  )
}

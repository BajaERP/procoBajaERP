import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogoMark } from '../components/shared/Logo'
import { useAuth } from '../contexts/AuthContext'

export default function WelcomePage() {
	const navigate = useNavigate()
	const { isAuthenticated, isReady } = useAuth()
	const [leaving, setLeaving] = useState(false)

	useEffect(() => {
		if (!isReady) return
		if (isAuthenticated) {
			navigate('/app/dashboard', { replace: true })
			return
		}

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches
		const fadeTimer = window.setTimeout(() => setLeaving(true), 800)
		const navigationTimer = window.setTimeout(
			() => {
				navigate('/login', {
					replace: true,
					state: { fromIntroduction: true },
				})
			},
			reducedMotion ? 800 : 1100,
		)

		return () => {
			window.clearTimeout(fadeTimer)
			window.clearTimeout(navigationTimer)
		}
	}, [isAuthenticated, isReady, navigate])

	return (
		<main
			className={`flex min-h-dvh w-full items-center justify-center bg-canvas text-center font-sans transition-opacity duration-300 dark:bg-surface-dark ${leaving ? 'opacity-0' : 'opacity-100'}`}
		>
			<div className="flex flex-col items-center gap-5">
				<LogoMark size={120} className="intro-enter" />
				<div>
					<h1 className="intro-enter intro-title text-2xl font-bold tracking-[0.15em] text-ink dark:text-white">
						ProcoBaja ERP
					</h1>
					<p className="intro-enter intro-caption mt-1 text-sm font-medium uppercase tracking-widest text-mute">
						Sistema de Gestão
					</p>
				</div>
			</div>
		</main>
	)
}

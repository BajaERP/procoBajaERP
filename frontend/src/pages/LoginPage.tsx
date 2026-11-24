import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoginBrand } from '../components/pages/login/LoginBrand'
import { LoginForm } from '../components/pages/login/LoginForm'
import { LoginThemeSelector } from '../components/pages/login/LoginThemeSelector'

export default function LoginPage() {
	const navigate = useNavigate()
	const location = useLocation()
	const { isAuthenticated, isReady, demoNotice } = useAuth()
	const requestedDestination = (location.state as { from?: unknown } | null)
		?.from
	const destination =
		typeof requestedDestination === 'string' &&
		requestedDestination.startsWith('/app/')
			? requestedDestination
			: '/app/dashboard'

	useEffect(() => {
		if (isReady && isAuthenticated) navigate(destination, { replace: true })
	}, [destination, isAuthenticated, isReady, navigate])

	return (
		<main
			className={`min-h-dvh bg-surface-soft font-sans text-ink md:flex ${(location.state as { fromIntroduction?: boolean } | null)?.fromIntroduction ? 'login-enter' : ''}`}
		>
			<LoginBrand />
			<section className="relative flex flex-1 flex-col items-center px-6 pb-12 pt-6 sm:px-10 md:items-start md:px-[6.9%] md:pt-[174px]">
				<LoginThemeSelector />
				<div className="w-full max-w-[614px]">
					{import.meta.env.DEV && demoNotice && (
						<p
							role="status"
							className="mb-5 rounded-md border border-state-warning bg-state-warning-bg p-3 text-sm text-state-warning"
						>
							{demoNotice}
						</p>
					)}
					<h2 className="text-center text-[32px] font-bold leading-tight md:text-left">
						Acesse sua conta
					</h2>
					<p className="mt-3 text-center text-[15px] text-mute md:text-left">
						{import.meta.env.DEV
							? 'Entre com o RA e a senha para acessar a demonstração.'
							: 'Acesso indisponível até a integração com o servidor.'}
					</p>
					<LoginForm
						onSuccess={() =>
							navigate(destination, { replace: true })
						}
					/>
				</div>
			</section>
		</main>
	)
}

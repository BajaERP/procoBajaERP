import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoginBrand } from '../components/pages/login/LoginBrand'
import { LoginForm } from '../components/pages/login/LoginForm'
import { LoginThemeSelector } from '../components/pages/login/LoginThemeSelector'

export default function LoginPage() {
	const navigate = useNavigate()
	const location = useLocation()
	const { isAuthenticated } = useAuth()
	const requestedDestination = (location.state as { from?: unknown } | null)
		?.from
	const destination =
		typeof requestedDestination === 'string' &&
		requestedDestination.startsWith('/app/')
			? requestedDestination
			: '/app/dashboard'

	useEffect(() => {
		if (isAuthenticated) navigate(destination, { replace: true })
	}, [destination, isAuthenticated, navigate])

	return (
		<main
			className={`min-h-dvh bg-surface-soft font-sans text-ink md:flex ${(location.state as { fromIntroduction?: boolean } | null)?.fromIntroduction ? 'login-enter' : ''}`}
		>
			<LoginBrand />
			<section className="relative flex flex-1 flex-col items-center px-6 pb-12 pt-6 sm:px-10 md:items-start md:px-[6.9%] md:pt-[174px]">
				<LoginThemeSelector />
				<div className="w-full max-w-[614px]">
					<h2 className="text-center text-[32px] font-bold leading-tight md:text-left">
						Acesse sua conta
					</h2>
					<p className="mt-3 text-center text-[15px] text-mute md:text-left">
						Entre com o RA e a senha cadastrada no ERP.
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

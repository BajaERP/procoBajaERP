import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { AparenciaSection } from '../components/configuracoes/AparenciaSection'
import { ContaSection } from '../components/configuracoes/ContaSection'
import { NotificacoesSection } from '../components/configuracoes/NotificacoesSection'

export default function ConfiguracoesPage() {
	const { preference, setPreference } = useTheme()
	const { user, logout } = useAuth()
	const navigate = useNavigate()

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
			<AparenciaSection
				preference={preference}
				onChange={setPreference}
			/>
			<ContaSection user={user} onLogout={handleLogout} />
			<NotificacoesSection />
		</div>
	)
}

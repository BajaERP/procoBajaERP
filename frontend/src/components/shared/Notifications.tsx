import { Toaster } from 'sonner'
import { useTheme } from '../../contexts/ThemeContext'

export function Notifications({ id }: { id?: string }) {
	const { theme } = useTheme()
	return (
		<Toaster
			id={id}
			theme={theme}
			position="bottom-right"
			containerAriaLabel="Notificações"
			toastOptions={{
				style: {
					background: 'var(--color-surface-raised)',
					color: 'var(--color-ink)',
					borderColor: 'var(--color-hairline)',
					fontFamily: 'inherit',
				},
			}}
		/>
	)
}

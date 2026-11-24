import { Toaster, type ToasterProps } from 'sonner'
import { useTheme } from '../../contexts/ThemeContext'

type NotificationsProps = Pick<
	ToasterProps,
	'id' | 'position' | 'offset' | 'mobileOffset'
>

export function Notifications({
	id,
	position = 'bottom-right',
	offset,
	mobileOffset,
}: NotificationsProps) {
	const { theme } = useTheme()
	return (
		<Toaster
			id={id}
			theme={theme}
			position={position}
			offset={offset}
			mobileOffset={mobileOffset}
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

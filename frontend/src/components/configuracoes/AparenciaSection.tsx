import type { ThemePreference } from '../../contexts/ThemeContext'
import { Moon as MoonIcon, Sun as SunIcon } from 'lucide-react'

export function AparenciaSection({
	preference,
	onChange,
}: {
	preference: ThemePreference
	onChange: (value: ThemePreference) => void
}) {
	return (
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
					icon={<SunIcon size={16} aria-hidden="true" />}
					active={preference === 'light'}
					onClick={() => onChange('light')}
					preview="light"
				/>
				<ThemeCard
					label="Escuro"
					description="Fundo escuro, menor cansaço visual."
					icon={<MoonIcon size={16} aria-hidden="true" />}
					active={preference === 'dark'}
					onClick={() => onChange('dark')}
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
					onClick={() => onChange('auto')}
					preview="auto"
				/>
			</div>
		</section>
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
			? 'bg-theme-preview-dark border border-hairline'
			: preview === 'auto'
				? 'bg-gradient-to-r from-theme-preview-light to-theme-preview-dark border border-hairline'
				: 'bg-theme-preview-light border border-hairline'

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

import type { AuthUser } from '../../../contexts/AuthContext'
import { LogOut as LogoutIcon } from 'lucide-react'

const ROLE_LABELS = {
	gestor: 'Gestor',
	membro: 'Membro',
	financeiro: 'Financeiro',
	lider: 'Líder',
	capitao: 'Capitão',
	orientador: 'Orientador',
} as const

export function ContaSection({
	user,
	onLogout,
}: {
	user: AuthUser | null
	onLogout: () => void
}) {
	return (
		<section className="bg-canvas dark:bg-surface-card-dark rounded-lg border border-hairline dark:border-hairline-dark p-4 sm:p-6 space-y-4">
			<div>
				<h2 className="text-base font-semibold text-ink">Conta</h2>
				<p className="text-sm text-mute mt-1">
					Informações do usuário e vínculo com a equipe.
				</p>
			</div>

			<dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Field label="Nome" value={user?.name ?? '—'} />
				<Field
					label="RA"
					value={
						user?.ra && !user.ra.includes('@')
							? user.ra
							: 'Não disponível'
					}
				/>
				<Field
					label="Perfil"
					value={user ? ROLE_LABELS[user.role] : 'Não disponível'}
				/>
				<Field label="Subsistema" value="Não disponível" />
				<Field label="Situação" value="Não disponível" />
				<Field label="Data de cadastro" value="Não disponível" />
			</dl>

			<p className="text-xs text-mute">
				Sessão de demonstração. Os dados da conta ainda não estão
				conectados ao servidor.
			</p>

			<button
				onClick={onLogout}
				className="inline-flex min-h-10 items-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-sm font-medium hover:bg-red/5 transition-colors"
			>
				<LogoutIcon size={16} aria-hidden="true" />
				Encerrar sessão
			</button>
		</section>
	)
}

function Field({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt className="text-[11px] uppercase tracking-wider text-mute font-semibold">
				{label}
			</dt>
			<dd className="text-sm text-ink mt-1 break-words">{value}</dd>
		</div>
	)
}

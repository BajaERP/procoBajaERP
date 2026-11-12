import { useEffect, useRef, useState, type RefObject } from 'react'
import { Check, ChevronDown, Info, LockKeyhole, X } from 'lucide-react'
import type { UserRole } from '../../../contexts/AuthContext'
import { consultarPermissoesEquipe } from '../../../services/equipePermissions'

const PERFIS = [
	{ value: 'capitao', label: 'Capitão' },
	{ value: 'gestor', label: 'Gestor' },
	{ value: 'lider', label: 'Líder' },
	{ value: 'membro', label: 'Membro' },
	{ value: 'orientador', label: 'Orientador' },
	{
		value: 'gestor-financeiro',
		label: 'Gestor Financeiro · atribuição adicional',
	},
] as const

type Perspectiva = (typeof PERFIS)[number]['value']

interface Props {
	perfil: UserRole
	financial: boolean
	onClose: () => void
	returnFocusRef: RefObject<HTMLAnchorElement | null>
}

export function PermissoesDialog({
	perfil,
	financial,
	onClose,
	returnFocusRef,
}: Props) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [perspectiva, setPerspectiva] = useState<Perspectiva>(
		perfil === 'gestor' && financial ? 'gestor-financeiro' : perfil,
	)
	const comAtribuicao = perspectiva === 'gestor-financeiro'
	const permissoes = consultarPermissoesEquipe(
		perfil,
		comAtribuicao ? 'gestor' : perspectiva,
		comAtribuicao,
	)
	const label = PERFIS.find((item) => item.value === perspectiva)!.label

	useEffect(() => {
		const dialog = dialogRef.current
		dialog?.showModal()
		return () => {
			dialog?.close()
			returnFocusRef.current?.focus()
		}
	}, [returnFocusRef])

	if (!permissoes) return null

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby="permissoes-title"
			aria-describedby="permissoes-description"
			onCancel={(event) => {
				event.preventDefault()
				onClose()
			}}
			onClick={(event) => {
				if (event.target === event.currentTarget) {
					const bounds = event.currentTarget.getBoundingClientRect()
					if (
						event.clientX < bounds.left ||
						event.clientX > bounds.right
					)
						onClose()
				}
			}}
			className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-[600px] flex-col border-l border-hairline bg-surface-card p-0 text-body shadow-xl backdrop:bg-black/50 open:flex"
		>
			<header className="flex shrink-0 items-start gap-3 border-b border-hairline px-4 py-4 sm:px-7 sm:py-6">
				<div className="min-w-0 flex-1">
					<h2
						id="permissoes-title"
						className="text-xl font-bold text-ink"
					>
						Perfis e permissões
					</h2>
					<p
						id="permissoes-description"
						className="mt-2 text-sm text-mute"
					>
						Consulte as permissões fixas de cada perfil.
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					aria-label="Fechar matriz de permissões"
					className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-mute hover:bg-surface-raised hover:text-ink"
				>
					<X size={20} aria-hidden="true" />
				</button>
			</header>

			<div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
				<p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-mute">
					<LockKeyhole size={14} aria-hidden="true" /> Somente
					consulta
				</p>
				<label
					htmlFor="perfil-consultado"
					className="mb-2 block text-sm font-medium text-body"
				>
					Perfil selecionado
				</label>
				<div className="relative">
					<select
						id="perfil-consultado"
						value={perspectiva}
						onChange={(event) =>
							setPerspectiva(event.target.value as Perspectiva)
						}
						className="min-h-11 w-full appearance-none rounded-md border border-hairline bg-surface-soft py-2 pr-10 pl-3 text-sm text-ink"
					>
						{PERFIS.map((item) => (
							<option key={item.value} value={item.value}>
								{item.label}
							</option>
						))}
					</select>
					<ChevronDown
						size={16}
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-mute"
					/>
				</div>
				<p className="mt-3 text-sm leading-relaxed text-mute">
					{comAtribuicao
						? 'Gestor Financeiro é um Gestor com atribuição adicional. Conserva as funções de Gestor e recebe as funções financeiras.'
						: 'Selecionar um perfil apenas muda esta consulta; as permissões da sua conta permanecem as mesmas.'}
				</p>

				<section
					aria-labelledby="permissoes-perfil-title"
					className="mt-6"
				>
					<h3
						id="permissoes-perfil-title"
						className="text-sm font-semibold text-ink"
					>
						Permissões de {label}
					</h3>
					<ul className="mt-3 space-y-2">
						{permissoes.map((permissao) => (
							<li
								key={permissao.id}
								className="flex items-start gap-3 rounded-lg bg-surface-raised p-3 sm:p-4"
							>
								{permissao.permitido ? (
									<Check
										size={19}
										aria-hidden="true"
										className="mt-0.5 shrink-0 text-state-success"
									/>
								) : (
									<X
										size={19}
										aria-hidden="true"
										className="mt-0.5 shrink-0 text-state-warning"
									/>
								)}
								<div className="min-w-0 text-sm">
									<p className="font-medium text-ink">
										{permissao.acao}
									</p>
									<p className="mt-1 text-mute">
										{permissao.escopo ??
											(permissao.permitido
												? 'Permitido'
												: 'Não permitido')}
									</p>
								</div>
							</li>
						))}
					</ul>
				</section>

				<aside className="mt-5 rounded-lg bg-state-info-bg p-4 text-sm leading-relaxed text-state-info">
					<div className="flex items-start gap-2">
						<Info
							size={18}
							className="mt-0.5 shrink-0"
							aria-hidden="true"
						/>
						<p>
							Só o Capitão administra contas Gestor e a atribuição
							financeira. Ninguém altera o próprio nome,
							identificador ou perfil, nem desativa a própria
							conta.
						</p>
					</div>
					<p className="mt-3">
						Em operações comuns, o Líder precisa ser substituído
						antes de sair do subsistema, ser desativado ou mudar de
						perfil. Na desativação do subsistema, passa a Membro. O
						último Capitão ativo não pode ser desativado ou deixar o
						perfil. Antes de desativar o Gestor Financeiro ou mudar
						seu perfil, retire ou transfira a atribuição.
					</p>
				</aside>
				<p className="mt-4 text-xs leading-relaxed text-mute">
					Consulta demonstrativa das regras do módulo. Alguns fluxos
					ainda estão em construção.
				</p>
			</div>

			<footer className="shrink-0 border-t border-hairline px-4 py-3 sm:px-7 sm:py-5">
				<button
					type="button"
					onClick={onClose}
					className="min-h-11 w-full rounded-md bg-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-pressed"
				>
					Fechar matriz
				</button>
			</footer>
		</dialog>
	)
}

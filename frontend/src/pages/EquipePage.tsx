import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Plus, RotateCcw, ShieldCheck } from 'lucide-react'
import { useAuth, type AuthUser } from '../contexts/AuthContext'
import { PermissoesDialog } from '../components/pages/equipe/PermissoesDialog'
import { podeConsultarPermissoes } from '../services/equipePermissions'
import { IntegrantesList } from '../components/pages/equipe/IntegrantesList'
import { equipeService } from '../services/equipe'
import type {
	ConsultaIntegrantes,
	ResumoSubsistemas,
} from '../services/equipeTypes'
import { perfisParaCadastro } from '../services/cadastroIntegrante'
import { CadastroIntegranteDialog } from '../components/pages/equipe/CadastroIntegranteDialog'
import { AdministrarIntegranteDialog } from '../components/pages/equipe/AdministrarIntegranteDialog'
import { SubsistemasContent } from '../components/pages/equipe/SubsistemasContent'
import { ResponsabilidadeFinanceiraContent } from '../components/pages/equipe/ResponsabilidadeFinanceiraContent'
import { getEquipePageContentKeys } from './equipePageKeys'
import { Notifications } from '../components/shared/Notifications'

type LoadState =
	| { status: 'loading' }
	| { status: 'ready'; data: ConsultaIntegrantes }
	| { status: 'error'; message: string }

export default function EquipePage() {
	const { user, demoRevision } = useAuth()
	const pageKeys = getEquipePageContentKeys(
		user?.id ?? '',
		user?.role ?? '',
		demoRevision,
	)
	const location = useLocation()
	const navigate = useNavigate()
	const permissoesLinkRef = useRef<HTMLAnchorElement>(null)
	const permissoes = location.pathname.endsWith('/permissoes')
	const podeConsultar = Boolean(user && podeConsultarPermissoes(user.role))
	const origem =
		location.state?.returnTo === '/app/equipe/subsistemas'
			? '/app/equipe/subsistemas'
			: '/app/equipe/integrantes'
	const subsistemas =
		location.pathname.endsWith('/subsistemas') ||
		(permissoes && origem.endsWith('/subsistemas'))
	const responsabilidadeFinanceira = location.pathname.endsWith('/financeiro')
	const [cadastroAtor, setCadastroAtor] = useState<string | null>(null)
	const [detalheIntegrante, setDetalheIntegrante] = useState<string | null>(
		null,
	)
	const [resumoSubsistemas, setResumoSubsistemas] =
		useState<ResumoSubsistemas | null>(null)
	const [createSubsystemRequest, setCreateSubsystemRequest] = useState(false)
	const podeCadastrar =
		import.meta.env.DEV &&
		!!user &&
		perfisParaCadastro(user.role).length > 0
	const podeAdministrarSubsistemas =
		import.meta.env.DEV &&
		!!user &&
		['capitao', 'gestor'].includes(user.role)
	useEffect(() => {
		setCadastroAtor(null)
		setDetalheIntegrante(null)
		setResumoSubsistemas(null)
		setCreateSubsystemRequest(false)
	}, [user?.id, user?.role, location.pathname])

	return (
		<>
			<Notifications
				id="responsabilidade-financeira"
				position="top-center"
				offset={{ top: 72 }}
				mobileOffset={{ top: 12, left: 16, right: 16 }}
			/>
			<div
				className={`mx-auto w-full max-w-7xl min-w-0 px-4 py-6 sm:px-8 sm:py-10 ${subsistemas && podeAdministrarSubsistemas ? 'pb-24 md:pb-10' : ''}`}
			>
				<header className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
							Equipe e subsistemas
						</h1>
						<p className="mt-1 text-sm text-mute">
							Organize as pessoas e as áreas do projeto em um só
							lugar.
						</p>
						{subsistemas && resumoSubsistemas && (
							<p className="mt-2 text-sm text-mute">
								{resumoSubsistemas.subsistemasAtivos}{' '}
								subsistemas ativos
								{resumoSubsistemas.integrantesAssociados !==
									null &&
									` · ${resumoSubsistemas.integrantesAssociados} integrantes associados`}
							</p>
						)}
					</div>
					{import.meta.env.DEV && podeConsultar && (
						<Link
							ref={permissoesLinkRef}
							to="/app/equipe/permissoes"
							state={{ returnTo: location.pathname }}
							className="inline-flex min-h-11 items-center gap-2 rounded-md border border-hairline bg-surface-card px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-raised"
						>
							<ShieldCheck size={17} aria-hidden="true" />
							Perfis e permissões
						</Link>
					)}
					{subsistemas && podeAdministrarSubsistemas ? (
						<div className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-surface-card px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:static md:border-0 md:bg-transparent md:p-0">
							<button
								type="button"
								onClick={() => setCreateSubsystemRequest(true)}
								className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed md:w-auto"
							>
								<Plus size={18} aria-hidden="true" /> Novo
								subsistema
							</button>
						</div>
					) : podeCadastrar &&
					  !subsistemas &&
					  !responsabilidadeFinanceira ? (
						<button
							type="button"
							onClick={() => setCadastroAtor(user.id)}
							className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed sm:w-auto"
						>
							<Plus size={18} aria-hidden="true" />
							Novo integrante
						</button>
					) : null}
				</header>

				<nav
					aria-label="Áreas de Equipe e Subsistemas"
					className="mt-7 flex min-w-0 gap-1 border-b border-hairline"
				>
					{[
						{
							label: 'Integrantes',
							to: '/app/equipe/integrantes',
							active: !subsistemas,
						},
						{
							label: 'Subsistemas',
							to: '/app/equipe/subsistemas',
							active: subsistemas,
						},
					].map((tab) => (
						<Link
							key={tab.to}
							to={tab.to}
							aria-current={tab.active ? 'page' : undefined}
							className={`relative inline-flex min-h-11 min-w-0 flex-1 items-center justify-center px-1 text-center text-xs font-semibold transition-colors sm:flex-none sm:px-3 sm:text-sm ${tab.active ? 'text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:bg-red-light' : 'text-mute hover:text-ink'}`}
						>
							{tab.label}
						</Link>
					))}
				</nav>

				{!import.meta.env.DEV ? (
					<section
						role="status"
						className="mt-6 rounded-lg border border-hairline bg-surface-card p-6 text-sm text-body"
					>
						<h2 className="text-lg font-semibold text-ink">
							Módulo indisponível
						</h2>
						<p className="mt-2">
							A consulta de Equipe e Subsistemas estará disponível
							após a integração com o servidor.
						</p>
					</section>
				) : permissoes && !podeConsultar ? (
					<section
						role="status"
						className="mt-6 rounded-lg border border-hairline bg-surface-card p-6 text-sm text-body"
					>
						<h2 className="text-lg font-semibold text-ink">
							Consulta restrita
						</h2>
						<p className="mt-2">
							A matriz de permissões está disponível para Capitão
							e Gestor.
						</p>
						<Link
							to="/app/equipe/integrantes"
							className="mt-4 inline-flex min-h-11 items-center rounded-md text-link underline underline-offset-4"
						>
							Voltar para integrantes
						</Link>
					</section>
				) : subsistemas && user ? (
					<SubsistemasContent
						key={pageKeys.subsistemas}
						user={user}
						createRequest={createSubsystemRequest}
						onCreateRequestConsumed={() =>
							setCreateSubsystemRequest(false)
						}
						onSummary={setResumoSubsistemas}
					/>
				) : user ? (
					<IntegrantesContent
						key={pageKeys.integrantes}
						user={user}
						onOpen={setDetalheIntegrante}
						onOpenFinancial={() =>
							navigate('/app/equipe/financeiro')
						}
					/>
				) : null}
				{import.meta.env.DEV && user && responsabilidadeFinanceira && (
					<ResponsabilidadeFinanceiraContent
						key={pageKeys.financeiro}
						user={user}
						onClose={() => navigate('/app/equipe/integrantes')}
					/>
				)}
				{import.meta.env.DEV && permissoes && podeConsultar && user && (
					<PermissoesDialog
						key={pageKeys.permissoes}
						perfil={user.role}
						financial={user.financial}
						onClose={() => navigate(origem, { replace: true })}
						returnFocusRef={permissoesLinkRef}
					/>
				)}
				{cadastroAtor === user?.id && podeCadastrar && !subsistemas && (
					<CadastroIntegranteDialog
						key={`${user.id}:${user.role}`}
						atorId={user.id}
						onClose={() => setCadastroAtor(null)}
					/>
				)}
				{user && detalheIntegrante && !subsistemas && (
					<AdministrarIntegranteDialog
						key={`${user.id}:${detalheIntegrante}`}
						ator={user}
						integranteId={detalheIntegrante}
						onClose={() => setDetalheIntegrante(null)}
					/>
				)}
			</div>
		</>
	)
}

function IntegrantesContent({
	user,
	onOpen,
	onOpenFinancial,
}: {
	user: AuthUser
	onOpen: (id: string) => void
	onOpenFinancial: () => void
}) {
	const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })
	const [attempt, setAttempt] = useState(0)

	useEffect(() => {
		let cancelled = false
		equipeService
			.listarIntegrantes({
				id: user.id,
				perfil: user.role,
				subsistemaId: user.subsistemaId,
			})
			.then((data) => {
				if (!cancelled) setLoadState({ status: 'ready', data })
			})
			.catch((error: unknown) => {
				if (!cancelled)
					setLoadState({
						status: 'error',
						message:
							error instanceof Error
								? error.message
								: 'Não foi possível carregar os integrantes.',
					})
			})
		return () => {
			cancelled = true
		}
	}, [user.id, user.role, attempt])

	function retry() {
		setLoadState({ status: 'loading' })
		setAttempt((value) => value + 1)
	}

	async function simulateFailure() {
		await equipeService.simularFalhaNaProximaConsulta?.()
		retry()
	}

	return loadState.status === 'loading' ? (
		<section role="status" aria-live="polite" className="mt-6 space-y-4">
			<p className="text-sm text-mute">
				Carregando integrantes demonstrativos...
			</p>
			<div className="h-16 animate-pulse rounded-lg bg-surface-card motion-reduce:animate-none" />
			<div className="h-48 animate-pulse rounded-lg bg-surface-card motion-reduce:animate-none" />
		</section>
	) : loadState.status === 'error' ? (
		<section
			role="alert"
			className="mt-6 rounded-lg border border-state-error bg-state-error-bg p-6"
		>
			<div className="flex items-start gap-3 text-state-error">
				<AlertCircle
					size={20}
					className="mt-0.5 shrink-0"
					aria-hidden="true"
				/>
				<div>
					<h2 className="font-semibold">
						Falha ao consultar integrantes
					</h2>
					<p className="mt-1 text-sm">{loadState.message}</p>
				</div>
			</div>
			<button
				type="button"
				onClick={retry}
				className="mt-4 inline-flex items-center gap-2 rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft"
			>
				<RotateCcw size={16} aria-hidden="true" /> Tentar novamente
			</button>
		</section>
	) : (
		<>
			<IntegrantesList
				data={loadState.data}
				onOpen={onOpen}
				onOpenFinancial={onOpenFinancial}
			/>
			<div className="mt-4 flex justify-end">
				<button
					type="button"
					onClick={simulateFailure}
					className="text-xs text-mute underline underline-offset-4 hover:text-ink"
				>
					Simular falha na próxima consulta
				</button>
			</div>
		</>
	)
}

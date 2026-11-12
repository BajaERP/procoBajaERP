import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AlertCircle, Plus, RotateCcw } from 'lucide-react'
import { useAuth, type AuthUser } from '../contexts/AuthContext'
import { IntegrantesList } from '../components/pages/equipe/IntegrantesList'
import { equipeService } from '../services/equipe'
import type { ConsultaIntegrantes } from '../services/equipeTypes'
import { perfisParaCadastro } from '../services/cadastroIntegrante'
import { CadastroIntegranteDialog } from '../components/pages/equipe/CadastroIntegranteDialog'
import { AdministrarIntegranteDialog } from '../components/pages/equipe/AdministrarIntegranteDialog'
import { SubsistemasContent } from '../components/pages/equipe/SubsistemasContent'

type LoadState =
	| { status: 'loading' }
	| { status: 'ready'; data: ConsultaIntegrantes }
	| { status: 'error'; message: string }

export default function EquipePage() {
	const { user, demoRevision } = useAuth()
	const location = useLocation()
	const subsistemas = location.pathname.endsWith('/subsistemas')
	const [cadastroAtor, setCadastroAtor] = useState<string | null>(null)
	const [detalheIntegrante, setDetalheIntegrante] = useState<string | null>(
		null,
	)
	const podeCadastrar =
		import.meta.env.DEV &&
		!!user &&
		perfisParaCadastro(user.role).length > 0
	useEffect(() => {
		setCadastroAtor(null)
		setDetalheIntegrante(null)
	}, [user?.id, user?.role, location.pathname])

	return (
		<div className="mx-auto w-full max-w-7xl min-w-0 px-4 py-6 sm:px-8 sm:py-10">
			<header className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
						Equipe e subsistemas
					</h1>
					<p className="mt-1 text-sm text-mute">
						Organize as pessoas e as áreas do projeto em um só
						lugar.
					</p>
				</div>
				{podeCadastrar && !subsistemas && (
					<button
						type="button"
						onClick={() => setCadastroAtor(user.id)}
						className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed sm:w-auto"
					>
						<Plus size={18} aria-hidden="true" />
						Novo integrante
					</button>
				)}
			</header>

			<nav
				aria-label="Áreas de Equipe e Subsistemas"
				className="mt-7 flex gap-2 border-b border-hairline"
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
						className={`relative inline-flex min-h-11 items-center px-3 text-sm font-semibold transition-colors ${tab.active ? 'text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:bg-red-light' : 'text-mute hover:text-ink'}`}
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
			) : subsistemas && user ? (
				<SubsistemasContent
					key={`${user.id}:${user.role}:${demoRevision}`}
					user={user}
				/>
			) : user ? (
				<IntegrantesContent
					key={`${user.id}:${user.role}:${demoRevision}`}
					user={user}
					onOpen={setDetalheIntegrante}
				/>
			) : null}
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
	)
}

function IntegrantesContent({
	user,
	onOpen,
}: {
	user: AuthUser
	onOpen: (id: string) => void
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
			<IntegrantesList data={loadState.data} onOpen={onOpen} />
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

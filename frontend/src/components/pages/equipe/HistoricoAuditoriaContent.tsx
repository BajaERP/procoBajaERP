import { useEffect, useState } from 'react'
import {
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	History,
	RotateCcw,
} from 'lucide-react'
import type { AuthUser } from '../../../contexts/AuthContext'
import { equipeService } from '../../../services/equipe'
import type {
	ConsultaAuditoria,
	EventoAuditoria,
	FiltrosAuditoria,
} from '../../../services/equipeTypes'

const PAGE_SIZE = 10

const ACTIONS = [
	{ value: 'CADASTRADO', label: 'Cadastro' },
	{ value: 'CRIADO', label: 'Criação de subsistema' },
	{ value: 'EDITADO', label: 'Edição' },
	{ value: 'LIDER_DEFINIDO', label: 'Liderança definida' },
	{ value: 'ATIVADO', label: 'Subsistema ativado' },
	{ value: 'DESATIVADO', label: 'Desativação' },
	{ value: 'PERFIL_ALTERADO', label: 'Alteração de perfil' },
	{ value: 'TRANSFERIDO', label: 'Transferência' },
	{ value: 'REATIVADO', label: 'Reativação' },
	{ value: 'SENHA_REDEFINIDA', label: 'Redefinição de senha' },
] as const

type LoadState =
	| { status: 'loading' }
	| { status: 'ready'; data: ConsultaAuditoria }
	| { status: 'error'; message: string }

function labelAction(action: string) {
	return (
		ACTIONS.find((item) => item.value === action)?.label ??
		action.toLocaleLowerCase('pt-BR').replaceAll('_', ' ')
	)
}

function labelEntity(entity: EventoAuditoria['entidade']) {
	return entity === 'USUARIO' ? 'Integrante' : 'Subsistema'
}

function formatDate(value: string) {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return 'Data indisponível'
	return new Intl.DateTimeFormat('pt-BR', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(date)
}

function scopeLabel(event: EventoAuditoria) {
	const { subsistemaOrigem: origin, subsistemaDestino: destination } = event
	if (origin && destination) {
		if (origin.id === destination.id) return `Subsistema ${origin.nome}`
		return `De ${origin.nome} para ${destination.nome}`
	}
	if (origin) return `Origem: ${origin.nome}`
	if (destination) return `Destino: ${destination.nome}`
	return 'Sem escopo registrado'
}

function EventoCard({ evento }: { evento: EventoAuditoria }) {
	return (
		<li className="min-w-0 rounded-lg border border-hairline bg-surface-card p-4 sm:p-5">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<span className="rounded-full bg-selected px-2.5 py-1 text-xs font-semibold text-link">
							{labelEntity(evento.entidade)}
						</span>
						<span className="rounded-full bg-surface-raised px-2.5 py-1 text-xs font-medium capitalize text-body">
							{labelAction(evento.acao)}
						</span>
					</div>
					<h3 className="mt-3 break-words text-sm font-semibold text-ink sm:text-base">
						{evento.descricao}
					</h3>
				</div>
				<time
					dateTime={evento.registradoEm}
					className="shrink-0 text-xs text-mute sm:text-right"
				>
					{formatDate(evento.registradoEm)}
				</time>
			</div>
			<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mute">
				<span>Por {evento.atorNome}</span>
				<span>{scopeLabel(evento)}</span>
			</div>
		</li>
	)
}

export function HistoricoAuditoriaContent({
	user,
	revision,
}: {
	user: AuthUser
	revision: number
}) {
	const [entidade, setEntidade] = useState<FiltrosAuditoria['entidade']>('')
	const [acao, setAcao] = useState('')
	const [page, setPage] = useState(0)
	const [attempt, setAttempt] = useState(0)
	const [state, setState] = useState<LoadState>({ status: 'loading' })

	useEffect(() => {
		let active = true
		setState({ status: 'loading' })
		const filtros: FiltrosAuditoria = {
			page,
			size: PAGE_SIZE,
			entidade,
			acao,
		}
		equipeService
			.consultarAuditoria(
				{
					id: user.id,
					perfil: user.role,
					subsistemaId: user.subsistemaId,
				},
				filtros,
			)
			.then((data) => {
				if (active) setState({ status: 'ready', data })
			})
			.catch((error: unknown) => {
				if (active)
					setState({
						status: 'error',
						message:
							error instanceof Error
								? error.message
								: 'Não foi possível carregar o histórico de auditoria.',
					})
			})
		return () => {
			active = false
		}
	}, [
		acao,
		entidade,
		page,
		attempt,
		revision,
		user.id,
		user.role,
		user.subsistemaId,
	])

	function retry() {
		setState({ status: 'loading' })
		setAttempt((value) => value + 1)
	}

	async function simulateFailure() {
		await equipeService.simularFalhaNaProximaConsulta?.()
		retry()
	}

	return (
		<section
			aria-labelledby="historico-auditoria-heading"
			className="mt-5 min-w-0"
		>
			<div className="flex items-start gap-3">
				<span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-selected text-link">
					<History size={20} aria-hidden="true" />
				</span>
				<div className="min-w-0">
					<h2
						id="historico-auditoria-heading"
						className="text-lg font-bold text-ink"
					>
						Histórico de auditoria
					</h2>
					<p className="mt-1 max-w-3xl text-sm leading-relaxed text-mute">
						Acompanhe as alterações registradas em Equipe e
						Subsistemas. O histórico respeita o escopo do seu
						perfil.
					</p>
				</div>
			</div>

			<div className="mt-5 grid gap-3 rounded-lg border border-hairline bg-surface-card p-4 sm:grid-cols-2 sm:p-5">
				<div className="min-w-0">
					<label
						htmlFor="auditoria-entidade"
						className="mb-1.5 block text-xs font-medium text-body"
					>
						Tipo de registro
					</label>
					<select
						id="auditoria-entidade"
						value={entidade}
						onChange={(event) => {
							setEntidade(
								event.target
									.value as FiltrosAuditoria['entidade'],
							)
							setPage(0)
						}}
						className="min-h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink dark:[color-scheme:dark]"
					>
						<option value="">Todos os registros</option>
						<option value="USUARIO">Integrantes</option>
						<option value="SUBSISTEMA">Subsistemas</option>
					</select>
				</div>
				<div className="min-w-0">
					<label
						htmlFor="auditoria-acao"
						className="mb-1.5 block text-xs font-medium text-body"
					>
						Alteração
					</label>
					<select
						id="auditoria-acao"
						value={acao}
						onChange={(event) => {
							setAcao(event.target.value)
							setPage(0)
						}}
						className="min-h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink dark:[color-scheme:dark]"
					>
						<option value="">Todas as alterações</option>
						{ACTIONS.map((item) => (
							<option key={item.value} value={item.value}>
								{item.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{state.status === 'loading' ? (
				<div
					role="status"
					aria-live="polite"
					className="mt-4 space-y-3"
				>
					<p className="text-sm text-mute">Carregando histórico...</p>
					<div className="h-24 animate-pulse rounded-lg bg-surface-card motion-reduce:animate-none" />
					<div className="h-24 animate-pulse rounded-lg bg-surface-card motion-reduce:animate-none" />
				</div>
			) : state.status === 'error' ? (
				<div
					role="alert"
					className="mt-4 rounded-lg border border-state-error bg-state-error-bg p-5"
				>
					<div className="flex items-start gap-3 text-state-error">
						<AlertCircle
							size={20}
							className="mt-0.5 shrink-0"
							aria-hidden="true"
						/>
						<div className="min-w-0">
							<h3 className="font-semibold">
								Falha ao consultar o histórico
							</h3>
							<p className="mt-1 break-words text-sm">
								{state.message}
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={retry}
						className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
					>
						<RotateCcw size={16} aria-hidden="true" /> Tentar
						novamente
					</button>
				</div>
			) : state.data.content.length === 0 ? (
				<div
					role="status"
					className="mt-4 rounded-lg border border-hairline bg-surface-card px-5 py-10 text-center"
				>
					<h3 className="font-semibold text-ink">
						Nenhuma alteração encontrada
					</h3>
					<p className="mt-1 text-sm text-mute">
						Ajuste os filtros ou volte mais tarde para consultar
						novos registros.
					</p>
				</div>
			) : (
				<>
					<p className="mt-4 text-xs text-mute" aria-live="polite">
						{state.data.totalElements}{' '}
						{state.data.totalElements === 1
							? 'registro encontrado'
							: 'registros encontrados'}
					</p>
					<ol
						aria-label="Eventos de auditoria"
						className="mt-2 space-y-2"
					>
						{state.data.content.map((evento) => (
							<EventoCard key={evento.id} evento={evento} />
						))}
					</ol>
					<nav
						aria-label="Paginação do histórico"
						className="mt-4 flex flex-wrap items-center justify-between gap-3"
					>
						<p className="text-xs text-mute">
							Página {state.data.page + 1} de{' '}
							{Math.max(state.data.totalPages, 1)}
						</p>
						<div className="flex items-center gap-2">
							<button
								type="button"
								disabled={state.data.page <= 0}
								onClick={() =>
									setPage((value) => Math.max(0, value - 1))
								}
								className="inline-flex min-h-11 items-center gap-1 rounded-md border border-hairline bg-surface-card px-3 text-sm font-medium text-ink hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50"
							>
								<ChevronLeft size={17} aria-hidden="true" />{' '}
								Anterior
							</button>
							<button
								type="button"
								disabled={
									state.data.page + 1 >= state.data.totalPages
								}
								onClick={() => setPage((value) => value + 1)}
								className="inline-flex min-h-11 items-center gap-1 rounded-md border border-hairline bg-surface-card px-3 text-sm font-medium text-ink hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50"
							>
								Próxima{' '}
								<ChevronRight size={17} aria-hidden="true" />
							</button>
						</div>
					</nav>
				</>
			)}

			{import.meta.env.DEV && (
				<div className="mt-3 flex justify-end">
					<button
						type="button"
						onClick={simulateFailure}
						className="min-h-11 text-left text-xs text-mute underline underline-offset-4 hover:text-ink"
					>
						Simular falha na próxima consulta
					</button>
				</div>
			)}
		</section>
	)
}

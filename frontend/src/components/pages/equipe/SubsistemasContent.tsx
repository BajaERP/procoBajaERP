import { useEffect, useState } from 'react'
import { AlertCircle, Plus, RotateCcw } from 'lucide-react'
import type { AuthUser } from '../../../contexts/AuthContext'
import { equipeService } from '../../../services/equipe'
import type { ConsultaSubsistemas } from '../../../services/equipeTypes'
import { AdministrarSubsistemaDialog } from './AdministrarSubsistemaDialog'
import { SubsistemasList } from './SubsistemasList'

type LoadState =
	| { status: 'loading' }
	| { status: 'ready'; data: ConsultaSubsistemas }
	| { status: 'error'; message: string }

export function SubsistemasContent({ user }: { user: AuthUser }) {
	const [state, setState] = useState<LoadState>({ status: 'loading' })
	const [attempt, setAttempt] = useState(0)
	const [editor, setEditor] = useState<string | 'new' | null>(null)
	const podeAdministrar =
		import.meta.env.DEV && ['capitao', 'gestor'].includes(user.role)

	useEffect(() => {
		let active = true
		setState({ status: 'loading' })
		equipeService
			.listarSubsistemas({
				id: user.id,
				perfil: user.role,
				subsistemaId: user.subsistemaId,
			})
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
								: 'Não foi possível carregar os subsistemas.',
					})
			})
		return () => {
			active = false
		}
	}, [user.id, user.role, user.subsistemaId, attempt])

	function retry() {
		setState({ status: 'loading' })
		setAttempt((value) => value + 1)
	}

	async function simulateFailure() {
		await equipeService.simularFalhaNaProximaConsulta?.()
		retry()
	}

	const selected =
		state.status === 'ready' && editor !== null && editor !== 'new'
			? (state.data.subsistemas.find((item) => item.id === editor) ??
				null)
			: null

	return (
		<>
			{state.status === 'loading' ? (
				<section
					role="status"
					aria-live="polite"
					className="mt-6 space-y-4"
				>
					<p className="text-sm text-mute">
						Carregando subsistemas...
					</p>
					<div className="h-24 animate-pulse rounded-lg bg-surface-card motion-reduce:animate-none" />
					<div className="h-24 animate-pulse rounded-lg bg-surface-card motion-reduce:animate-none" />
				</section>
			) : state.status === 'error' ? (
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
								Falha ao consultar subsistemas
							</h2>
							<p className="mt-1 text-sm">{state.message}</p>
						</div>
					</div>
					<button
						type="button"
						onClick={retry}
						className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-hairline bg-canvas px-4 text-sm font-semibold text-ink hover:bg-surface-soft"
					>
						<RotateCcw size={16} aria-hidden="true" /> Tentar
						novamente
					</button>
				</section>
			) : (
				<>
					{podeAdministrar && (
						<div className="mt-5 flex justify-end">
							<button
								type="button"
								onClick={() => setEditor('new')}
								className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-red px-4 text-sm font-semibold text-white hover:bg-red-pressed sm:w-auto"
							>
								<Plus size={18} aria-hidden="true" /> Novo
								subsistema
							</button>
						</div>
					)}
					<SubsistemasList
						data={state.data}
						podeAdministrar={podeAdministrar}
						onEdit={setEditor}
					/>
					<div className="mt-4 flex justify-end">
						<button
							type="button"
							onClick={simulateFailure}
							className="min-h-11 text-left text-xs text-mute underline underline-offset-4 hover:text-ink"
						>
							Simular falha na próxima consulta
						</button>
					</div>
				</>
			)}
			{editor !== null && podeAdministrar && (
				<AdministrarSubsistemaDialog
					key={`${user.id}:${editor}`}
					atorId={user.id}
					subsistema={selected}
					onSaved={retry}
					onClose={() => setEditor(null)}
				/>
			)}
		</>
	)
}

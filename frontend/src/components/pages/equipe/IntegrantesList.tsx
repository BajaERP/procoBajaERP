import { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react'
import { pesquisarIntegrantes } from '../../../services/equipePolicy'
import type {
	ConsultaIntegrantes,
	IntegranteVisivel,
} from '../../../services/equipeTypes'

const PERFIS = [
	{ id: 'capitao', label: 'Capitão' },
	{ id: 'gestor', label: 'Gestor' },
	{ id: 'lider', label: 'Líder' },
	{ id: 'membro', label: 'Membro' },
	{ id: 'orientador', label: 'Orientador' },
] as const

const PAGE_SIZE = 6

function labelPerfil(integrante: IntegranteVisivel): string {
	return integrante.financeiro
		? 'Gestor Financeiro'
		: (PERFIS.find((item) => item.id === integrante.perfil)?.label ??
				integrante.perfil)
}

function initials(name: string): string {
	return name
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join('')
		.toUpperCase()
}

function Status({ active }: { active: boolean }) {
	return (
		<span
			className={`inline-flex min-w-19 justify-center rounded-full px-2 py-1 text-xs font-semibold ${active ? 'bg-state-success-bg text-state-success' : 'bg-state-warning-bg text-state-warning'}`}
		>
			{active ? 'Ativo' : 'Inativo'}
		</span>
	)
}

export function IntegrantesList({
	data,
	onOpen,
	onOpenFinancial,
}: {
	data: ConsultaIntegrantes
	onOpen: (integranteId: string) => void
	onOpenFinancial: () => void
}) {
	const [busca, setBusca] = useState('')
	const [perfil, setPerfil] = useState('')
	const [subsistema, setSubsistema] = useState('')
	const [pagina, setPagina] = useState(1)
	const encontrados = pesquisarIntegrantes(
		data.integrantes,
		busca,
		perfil,
		subsistema,
	)
	const totalPaginas = Math.max(1, Math.ceil(encontrados.length / PAGE_SIZE))
	const paginaAtual = Math.min(pagina, totalPaginas)
	const mostrados = encontrados.slice(
		(paginaAtual - 1) * PAGE_SIZE,
		paginaAtual * PAGE_SIZE,
	)
	const subsistemas = data.subsistemas

	return (
		<section aria-label="Consulta de integrantes" className="mt-5 min-w-0">
			<div className="grid grid-cols-1 gap-0 rounded-lg border border-hairline bg-surface-card sm:grid-cols-3">
				{[
					{
						value: data.integrantes.length,
						label: 'integrantes visíveis',
						action: undefined,
					},
					{
						value: data.subsistemasAtivos,
						label: 'subsistemas ativos',
						action: undefined,
					},
					{
						value: data.gestoresFinanceirosAtivos,
						label: 'Gestor Financeiro ativo',
						action: 'financial',
					},
				].map((metric, index) => (
					<div
						key={metric.label}
						className={`${index > 0 ? 'border-t border-hairline sm:border-l sm:border-t-0' : ''}`}
					>
						{metric.action === 'financial' ? (
							<button
								type="button"
								onClick={onOpenFinancial}
								aria-label="Abrir responsabilidade financeira"
								className="flex min-h-16 w-full items-center gap-4 px-4 py-3 text-left hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red"
							>
								<strong className="text-2xl font-bold text-ink">
									{metric.value}
								</strong>
								<span className="text-xs text-mute">
									{metric.label}
								</span>
							</button>
						) : (
							<div className="flex min-h-16 items-center gap-4 px-4 py-3">
								<strong className="text-2xl font-bold text-ink">
									{metric.value}
								</strong>
								<span className="text-xs text-mute">
									{metric.label}
								</span>
							</div>
						)}
					</div>
				))}
			</div>

			<div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(10rem,0.8fr)_minmax(10rem,0.8fr)]">
				<div>
					<label
						htmlFor="equipe-busca"
						className="mb-1.5 block text-xs font-medium text-body"
					>
						Buscar integrante
					</label>
					<div className="relative">
						<Search
							size={17}
							aria-hidden="true"
							className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute"
						/>
						<input
							id="equipe-busca"
							type="search"
							value={busca}
							onChange={(event) => {
								setBusca(event.target.value)
								setPagina(1)
							}}
							placeholder="Buscar por nome ou identificador permitido"
							className="w-full rounded-md border border-hairline bg-canvas py-2 pl-10 pr-3 text-sm text-ink placeholder:text-ash focus-visible:border-red"
						/>
					</div>
				</div>
				<div>
					<label
						htmlFor="equipe-perfil"
						className="mb-1.5 block text-xs font-medium text-body"
					>
						Perfil
					</label>
					<select
						id="equipe-perfil"
						value={perfil}
						onChange={(event) => {
							setPerfil(event.target.value)
							setPagina(1)
						}}
						className="w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink dark:[color-scheme:dark]"
					>
						<option value="">Todos os perfis</option>
						{PERFIS.map((item) => (
							<option key={item.id} value={item.id}>
								{item.label}
							</option>
						))}
					</select>
				</div>
				<div>
					<label
						htmlFor="equipe-subsistema"
						className="mb-1.5 block text-xs font-medium text-body"
					>
						Subsistema
					</label>
					<select
						id="equipe-subsistema"
						value={subsistema}
						onChange={(event) => {
							setSubsistema(event.target.value)
							setPagina(1)
						}}
						className="w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink dark:[color-scheme:dark]"
					>
						<option value="">Todos</option>
						{subsistemas.map(({ id, nome }) => (
							<option key={id} value={id}>
								{nome}
							</option>
						))}
					</select>
				</div>
			</div>

			{!encontrados.length ? (
				<div
					role="status"
					className="mt-4 rounded-lg border border-hairline bg-surface-card px-5 py-10 text-center"
				>
					<h2 className="font-semibold text-ink">
						Nenhum integrante encontrado
					</h2>
					<p className="mt-1 text-sm text-mute">
						Tente outro nome ou ajuste os filtros.
					</p>
				</div>
			) : (
				<>
					<div className="mt-4 hidden overflow-x-auto rounded-lg border border-hairline bg-surface-card md:block">
						<table className="w-full min-w-[680px] border-collapse text-left text-xs">
							<thead className="border-b border-hairline bg-surface-raised text-[11px] font-semibold uppercase text-mute">
								<tr>
									<th scope="col" className="px-4 py-3">
										Integrante
									</th>
									<th scope="col" className="px-4 py-3">
										RA / SIAPE
									</th>
									<th scope="col" className="px-4 py-3">
										Perfil
									</th>
									<th scope="col" className="px-4 py-3">
										Subsistema
									</th>
									<th scope="col" className="px-4 py-3">
										Situação
									</th>
									<th scope="col" className="px-4 py-3">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{mostrados.map((item) => (
									<tr
										key={item.id}
										className="border-b border-hairline-soft last:border-b-0"
									>
										<th
											scope="row"
											className="px-4 py-3 font-semibold text-ink"
										>
											<span
												className="mr-2 inline-flex size-8 items-center justify-center rounded-full bg-selected text-[10px] text-link"
												aria-hidden="true"
											>
												{initials(item.nome)}
											</span>
											{item.nome}
										</th>
										<td className="px-4 py-3 font-mono text-body">
											{item.identificador ?? (
												<span className="font-sans text-mute">
													Restrito
												</span>
											)}
										</td>
										<td className="px-4 py-3 text-body">
											{labelPerfil(item)}
										</td>
										<td className="px-4 py-3 text-mute">
											{item.subsistema ?? '—'}
										</td>
										<td className="px-4 py-3">
											<Status active={item.ativo} />
										</td>
										<td className="px-4 py-3">
											<button
												type="button"
												onClick={() => onOpen(item.id)}
												className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-xs font-semibold text-link hover:bg-selected"
											>
												<Eye
													size={15}
													aria-hidden="true"
												/>{' '}
												Detalhes
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="mt-4 space-y-2 md:hidden">
						{mostrados.map((item) => (
							<article
								key={item.id}
								className="rounded-lg border border-hairline bg-surface-card p-4"
							>
								<div className="flex items-start gap-3">
									<span
										className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-selected text-[10px] font-semibold text-link"
										aria-hidden="true"
									>
										{initials(item.nome)}
									</span>
									<div className="min-w-0 flex-1">
										<h2 className="font-semibold text-ink">
											{item.nome}
										</h2>
										<p className="mt-0.5 text-xs text-mute">
											{labelPerfil(item)} ·{' '}
											{item.subsistema ??
												'Sem subsistema'}
										</p>
									</div>
									<Status active={item.ativo} />
								</div>
								<button
									type="button"
									onClick={() => onOpen(item.id)}
									className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-xs font-semibold text-link hover:bg-selected"
								>
									<Eye size={15} aria-hidden="true" /> Ver
									detalhes e administração
								</button>
								<p className="mt-3 border-t border-hairline-soft pt-3 text-xs text-mute">
									RA / SIAPE:{' '}
									<span className="font-mono text-body">
										{item.identificador ?? 'Restrito'}
									</span>
								</p>
							</article>
						))}
					</div>
					<div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-mute">
						<p>
							Mostrando {(paginaAtual - 1) * PAGE_SIZE + 1}–
							{Math.min(
								paginaAtual * PAGE_SIZE,
								encontrados.length,
							)}{' '}
							de {encontrados.length} integrantes
						</p>
						<div className="flex items-center gap-2">
							<button
								type="button"
								disabled={paginaAtual === 1}
								onClick={() => setPagina((value) => value - 1)}
								className="inline-flex items-center gap-1 rounded-md px-2 text-body hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-50"
							>
								<ChevronLeft size={14} aria-hidden="true" />{' '}
								Anterior
							</button>
							<span aria-live="polite">
								{paginaAtual} / {totalPaginas}
							</span>
							<button
								type="button"
								disabled={paginaAtual === totalPaginas}
								onClick={() => setPagina((value) => value + 1)}
								className="inline-flex items-center gap-1 rounded-md px-2 text-body hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-50"
							>
								Próxima{' '}
								<ChevronRight size={14} aria-hidden="true" />
							</button>
						</div>
					</div>
				</>
			)}
		</section>
	)
}

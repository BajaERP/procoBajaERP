import { useMemo, useState } from 'react'
import { Search, Users, Pencil } from 'lucide-react'
import type { ConsultaSubsistemas } from '../../../services/equipeTypes'
import { labelPerfilSubsistema } from '../../../services/subsistemas'

export function SubsistemasList({
	data,
	podeAdministrar,
	onEdit,
}: {
	data: ConsultaSubsistemas
	podeAdministrar: boolean
	onEdit: (subsistemaId: string) => void
}) {
	const [busca, setBusca] = useState('')
	const subsistemas = useMemo(() => {
		const termo = busca
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLocaleLowerCase('pt-BR')
			.trim()
		return data.subsistemas.filter((subsistema) =>
			`${subsistema.nome} ${subsistema.lider?.nome ?? ''}`
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.toLocaleLowerCase('pt-BR')
				.includes(termo),
		)
	}, [busca, data.subsistemas])

	return (
		<section aria-label="Consulta de subsistemas" className="mt-5 min-w-0">
			<div className="max-w-2xl">
				<label
					htmlFor="subsistemas-busca"
					className="mb-1.5 block text-xs font-medium text-body"
				>
					Buscar subsistema ou Líder
				</label>
				<div className="relative">
					<Search
						size={17}
						aria-hidden="true"
						className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute"
					/>
					<input
						id="subsistemas-busca"
						type="search"
						value={busca}
						onChange={(event) => setBusca(event.target.value)}
						placeholder="Digite um nome"
						className="min-h-11 w-full rounded-md border border-hairline bg-canvas py-2 pl-10 pr-3 text-sm text-ink placeholder:text-ash focus-visible:border-red"
					/>
				</div>
			</div>

			{!subsistemas.length ? (
				<div
					role="status"
					className="mt-4 rounded-lg border border-hairline bg-surface-card px-5 py-10 text-center"
				>
					<h2 className="font-semibold text-ink">
						{data.subsistemas.length
							? 'Nenhum subsistema encontrado'
							: 'Ainda não há subsistemas'}
					</h2>
					<p className="mt-1 text-sm text-mute">
						{data.subsistemas.length
							? 'Tente buscar por outro nome ou Líder.'
							: podeAdministrar
								? 'Crie um subsistema para preparar a composição da equipe.'
								: 'Os subsistemas ativos aparecerão aqui.'}
					</p>
				</div>
			) : (
				<ul className="mt-4 grid min-w-0 gap-3 lg:grid-cols-2">
					{subsistemas.map((subsistema) => (
						<li
							key={subsistema.id}
							className="min-w-0 rounded-lg border border-hairline bg-surface-card p-4 sm:p-5"
						>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2">
										<h2 className="break-words text-lg font-semibold text-ink">
											{subsistema.nome}
										</h2>
										<span
											className={`rounded-full px-2.5 py-1 text-xs font-semibold ${subsistema.ativo ? 'bg-state-success-bg text-state-success' : 'bg-state-warning-bg text-state-warning'}`}
										>
											{subsistema.ativo
												? 'Ativo'
												: 'Inativo'}
										</span>
									</div>
									<p className="mt-2 text-sm text-body">
										Líder:{' '}
										{subsistema.lider?.nome ?? 'Sem Líder'}
									</p>
								</div>
								{podeAdministrar && (
									<button
										type="button"
										onClick={() => onEdit(subsistema.id)}
										className="inline-flex min-h-11 items-center gap-2 rounded-md border border-hairline bg-canvas px-3 text-sm font-semibold text-ink hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
										aria-label={`Editar ${subsistema.nome}`}
									>
										<Pencil size={15} aria-hidden="true" />
										Editar
									</button>
								)}
							</div>
							{subsistema.integrantes && (
								<div className="mt-4 border-t border-hairline-soft pt-3">
									<h3 className="flex items-center gap-2 text-sm font-semibold text-body">
										<Users size={16} aria-hidden="true" />
										Composição (
										{subsistema.integrantes.length})
									</h3>
									{subsistema.integrantes.length ? (
										<ul className="mt-2 flex flex-wrap gap-2">
											{subsistema.integrantes.map(
												(integrante) => (
													<li
														key={integrante.id}
														className="max-w-full rounded-md bg-surface-soft px-3 py-2 text-sm text-body"
													>
														<span className="break-words">
															{integrante.nome}
														</span>
														<span className="ml-2 text-xs text-mute">
															{labelPerfilSubsistema(
																integrante.perfil,
																integrante.financeiro,
															)}
														</span>
													</li>
												),
											)}
										</ul>
									) : (
										<p className="mt-2 text-sm text-mute">
											Nenhum integrante ativo na
											composição.
										</p>
									)}
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</section>
	)
}

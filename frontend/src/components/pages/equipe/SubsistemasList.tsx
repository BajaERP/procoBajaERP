import { useMemo, useState } from 'react'
import { Eye, Search } from 'lucide-react'
import type { ConsultaSubsistemas } from '../../../services/equipeTypes'
import { siglaSubsistema } from '../../../services/subsistemas'

export function SubsistemasList({
	data,
	podeAdministrar,
	onOpen,
}: {
	data: ConsultaSubsistemas
	podeAdministrar: boolean
	onOpen: (subsistemaId: string) => void
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
							className="min-w-0 overflow-hidden rounded-lg border border-hairline bg-surface-card"
						>
							<button
								type="button"
								onClick={() => onOpen(subsistema.id)}
								aria-label={`Ver detalhes de ${subsistema.nome}`}
								className="subsistema-card-button flex w-full flex-col justify-between p-3 text-left hover:bg-surface-soft focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-red md:p-6"
							>
								<div className="flex min-w-0 items-center justify-between gap-2">
									<div className="flex min-w-0 items-center gap-2">
										<span className="hidden size-9 shrink-0 items-center justify-center rounded-md bg-selected text-xs font-bold text-link md:inline-flex">
											{siglaSubsistema(subsistema.nome)}
										</span>
										<h2 className="min-w-0 break-words text-base font-semibold text-ink">
											{subsistema.nome}
										</h2>
									</div>
									<span
										className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${subsistema.ativo ? 'hidden bg-state-success-bg text-state-success md:inline-flex' : 'inline-flex bg-state-warning-bg text-state-warning'}`}
									>
										{subsistema.ativo ? 'Ativo' : 'Inativo'}
									</span>
								</div>
								{subsistema.descricao && (
									<p className="mt-1 hidden truncate text-sm text-mute md:block">
										{subsistema.descricao}
									</p>
								)}
								<div className="mt-1 flex min-w-0 items-center justify-between gap-2 text-sm text-body md:mt-0">
									<p className="min-w-0 flex-1 truncate">
										Líder:{' '}
										{subsistema.lider?.nome ?? 'Sem Líder'}
									</p>
									<span className="inline-flex shrink-0 items-center gap-2 md:gap-3">
										{subsistema.integrantes && (
											<span className="text-xs text-mute">
												{subsistema.integrantes.length}{' '}
												integrantes
											</span>
										)}
										<span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-link">
											<Eye size={14} aria-hidden="true" />
											Ver detalhes
										</span>
									</span>
								</div>
							</button>
						</li>
					))}
				</ul>
			)}
		</section>
	)
}

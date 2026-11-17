import type {
	Integrante,
	IntegranteVisivel,
	SubsistemaDemo,
	Visualizador,
} from './equipeTypes'

export function subsistemasVisiveis(
	subsistemas: readonly SubsistemaDemo[],
	visualizador: Visualizador,
): SubsistemaDemo[] {
	return subsistemas.filter(
		(subsistema) =>
			visualizador.perfil === 'capitao' ||
			visualizador.perfil === 'gestor' ||
			(visualizador.perfil === 'orientador'
				? subsistema.ativo
				: visualizador.subsistemaId !== null &&
					subsistema.id === visualizador.subsistemaId),
	)
}

/** Recebe todos os subsistemas para aplicar o escopo do Orientador com segurança. */
export function filtrarIntegrantesVisiveis(
	integrantes: readonly Integrante[],
	visualizador: Visualizador,
	subsistemas: readonly SubsistemaDemo[],
): IntegranteVisivel[] {
	const administra =
		visualizador.perfil === 'capitao' || visualizador.perfil === 'gestor'
	const subsistemasAtivos = new Set(
		subsistemas
			.filter((subsistema) => subsistema.ativo)
			.map((subsistema) => subsistema.id),
	)
	return integrantes
		.filter((integrante) => {
			if (administra) return true
			if (!integrante.ativo) return false
			if (visualizador.perfil === 'orientador')
				return (
					integrante.id === visualizador.id ||
					integrante.subsistemaId === null ||
					subsistemasAtivos.has(integrante.subsistemaId)
				)
			return (
				visualizador.subsistemaId !== null &&
				integrante.subsistemaId === visualizador.subsistemaId
			)
		})
		.map((integrante) => ({
			id: integrante.id,
			nome: integrante.nome,
			perfil: integrante.perfil,
			subsistemaId: integrante.subsistemaId,
			ativo: integrante.ativo,
			financeiro: integrante.financeiro,
			...(administra && integrante.passwordChangePending !== undefined
				? { passwordChangePending: integrante.passwordChangePending }
				: {}),
			identificador:
				administra || integrante.id === visualizador.id
					? integrante.identificador
					: null,
			subsistema: null,
		}))
}

function normalize(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLocaleLowerCase('pt-BR')
		.trim()
}

export function pesquisarIntegrantes(
	integrantes: readonly IntegranteVisivel[],
	busca: string,
	perfil: string,
	subsistemaId: string,
): IntegranteVisivel[] {
	const termo = normalize(busca)
	return integrantes.filter(
		(integrante) =>
			(!termo ||
				normalize(integrante.nome).includes(termo) ||
				integrante.identificador?.includes(termo)) &&
			(!perfil || integrante.perfil === perfil) &&
			(!subsistemaId || integrante.subsistemaId === subsistemaId),
	)
}

import type { Integrante, IntegranteVisivel, Visualizador } from './equipeTypes'

export function filtrarIntegrantesVisiveis(
	integrantes: readonly Integrante[],
	visualizador: Visualizador,
): IntegranteVisivel[] {
	const administra =
		visualizador.perfil === 'capitao' ||
		visualizador.perfil === 'gestor' ||
		visualizador.perfil === 'financeiro'
	return integrantes
		.filter((integrante) => {
			if (administra) return true
			if (!integrante.ativo) return false
			if (visualizador.perfil === 'orientador') return true
			return (
				visualizador.subsistemaId !== null &&
				integrante.subsistemaId === visualizador.subsistemaId
			)
		})
		.map((integrante) => ({
			...integrante,
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

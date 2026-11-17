export function getEquipePageContentKeys(
	userId: string,
	role: string,
	subsistemaId: string | null,
) {
	const identity = JSON.stringify([userId, role, subsistemaId])
	return {
		subsistemas: `subsistemas:${identity}`,
		integrantes: `integrantes:${identity}`,
		financeiro: `financeiro:${identity}`,
		permissoes: `permissoes:${identity}`,
	}
}

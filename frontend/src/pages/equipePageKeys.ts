export function getEquipePageContentKeys(
	userId: string,
	role: string,
	revision: number,
) {
	const identity = `${userId}:${role}:${revision}`
	return {
		subsistemas: `subsistemas:${identity}`,
		integrantes: `integrantes:${identity}`,
		financeiro: `financeiro:${identity}`,
	}
}

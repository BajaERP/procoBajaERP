import type { DemoIdentity, DemoPerspective } from './equipeTypes'

export function identitiesForPerspective(
	identities: readonly DemoIdentity[],
	perspective: DemoPerspective,
): DemoIdentity[] {
	return identities.filter((identity) =>
		perspective === 'financeiro'
			? identity.role === 'gestor' && identity.financial
			: identity.role === perspective,
	)
}

export function chooseDemoIdentity(
	identities: readonly DemoIdentity[],
	requestedId: string,
	perspective?: DemoPerspective | null,
): {
	identity: DemoIdentity | null
	perspective: DemoPerspective
	notice: string | null
} {
	const choices = perspective
		? identitiesForPerspective(identities, perspective)
		: identities
	const requested = choices.find((item) => item.id === requestedId)
	const identity =
		requested ??
		(perspective ? choices[0] : undefined) ??
		identities.find((item) => item.role === 'gestor') ??
		identities[0] ??
		null
	return {
		identity,
		perspective:
			perspective && choices.some((item) => item.id === identity?.id)
				? perspective
				: identity?.financial
					? 'financeiro'
					: (identity?.role ?? 'gestor'),
		notice: requested
			? null
			: identity
				? `A identidade anterior ficou indisponível para esta visão. ${identity.name} foi selecionado(a).`
				: 'A demonstração está indisponível porque não há pessoas ativas.',
	}
}

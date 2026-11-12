import type { UserRole } from '../contexts/AuthContext'

export interface Integrante {
	id: string
	nome: string
	identificador: string
	perfil: UserRole
	subsistemaId: string | null
	ativo: boolean
	financeiro: boolean
	passwordChangePending?: boolean
}

export interface SubsistemaDemo {
	id: string
	nome: string
	ativo: boolean
}

export type DemoPerspective = UserRole | 'financeiro'

export interface DemoIdentity {
	id: string
	name: string
	ra: string
	role: UserRole
	subsistemaId: string | null
	subsistema: string | null
	financial: boolean
	passwordChangePending: boolean
}

export interface IntegranteVisivel extends Omit<Integrante, 'identificador'> {
	identificador: string | null
	subsistema: string | null
}

export interface Visualizador {
	id: string
	perfil: UserRole
	subsistemaId: string | null
}

export interface ConsultaIntegrantes {
	integrantes: IntegranteVisivel[]
	subsistemasAtivos: number
	gestoresFinanceirosAtivos: number
	subsistemas: { id: string; nome: string }[]
}

export interface EquipeService {
	listarIntegrantes(visualizador: Visualizador): Promise<ConsultaIntegrantes>
	simularFalhaNaProximaConsulta?(): void
	listarIdentidades?(): Promise<DemoIdentity[]>
	obterIdentidade?(id: string): Promise<DemoIdentity | null>
	identidadePadrao?(): Promise<DemoIdentity | null>
	restaurarDadosDemo?(): Promise<void>
	atualizarIntegranteDemo?(
		id: string,
		changes: Partial<Integrante>,
	): Promise<void>
}

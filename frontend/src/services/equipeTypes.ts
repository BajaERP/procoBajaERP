import type { UserRole } from '../contexts/AuthContext'

export interface Integrante {
	id: string
	nome: string
	identificador: string
	perfil: Exclude<UserRole, 'financeiro'>
	subsistemaId: string | null
	ativo: boolean
	financeiro: boolean
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
}

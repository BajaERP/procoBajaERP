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
	descricao?: string | null
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

export interface GestorFinanceiroResumo {
	id: string
	nome: string
	subsistema: string | null
}

export interface ConsultaResponsabilidadeFinanceira {
	responsavel: GestorFinanceiroResumo | null
	gestoresElegiveis: GestorFinanceiroResumo[]
}

export interface IntegranteDeSubsistema {
	id: string
	nome: string
	perfil: UserRole
	ativo: boolean
	financeiro?: boolean
	subsistemaId?: string | null
}

export interface SubsistemaConsultavel {
	id: string
	nome: string
	descricao: string | null
	ativo: boolean
	lider: Pick<IntegranteDeSubsistema, 'id' | 'nome'> | null
	integrantes?: IntegranteDeSubsistema[]
}

export interface ConsultaSubsistemas {
	subsistemas: SubsistemaConsultavel[]
	resumo: ResumoSubsistemas
}

export interface ResumoSubsistemas {
	subsistemasAtivos: number
	integrantesAssociados: number | null
}

export interface OpcoesSubsistema {
	podeAdministrar: boolean
	integrantesDisponiveis: IntegranteDeSubsistema[]
	integranteIds: string[]
}

export interface OpcoesTransferenciaIntegrante {
	destinos: SubsistemaDemo[]
	bloqueio: string | null
}

export interface OpcoesDesativacaoSubsistema {
	integrantes: IntegranteDeSubsistema[]
	destinos: SubsistemaDemo[]
	bloqueio: string | null
}

export interface OpcoesDefinicaoLider {
	integrantesDisponiveis: (IntegranteDeSubsistema & {
		subsistemaNome: string | null
	})[]
	liderAtual: Pick<IntegranteDeSubsistema, 'id' | 'nome'> | null
	subsistemaAtivo: boolean
}

export interface DadosSubsistema {
	id?: string
	nome: string
	descricao?: string | null
	integranteIds: string[]
}

export type ErrosSubsistema = Partial<Record<'nome' | 'integranteIds', string>>

export interface EquipeService {
	listarIntegrantes(visualizador: Visualizador): Promise<ConsultaIntegrantes>
	listarSubsistemas(visualizador: Visualizador): Promise<ConsultaSubsistemas>
	consultarResponsabilidadeFinanceira(
		visualizador: Visualizador,
	): Promise<ConsultaResponsabilidadeFinanceira>
	atribuirResponsabilidadeFinanceira(
		atorId: string,
		gestorId: string,
	): Promise<void>
	retirarResponsabilidadeFinanceira(atorId: string): Promise<void>
	transferirResponsabilidadeFinanceira(
		atorId: string,
		gestorId: string,
	): Promise<void>
	opcoesSubsistema(
		atorId: string,
		subsistemaId?: string,
	): Promise<OpcoesSubsistema>
	opcoesDefinicaoLider(
		atorId: string,
		subsistemaId: string,
	): Promise<OpcoesDefinicaoLider>
	definirLider(
		atorId: string,
		subsistemaId: string,
		integranteId: string,
	): Promise<void>
	salvarSubsistema(atorId: string, dados: DadosSubsistema): Promise<void>
	opcoesTransferenciaIntegrante(
		atorId: string,
		integranteId: string,
	): Promise<OpcoesTransferenciaIntegrante>
	transferirIntegrante(
		atorId: string,
		integranteId: string,
		destinoId: string,
	): Promise<void>
	opcoesDesativacaoSubsistema(
		atorId: string,
		subsistemaId: string,
	): Promise<OpcoesDesativacaoSubsistema>
	desativarSubsistema(
		atorId: string,
		subsistemaId: string,
		destinosPorIntegrante: Record<string, string>,
	): Promise<void>
	obterDetalheIntegrante?(
		visualizador: Visualizador,
		integranteId: string,
	): Promise<IntegranteVisivel | null>
	opcoesAdministracaoIntegrante?(
		atorId: string,
		integranteId: string,
	): Promise<OpcoesAdministracaoIntegrante>
	administrarIntegrante?(
		atorId: string,
		integranteId: string,
		alteracoes: AlteracaoIntegrante,
	): Promise<void>
	redefinirSenhaProvisoria?(
		atorId: string,
		integranteId: string,
	): Promise<string>
	opcoesCadastroIntegrante(atorId: string): Promise<OpcoesCadastroIntegrante>
	cadastrarIntegrante(
		atorId: string,
		dados: CadastroIntegrante,
	): Promise<IntegranteCadastrado>
	simularFalhaNoProximoCadastro?(): void | Promise<void>
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

export interface AlteracaoIntegrante {
	nome?: string
	identificador?: string
	perfil?: Exclude<UserRole, 'lider'>
	subsistemaId?: string | null
	ativo?: boolean
}

export interface OpcoesAdministracaoIntegrante {
	perfis: Exclude<UserRole, 'lider'>[]
	subsistemas: SubsistemaDemo[]
	podeEditarDados: boolean
	podeAlterarStatus: boolean
	podeRedefinirSenha: boolean
	bloqueioStatus: string | null
	bloqueioPerfil: string | null
}

export type ErrosEdicaoIntegrante = Partial<
	Record<keyof AlteracaoIntegrante, string>
>

export type PerfilCadastro = Exclude<UserRole, 'lider'>

export interface CadastroIntegrante {
	nome: string
	identificador: string
	perfil: PerfilCadastro
	subsistemaId: string | null
}

export interface OpcoesCadastroIntegrante {
	perfis: PerfilCadastro[]
	subsistemas: SubsistemaDemo[]
}

export interface IntegranteCadastrado {
	integrante: Integrante
	senhaProvisoria: string
}

export type ErrosCadastroIntegrante = Partial<
	Record<keyof CadastroIntegrante, string>
>

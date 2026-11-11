import { filtrarIntegrantesVisiveis } from '../services/equipePolicy'
import type {
	ConsultaIntegrantes,
	EquipeService,
	Integrante,
	Visualizador,
} from '../services/equipeTypes'

const subsistemas = [
	{ id: 'gestao', nome: 'Gestão', ativo: true },
	{ id: 'chassi', nome: 'Chassi', ativo: true },
	{ id: 'eletrica', nome: 'Elétrica', ativo: true },
	{ id: 'projeto', nome: 'Projeto', ativo: true },
	{ id: 'inativo', nome: 'Suspensão', ativo: false },
] as const

const integrantes: Integrante[] = [
	{
		id: 'ana',
		nome: 'Ana Ribeiro',
		identificador: '2345678',
		perfil: 'capitao',
		subsistemaId: null,
		ativo: true,
		financeiro: false,
	},
	{
		id: 'bruno',
		nome: 'Bruno Lima',
		identificador: '2345679',
		perfil: 'gestor',
		subsistemaId: 'gestao',
		ativo: true,
		financeiro: true,
	},
	{
		id: 'carla',
		nome: 'Carla Souza',
		identificador: '2345680',
		perfil: 'membro',
		subsistemaId: 'gestao',
		ativo: true,
		financeiro: false,
	},
	{
		id: 'diego',
		nome: 'Diego Moraes',
		identificador: '2345681',
		perfil: 'lider',
		subsistemaId: 'chassi',
		ativo: true,
		financeiro: false,
	},
	{
		id: 'elisa',
		nome: 'Elisa Costa',
		identificador: '2345682',
		perfil: 'membro',
		subsistemaId: 'chassi',
		ativo: true,
		financeiro: false,
	},
	{
		id: 'gabriel',
		nome: 'Gabriel Prado',
		identificador: '2345683',
		perfil: 'lider',
		subsistemaId: 'eletrica',
		ativo: true,
		financeiro: false,
	},
	{
		id: 'helena',
		nome: 'Helena Martins',
		identificador: '2345684',
		perfil: 'membro',
		subsistemaId: 'eletrica',
		ativo: true,
		financeiro: false,
	},
	{
		id: 'isabela',
		nome: 'Isabela Ferreira',
		identificador: '2345685',
		perfil: 'lider',
		subsistemaId: 'projeto',
		ativo: true,
		financeiro: false,
	},
	{
		id: 'joao',
		nome: 'João Almeida',
		identificador: '2345686',
		perfil: 'orientador',
		subsistemaId: null,
		ativo: true,
		financeiro: false,
	},
]

// Until the Dev switcher chooses people, each role uses one fixed identity.
// This mapping is demonstrative and is never used as server authorization.
const demoIdentity: Record<Visualizador['perfil'], string> = {
	capitao: 'ana',
	gestor: 'bruno',
	financeiro: 'bruno',
	lider: 'diego',
	membro: 'elisa',
	orientador: 'joao',
}

let failNext = false

export const mockEquipeService: EquipeService = {
	async listarIntegrantes(visualizador): Promise<ConsultaIntegrantes> {
		await new Promise((resolve) => window.setTimeout(resolve, 350))
		if (failNext) {
			failNext = false
			throw new Error(
				'Não foi possível carregar os integrantes demonstrativos.',
			)
		}
		const identidade =
			integrantes.find((item) => item.id === visualizador.id) ??
			integrantes.find(
				(item) => item.id === demoIdentity[visualizador.perfil],
			)!
		const autorizados = filtrarIntegrantesVisiveis(integrantes, {
			id: identidade.id,
			perfil: visualizador.perfil,
			subsistemaId: identidade.subsistemaId,
		})
		return {
			integrantes: autorizados.map((item) => ({
				...item,
				subsistema:
					subsistemas.find((sub) => sub.id === item.subsistemaId)
						?.nome ?? null,
			})),
			subsistemasAtivos: subsistemas.filter((item) => item.ativo).length,
			gestoresFinanceirosAtivos: integrantes.filter(
				(item) =>
					item.ativo && item.perfil === 'gestor' && item.financeiro,
			).length,
			subsistemas: subsistemas
				.filter((item) => item.ativo)
				.map(({ id, nome }) => ({ id, nome })),
		}
	},
	simularFalhaNaProximaConsulta() {
		failNext = true
	},
}

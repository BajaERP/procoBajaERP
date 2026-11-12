import { filtrarIntegrantesVisiveis } from '../services/equipePolicy'
import type {
	ConsultaIntegrantes,
	EquipeService,
} from '../services/equipeTypes'
import { createDemoStore } from './equipeStore'

const store = createDemoStore(window.localStorage)

export const mockEquipeService: EquipeService = {
	async obterDetalheIntegrante(visualizador, integranteId) {
		return store.detail(visualizador, integranteId)
	},
	async opcoesAdministracaoIntegrante(atorId, integranteId) {
		return store.administrationOptions(atorId, integranteId)
	},
	async administrarIntegrante(atorId, integranteId, alteracoes) {
		store.administer(atorId, integranteId, alteracoes)
	},
	async redefinirSenhaProvisoria(atorId, integranteId) {
		return store.resetTemporaryPassword(atorId, integranteId)
	},
	async opcoesCadastroIntegrante(atorId) {
		return store.createOptions(atorId)
	},
	async cadastrarIntegrante(atorId, dados) {
		await new Promise((resolve) => window.setTimeout(resolve, 350))
		return store.createIntegrante(atorId, dados)
	},
	simularFalhaNoProximoCadastro() {
		store.failNextCreate()
	},
	async listarIntegrantes(visualizador): Promise<ConsultaIntegrantes> {
		await new Promise((resolve) => window.setTimeout(resolve, 350))
		const data = store.read()
		const identidade = store.identity(visualizador.id)
		if (!identidade)
			throw new Error('A identidade demonstrativa não está disponível.')
		const autorizados = filtrarIntegrantesVisiveis(data.integrantes, {
			id: identidade.id,
			perfil: identidade.role,
			subsistemaId: identidade.subsistemaId,
		})
		return {
			integrantes: autorizados.map((item) => ({
				...item,
				subsistema:
					data.subsistemas.find((sub) => sub.id === item.subsistemaId)
						?.nome ?? null,
			})),
			subsistemasAtivos: data.subsistemas.filter((item) => item.ativo)
				.length,
			gestoresFinanceirosAtivos: data.integrantes.filter(
				(item) =>
					item.ativo && item.perfil === 'gestor' && item.financeiro,
			).length,
			subsistemas: data.subsistemas
				.filter((item) => item.ativo)
				.map(({ id, nome }) => ({ id, nome })),
		}
	},
	simularFalhaNaProximaConsulta() {
		store.failNextRead()
	},
	async listarIdentidades() {
		return store.identities()
	},
	async obterIdentidade(id) {
		return store.identity(id)
	},
	async identidadePadrao() {
		return store.defaultIdentity()
	},
	async restaurarDadosDemo() {
		store.reset()
	},
	async atualizarIntegranteDemo(id, changes) {
		store.updateIntegrante(id, changes)
	},
}

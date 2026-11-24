import {
	AdministracaoIntegranteError,
	CadastroIntegranteError,
} from './cadastroIntegrante'
import { createApiClient, ApiError } from './apiClient'
import { AUTH_SESSION_EXPIRED, notifyAuthUserChanged } from './authApi'
import { mapApiRole, mapRoleToApi, mapResumo, mapUsuario } from './apiMappers'
import { perfisParaCadastro, podeAdministrarPerfil } from './cadastroIntegrante'
import { SubsistemaError } from './subsistemas'
import type { ApiResumo, ApiUsuario } from './apiMappers'
import type {
	AlteracaoIntegrante,
	CadastroIntegrante,
	ConsultaAuditoria,
	ConsultaIntegrantes,
	ConsultaResponsabilidadeFinanceira,
	ConsultaSubsistemas,
	DadosSubsistema,
	EquipeService,
	FiltrosAuditoria,
	IntegranteDeSubsistema,
	OpcoesAdministracaoIntegrante,
	OpcoesCadastroIntegrante,
	OpcoesDefinicaoLider,
	OpcoesDesativacaoSubsistema,
	OpcoesSubsistema,
	OpcoesSucessaoCapitao,
	OpcoesTransferenciaIntegrante,
	PerfilCadastro,
	SubsistemaConsultavel,
	SubsistemaDemo,
	Visualizador,
} from './equipeTypes'
import { authApi } from './authApi'
import { mapCurrentUser } from './apiMappers'

const api = createApiClient({
	onUnauthorized() {
		window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED))
	},
})

const id = (value: string | number) => Number(value)
const userPath = (userId: string) => `/api/usuarios/${id(userId)}`
const subsystemPath = (subsystemId: string) =>
	`/api/subsistemas/${id(subsystemId)}`

interface ApiSubsystem {
	id: number
	nome: string
	descricao: string | null
	ativo: boolean
	lider: ApiResumo | null
}

interface ApiAuditEvent {
	id: number
	registradoEm: string
	atorNome: string
	entidade: 'USUARIO' | 'SUBSISTEMA'
	acao: string
	descricao: string
	subsistemaOrigem: ApiResumo | null
	subsistemaDestino: ApiResumo | null
}

interface ApiAuditPage {
	content: ApiAuditEvent[]
	page: number
	size: number
	totalElements: number
	totalPages: number
}

async function listSubsystemDtos(): Promise<ApiSubsystem[]> {
	return api.request('/api/subsistemas')
}

async function listUserDtos(query = ''): Promise<ApiUsuario[]> {
	return api.request(`/api/usuarios${query}`)
}

function mapSubsystem(value: ApiSubsystem): SubsistemaConsultavel {
	return {
		id: String(value.id),
		nome: value.nome,
		descricao: value.descricao,
		ativo: value.ativo,
		lider: mapResumo(value.lider),
	}
}

function mapSubsystemDemo(value: ApiSubsystem): SubsistemaDemo {
	return {
		id: String(value.id),
		nome: value.nome,
		descricao: value.descricao,
		ativo: value.ativo,
	}
}

function mapComposition(value: ApiUsuario): IntegranteDeSubsistema {
	const user = mapUsuario(value)
	return {
		id: user.id,
		nome: user.nome,
		perfil: user.perfil,
		ativo: user.ativo,
		financeiro: user.financeiro,
		subsistemaId: user.subsistemaId,
	}
}

async function getComposition(subsystemId: string): Promise<ApiUsuario[]> {
	return api.request(`${subsystemPath(subsystemId)}/integrantes`)
}

function apiFieldErrors(
	fields: Record<string, string>,
	aliases: Record<string, string>,
) {
	return Object.fromEntries(
		Object.entries(fields).map(([field, message]) => [
			aliases[field] ?? field,
			message,
		]),
	)
}

function throwCadastroError(error: unknown): never {
	if (error instanceof ApiError)
		throw new CadastroIntegranteError(
			error.message,
			apiFieldErrors(error.fields, {
				ra: 'identificador',
				subsistemaId: 'subsistemaId',
			}),
		)
	throw error
}

function throwAdminError(error: unknown): never {
	if (error instanceof ApiError)
		throw new AdministracaoIntegranteError(
			error.message,
			apiFieldErrors(error.fields, {
				ra: 'identificador',
				subsistemaId: 'subsistemaId',
			}),
		)
	throw error
}

function throwSubsystemError(error: unknown): never {
	if (error instanceof ApiError)
		throw new SubsistemaError(
			error.message,
			apiFieldErrors(error.fields, {}),
		)
	throw error
}

function activeSubsystems(subsystems: ApiSubsystem[]) {
	return subsystems.filter((subsystem) => subsystem.ativo)
}

export const apiEquipeService: EquipeService = {
	async listarIntegrantes(
		_viewer: Visualizador,
	): Promise<ConsultaIntegrantes> {
		const [users, subsystems] = await Promise.all([
			listUserDtos(),
			listSubsystemDtos(),
		])
		const integrantes = users.map(mapUsuario)
		return {
			integrantes,
			subsistemasAtivos: subsystems.filter((item) => item.ativo).length,
			gestoresFinanceirosAtivos: integrantes.filter(
				(item) =>
					item.ativo && item.perfil === 'gestor' && item.financeiro,
			).length,
			subsistemas: subsystems.map(({ id: subsystemId, nome }) => ({
				id: String(subsystemId),
				nome,
			})),
		}
	},

	async listarSubsistemas(
		viewer: Visualizador,
	): Promise<ConsultaSubsistemas> {
		const dtos = await listSubsystemDtos()
		const subsystems = await Promise.all(
			dtos.map(async (dto) => {
				const result = mapSubsystem(dto)
				if (
					viewer.perfil === 'capitao' ||
					viewer.perfil === 'gestor' ||
					viewer.perfil === 'orientador' ||
					(['lider', 'membro'].includes(viewer.perfil) &&
						viewer.subsistemaId === String(dto.id))
				) {
					const members = await getComposition(String(dto.id))
					result.integrantes = members
						.filter((member) => member.ativo)
						.map(mapComposition)
				}
				return result
			}),
		)
		const canCountAll = !['lider', 'membro'].includes(viewer.perfil)
		return {
			subsistemas: subsystems,
			resumo: {
				subsistemasAtivos: dtos.filter((item) => item.ativo).length,
				integrantesAssociados: canCountAll
					? subsystems.reduce(count, 0)
					: null,
			},
		}
	},

	async consultarAuditoria(
		_viewer: Visualizador,
		filters: FiltrosAuditoria,
	): Promise<ConsultaAuditoria> {
		const query = new URLSearchParams({
			page: String(filters.page),
			size: String(filters.size),
		})
		if (filters.entidade) query.set('entidade', filters.entidade)
		if (filters.acao) query.set('acao', filters.acao)
		const page: ApiAuditPage = await api.request(
			`/api/equipe/auditoria?${query.toString()}`,
		)
		return {
			content: page.content.map((event) => ({
				id: String(event.id),
				registradoEm: event.registradoEm,
				atorNome: event.atorNome,
				entidade: event.entidade,
				acao: event.acao,
				descricao: event.descricao,
				subsistemaOrigem: mapResumo(event.subsistemaOrigem),
				subsistemaDestino: mapResumo(event.subsistemaDestino),
			})),
			page: page.page,
			size: page.size,
			totalElements: page.totalElements,
			totalPages: page.totalPages,
		}
	},

	async consultarResponsabilidadeFinanceira(): Promise<ConsultaResponsabilidadeFinanceira> {
		const [assignment, subsystems] = await Promise.all([
			api.request<{ gestor: ApiResumo | null }>(
				'/api/atribuicao-financeira',
			),
			listSubsystemDtos(),
		])
		const subsystem = subsystems.find(
			(item) => item.nome.toLocaleLowerCase('pt-BR') === 'financeiro',
		)
		return {
			responsavel: assignment.gestor
				? {
						id: String(assignment.gestor.id),
						nome: assignment.gestor.nome,
						subsistema: subsystem?.nome ?? 'Financeiro',
					}
				: null,
			subsistema: subsystem
				? {
						id: String(subsystem.id),
						nome: subsystem.nome,
						ativo: subsystem.ativo,
					}
				: null,
		}
	},

	async opcoesSubsistema(_actorId, subsystemId): Promise<OpcoesSubsistema> {
		const [current, users, actor] = await Promise.all([
			subsystemId ? getComposition(subsystemId) : Promise.resolve([]),
			listUserDtos('?ativo=true'),
			authApi.currentUser(),
		])
		const canManage = actor.permissoes.includes('SUBSISTEMAS_GERENCIAR')
		const currentIds = new Set(
			current
				.filter(
					(user) =>
						user.ativo &&
						['MEMBRO', 'ORIENTADOR'].includes(user.perfil),
				)
				.map((user) => String(user.id)),
		)
		return {
			podeAdministrar: canManage,
			integrantesDisponiveis: users
				.filter((user) =>
					['MEMBRO', 'ORIENTADOR'].includes(user.perfil),
				)
				.map(mapComposition),
			integranteIds: [...currentIds],
		}
	},

	async opcoesDefinicaoLider(
		_actorId,
		subsystemId,
	): Promise<OpcoesDefinicaoLider> {
		const [subsystem, current] = await Promise.all([
			api.request<ApiSubsystem>(subsystemPath(subsystemId)),
			authApi.currentUser(),
		])
		const canManage = current.permissoes.includes('SUBSISTEMAS_GERENCIAR')
		return {
			integrantesDisponiveis: canManage
				? (await listUserDtos('?perfil=MEMBRO&ativo=true')).map(
						(member) => ({
							...mapComposition(member),
							subsistemaNome: member.subsistema?.nome ?? null,
						}),
					)
				: [],
			liderAtual: mapResumo(subsystem.lider),
			subsistemaAtivo: subsystem.ativo,
		}
	},

	async definirLider(_actorId, subsystemId, memberId) {
		await api.request(subsystemPath(subsystemId) + '/lider', {
			method: 'PUT',
			body: { usuarioId: id(memberId) },
		})
		notifyAuthUserChanged()
	},

	async salvarSubsistema(_actorId, data: DadosSubsistema) {
		let createdSubsystemId: string | null = null
		let persisted = false
		try {
			let subsystemId = data.id
			let existing: ApiUsuario[] = []
			if (subsystemId) existing = await getComposition(subsystemId)
			const saved: ApiSubsystem = await api.request(
				subsystemId ? subsystemPath(subsystemId) : '/api/subsistemas',
				{
					method: subsystemId ? 'PUT' : 'POST',
					body: {
						nome: data.nome,
						descricao: data.descricao ?? null,
					},
				},
			)
			persisted = true
			subsystemId = String(saved.id)
			if (!data.id) createdSubsystemId = subsystemId
			const existingIds = new Set(existing.map((user) => String(user.id)))
			for (const memberId of data.integranteIds) {
				if (existingIds.has(memberId)) continue
				const user = await api.request<ApiUsuario>(userPath(memberId))
				if (user.subsistema) continue
				await api.request(`${subsystemPath(subsystemId)}/integrantes`, {
					method: 'POST',
					body: { usuarioId: id(memberId) },
				})
				persisted = true
			}
			notifyAuthUserChanged()
		} catch (error) {
			if (persisted) notifyAuthUserChanged()
			if (createdSubsystemId) {
				const message =
					error instanceof Error
						? error.message
						: 'falha ao incluir os integrantes selecionados.'
				throw new SubsistemaError(
					`O subsistema foi criado, mas a composição ficou incompleta: ${message} Tente salvar novamente para continuar.`,
					{ integranteIds: 'Revise a composição e tente novamente.' },
					createdSubsystemId,
				)
			}
			if (persisted)
				throw new SubsistemaError(
					`Os dados do subsistema foram salvos, mas a composição ficou incompleta: ${error instanceof Error ? error.message : 'falha ao incluir integrantes'} Tente salvar novamente para continuar.`,
					{ integranteIds: 'Revise a composição e tente novamente.' },
				)
			throwSubsystemError(error)
		}
	},

	async opcoesTransferenciaIntegrante(
		_actorId,
		memberId,
	): Promise<OpcoesTransferenciaIntegrante> {
		const [member, subsystems] = await Promise.all([
			api.request<ApiUsuario>(userPath(memberId)),
			listSubsystemDtos(),
		])
		const role = mapApiRole(member.perfil)
		const blocked =
			role === 'lider'
				? 'Defina outro Líder para este subsistema antes de transferir o integrante.'
				: !member.subsistema
					? 'Este integrante não está vinculado a um subsistema.'
					: null
		return {
			destinos: subsystems
				.filter((item) => item.id !== member.subsistema?.id)
				.map(mapSubsystemDemo),
			bloqueio: blocked,
		}
	},

	async transferirIntegrante(_actorId, memberId, destinationId) {
		await api.request(`${subsystemPath(destinationId)}/integrantes`, {
			method: 'POST',
			body: { usuarioId: id(memberId) },
		})
		notifyAuthUserChanged()
	},

	async opcoesDesativacaoSubsistema(
		_actorId,
		subsystemId,
	): Promise<OpcoesDesativacaoSubsistema> {
		const [subsystem, members, allSubsystems] = await Promise.all([
			api.request<ApiSubsystem>(subsystemPath(subsystemId)),
			getComposition(subsystemId),
			listSubsystemDtos(),
		])
		const destinos = activeSubsystems(allSubsystems)
			.filter((item) => item.id !== id(subsystemId))
			.map(mapSubsystemDemo)
		const integrantes = members.map(mapComposition)
		return {
			integrantes,
			destinos,
			bloqueio:
				subsystem.nome.toLocaleLowerCase('pt-BR') === 'financeiro'
					? 'O subsistema Financeiro é permanente e não pode ser desativado.'
					: integrantes.length > 0 && destinos.length === 0
						? 'Não há subsistema ativo para receber os integrantes. Ative outro subsistema antes de desativar este.'
						: null,
		}
	},

	async desativarSubsistema(_actorId, subsystemId, destinationByMember) {
		const destinations = Object.entries(destinationByMember).map(
			([userId, subsystemId]) => ({
				usuarioId: id(userId),
				subsistemaId: id(subsystemId),
			}),
		)
		await api.request(`${subsystemPath(subsystemId)}/desativacao`, {
			method: 'POST',
			body: { destinos: destinations },
		})
		notifyAuthUserChanged()
	},

	async opcoesSucessaoCapitao(): Promise<OpcoesSucessaoCapitao> {
		const options: {
			sucessores: {
				id: number
				nome: string
				perfil: string
				gestorFinanceiro: boolean
				subsistema: ApiResumo | null
			}[]
			subsistemasDestino: ApiResumo[]
		} = await api.request('/api/equipe/sucessao-capitao/opcoes')
		return {
			sucessores: options.sucessores.map((candidate) => ({
				id: String(candidate.id),
				nome: candidate.nome,
				perfil: mapApiRole(candidate.perfil) as 'gestor' | 'membro',
				financeiro: candidate.gestorFinanceiro,
				subsistema: candidate.subsistema?.nome ?? null,
			})),
			subsistemasDestino: options.subsistemasDestino.map((item) => ({
				...mapResumo(item)!,
				ativo: true,
			})),
		}
	},

	async sucederCapitao(_actorId, successorId, destinationSubsystemId) {
		await api.request('/api/equipe/sucessao-capitao', {
			method: 'POST',
			body: {
				sucessorId: id(successorId),
				subsistemaDestinoId: id(destinationSubsystemId),
			},
		})
		notifyAuthUserChanged()
	},

	async obterDetalheIntegrante(_viewer, memberId) {
		return mapUsuario(await api.request<ApiUsuario>(userPath(memberId)))
	},

	async opcoesAdministracaoIntegrante(
		actorId,
		memberId,
	): Promise<OpcoesAdministracaoIntegrante> {
		const [current, target, subsystems] = await Promise.all([
			authApi.currentUser(),
			api.request<ApiUsuario>(userPath(memberId)),
			listSubsystemDtos(),
		])
		const actorRole = mapCurrentUser(current).role
		const targetRole = mapApiRole(target.perfil)
		const permitted =
			current.permissoes.includes('USUARIOS_GERENCIAR') &&
			actorId !== memberId &&
			podeAdministrarPerfil(actorRole, targetRole)
		const bloqueioStatus =
			permitted && targetRole === 'capitao'
				? 'A situação do Capitão só pode mudar pela sucessão.'
				: permitted && targetRole === 'lider' && target.ativo
					? 'Defina outro Líder para este subsistema antes de desativar esta conta.'
					: null
		const subsystemChoices = permitted
			? subsystems.map(mapSubsystemDemo)
			: []
		return {
			perfis:
				permitted && targetRole !== 'lider' && targetRole !== 'capitao'
					? perfisParaCadastro(actorRole).filter(
							(role) => role !== 'capitao',
						)
					: [],
			subsistemas: subsystemChoices,
			podeEditarDados: permitted,
			podeAlterarStatus: permitted && !bloqueioStatus,
			podeRedefinirSenha: permitted,
			bloqueioStatus,
			bloqueioPerfil: null,
		}
	},

	async administrarIntegrante(
		_actorId,
		memberId,
		changes: AlteracaoIntegrante,
	) {
		let persisted = false
		try {
			let target = await api.request<ApiUsuario>(userPath(memberId))
			if (
				changes.nome !== undefined ||
				changes.identificador !== undefined
			) {
				await api.request(userPath(memberId), {
					method: 'PUT',
					body: {
						nome: changes.nome ?? target.nome,
						ra: changes.identificador ?? target.ra,
					},
				})
				persisted = true
			}
			if (
				changes.perfil !== undefined &&
				changes.perfil !== mapApiRole(target.perfil)
			) {
				if (
					target.subsistema === null &&
					changes.perfil !== 'orientador' &&
					!changes.subsistemaId
				)
					throw new AdministracaoIntegranteError(
						'Selecione um subsistema para este perfil.',
						{ subsistemaId: 'Selecione um subsistema.' },
					)
				await api.request(`${userPath(memberId)}/perfil`, {
					method: 'PUT',
					body: {
						perfil: mapRoleToApi(changes.perfil),
						subsistemaId:
							target.subsistema === null && changes.subsistemaId
								? id(changes.subsistemaId)
								: null,
					},
				})
				persisted = true
				target = await api.request<ApiUsuario>(userPath(memberId))
			}
			if (
				changes.subsistemaId !== undefined &&
				changes.subsistemaId !==
					(target.subsistema ? String(target.subsistema.id) : null)
			) {
				if (changes.subsistemaId === null && target.subsistema) {
					await api.request(
						`${subsystemPath(String(target.subsistema.id))}/integrantes/${id(memberId)}`,
						{ method: 'DELETE' },
					)
					persisted = true
				} else if (changes.subsistemaId) {
					await api.request(
						`${subsystemPath(changes.subsistemaId)}/integrantes`,
						{
							method: 'POST',
							body: { usuarioId: id(memberId) },
						},
					)
					persisted = true
				}
				target = await api.request<ApiUsuario>(userPath(memberId))
			}
			if (changes.ativo !== undefined && changes.ativo !== target.ativo) {
				await api.request(
					`${userPath(memberId)}/${changes.ativo ? 'reativacao' : 'desativacao'}`,
					{ method: 'POST' },
				)
				persisted = true
			}
			notifyAuthUserChanged()
		} catch (error) {
			if (persisted) notifyAuthUserChanged()
			throwAdminError(error)
		}
	},

	async redefinirSenhaProvisoria(_actorId, memberId) {
		const response = await api.request<{ senhaProvisoria: string }>(
			`${userPath(memberId)}/senha-provisoria`,
			{ method: 'POST' },
		)
		notifyAuthUserChanged()
		return response.senhaProvisoria
	},

	async trocarSenhaPropria(_userId, currentPassword, newPassword) {
		await api.request('/api/auth/senha', {
			method: 'PUT',
			body: { senhaAtual: currentPassword, novaSenha: newPassword },
		})
		notifyAuthUserChanged()
	},

	async opcoesCadastroIntegrante(): Promise<OpcoesCadastroIntegrante> {
		const [current, subsystems] = await Promise.all([
			authApi.currentUser(),
			listSubsystemDtos(),
		])
		const role = mapApiRole(current.perfil)
		const allowed = current.permissoes.includes('USUARIOS_GERENCIAR')
		return {
			perfis: allowed ? perfisParaCadastro(role) : [],
			subsistemas: allowed
				? activeSubsystems(subsystems).map(mapSubsystemDemo)
				: [],
		}
	},

	async cadastrarIntegrante(_actorId, data: CadastroIntegrante) {
		try {
			const response = await api.request<{
				usuario: ApiUsuario
				senhaProvisoria: string
			}>('/api/usuarios', {
				method: 'POST',
				body: {
					nome: data.nome,
					ra: data.identificador,
					perfil: mapRoleToApi(data.perfil),
					subsistemaId: data.subsistemaId
						? id(data.subsistemaId)
						: null,
				},
			})
			if (response.usuario.ra === null)
				throw new ApiError(
					'O servidor não devolveu o RA do novo integrante.',
					201,
				)
			notifyAuthUserChanged()
			return {
				integrante: {
					...mapUsuario(response.usuario),
					identificador: response.usuario.ra,
				},
				senhaProvisoria: response.senhaProvisoria,
			}
		} catch (error) {
			throwCadastroError(error)
		}
	},
}

function count(total: number, subsystem: SubsistemaConsultavel) {
	return total + (subsystem.integrantes?.length ?? 0)
}

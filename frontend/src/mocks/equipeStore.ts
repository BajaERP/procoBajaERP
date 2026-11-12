import type {
	CadastroIntegrante,
	AlteracaoIntegrante,
	DemoIdentity,
	DemoPerspective,
	Integrante,
	IntegranteVisivel,
	OpcoesAdministracaoIntegrante,
	SubsistemaDemo,
	Visualizador,
} from '../services/equipeTypes'
import { DEMO_DATA_KEY } from '../services/demoStorage.ts'
import {
	AdministracaoIntegranteError,
	CadastroIntegranteError,
	perfisParaCadastro,
	podeAdministrarPerfil,
	validarCadastroIntegrante,
} from '../services/cadastroIntegrante.ts'
import { filtrarIntegrantesVisiveis } from '../services/equipePolicy.ts'

interface StoragePort {
	getItem(key: string): string | null
	setItem(key: string, value: string): void
	removeItem(key: string): void
}

export interface DemoData {
	integrantes: Integrante[]
	subsistemas: SubsistemaDemo[]
}

const initialData: DemoData = {
	subsistemas: [
		{ id: 'gestao', nome: 'Gestão', ativo: true },
		{ id: 'chassi', nome: 'Chassi', ativo: true },
		{ id: 'eletrica', nome: 'Elétrica', ativo: true },
		{ id: 'projeto', nome: 'Projeto', ativo: true },
		{ id: 'inativo', nome: 'Suspensão', ativo: false },
	],
	integrantes: [
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
			passwordChangePending: true,
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
	],
}

const roles = ['capitao', 'gestor', 'lider', 'membro', 'orientador'] as const

function copy(data: DemoData): DemoData {
	return {
		integrantes: data.integrantes.map((item) => ({ ...item })),
		subsistemas: data.subsistemas.map((item) => ({ ...item })),
	}
}

function validData(value: unknown): value is DemoData {
	if (!value || typeof value !== 'object') return false
	const data = value as Partial<DemoData>
	return (
		Array.isArray(data.integrantes) &&
		Array.isArray(data.subsistemas) &&
		data.integrantes.every(
			(item) =>
				item &&
				typeof item.id === 'string' &&
				typeof item.nome === 'string' &&
				typeof item.identificador === 'string' &&
				roles.includes(item.perfil) &&
				(item.subsistemaId === null ||
					typeof item.subsistemaId === 'string') &&
				typeof item.ativo === 'boolean' &&
				typeof item.financeiro === 'boolean' &&
				(item.passwordChangePending === undefined ||
					typeof item.passwordChangePending === 'boolean'),
		) &&
		data.subsistemas.every(
			(item) =>
				item &&
				typeof item.id === 'string' &&
				typeof item.nome === 'string' &&
				typeof item.ativo === 'boolean',
		)
	)
}

function safeData(value: DemoData): DemoData {
	return {
		integrantes: value.integrantes.map((item) => ({
			id: item.id,
			nome: item.nome,
			identificador: item.identificador,
			perfil: item.perfil,
			subsistemaId: item.subsistemaId,
			ativo: item.ativo,
			financeiro: item.perfil === 'gestor' && item.financeiro,
			passwordChangePending: item.passwordChangePending === true,
		})),
		subsistemas: value.subsistemas.map((item) => ({
			id: item.id,
			nome: item.nome,
			ativo: item.ativo,
		})),
	}
}

export function createDemoStore(storage: StoragePort) {
	function data(): DemoData {
		try {
			const raw = storage.getItem(DEMO_DATA_KEY)
			if (raw) {
				const parsed: unknown = JSON.parse(raw)
				if (validData(parsed)) return safeData(parsed)
			}
		} catch {
			// Browser storage can be disabled; the seed remains available.
		}
		return copy(initialData)
	}

	function persist(next: DemoData) {
		try {
			storage.setItem(DEMO_DATA_KEY, JSON.stringify(safeData(next)))
		} catch {
			// Keep the current page usable when persistence is unavailable.
		}
	}

	function toIdentity(item: Integrante, source: DemoData): DemoIdentity {
		return {
			id: item.id,
			name: item.nome,
			ra: item.identificador,
			role: item.perfil,
			subsistemaId: item.subsistemaId,
			subsistema:
				source.subsistemas.find((sub) => sub.id === item.subsistemaId)
					?.nome ?? null,
			financial: item.perfil === 'gestor' && item.financeiro,
			passwordChangePending: item.passwordChangePending === true,
		}
	}

	let failNext = false
	let failCreate = false
	return {
		data,
		createOptions(atorId: string) {
			const source = data()
			const ator = source.integrantes.find(
				(item) => item.id === atorId && item.ativo,
			)
			if (!ator || !perfisParaCadastro(ator.perfil).length)
				throw new CadastroIntegranteError(
					'Você não tem permissão para cadastrar integrantes.',
				)
			return {
				perfis: perfisParaCadastro(ator.perfil),
				subsistemas: source.subsistemas,
			}
		},
		createIntegrante(atorId: string, dados: CadastroIntegrante) {
			const next = data()
			const ator = next.integrantes.find(
				(item) => item.id === atorId && item.ativo,
			)
			if (!ator || !perfisParaCadastro(ator.perfil).length)
				throw new CadastroIntegranteError(
					'Você não tem permissão para cadastrar integrantes.',
				)
			const campos = validarCadastroIntegrante(dados, {
				perfis: perfisParaCadastro(ator.perfil),
				subsistemas: next.subsistemas,
			})
			if (Object.keys(campos).length)
				throw new CadastroIntegranteError(
					'Confira os campos indicados.',
					campos,
				)
			const existente = next.integrantes.find(
				(item) => item.identificador === dados.identificador,
			)
			if (existente) {
				const message =
					!existente.ativo &&
					podeAdministrarPerfil(ator.perfil, existente.perfil)
						? 'Este identificador pertence a uma conta desativada. Reative a conta existente em vez de cadastrar outra.'
						: 'Este identificador já está em uso. Confira o RA ou SIAPE informado.'
				throw new CadastroIntegranteError(message, {
					identificador: message,
				})
			}
			if (failCreate) {
				failCreate = false
				throw new CadastroIntegranteError(
					'Não foi possível cadastrar o integrante. Tente novamente.',
				)
			}
			const integrante: Integrante = {
				id: crypto.randomUUID(),
				nome: dados.nome.trim(),
				identificador: dados.identificador,
				perfil: dados.perfil,
				subsistemaId: dados.subsistemaId,
				ativo: true,
				financeiro: false,
				passwordChangePending: true,
			}
			// The generated value is returned once; only account metadata is persisted.
			const alphabet =
				'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*+-'
			const random = crypto.getRandomValues(new Uint8Array(20))
			const senhaProvisoria = Array.from(
				random,
				(value) => alphabet[value % alphabet.length],
			).join('')
			next.integrantes.push(integrante)
			try {
				storage.setItem(DEMO_DATA_KEY, JSON.stringify(safeData(next)))
			} catch {
				throw new CadastroIntegranteError(
					'Não foi possível salvar o integrante neste navegador. Verifique o armazenamento e tente novamente.',
				)
			}
			return { integrante, senhaProvisoria }
		},
		failNextCreate() {
			failCreate = true
		},
		read(): DemoData {
			if (failNext) {
				failNext = false
				throw new Error(
					'Não foi possível carregar os integrantes demonstrativos.',
				)
			}
			return data()
		},
		detail(
			visualizador: Visualizador,
			integranteId: string,
		): IntegranteVisivel | null {
			const source = data()
			const target = source.integrantes.find(
				(item) => item.id === integranteId,
			)
			if (!target) return null
			const authorized = filtrarIntegrantesVisiveis(
				source.integrantes,
				visualizador,
			)
			const visible = authorized.find((item) => item.id === integranteId)
			if (!visible) return null
			return {
				...visible,
				subsistema:
					source.subsistemas.find(
						(sub) => sub.id === visible.subsistemaId,
					)?.nome ?? null,
			}
		},
		administrationOptions(
			atorId: string,
			integranteId: string,
		): OpcoesAdministracaoIntegrante {
			const source = data()
			const ator = source.integrantes.find(
				(item) => item.id === atorId && item.ativo,
			)
			const target = source.integrantes.find(
				(item) => item.id === integranteId,
			)
			const permitted =
				!!ator &&
				!!target &&
				podeAdministrarPerfil(ator.perfil, target.perfil)
			const self = atorId === integranteId
			const bloqueioStatus =
				permitted && target?.financeiro
					? 'Retire ou transfira a responsabilidade financeira antes de desativar esta conta.'
					: permitted && target?.perfil === 'lider' && target.ativo
						? 'Defina outro Líder para este subsistema antes de desativar esta conta.'
						: null
			const rolesForActor =
				ator?.perfil === 'capitao'
					? (['capitao', 'gestor', 'membro', 'orientador'] as const)
					: (['membro', 'orientador'] as const)
			return {
				perfis:
					permitted &&
					!self &&
					target?.perfil !== 'lider' &&
					!target?.financeiro
						? [...rolesForActor]
						: [],
				subsistemas: permitted ? source.subsistemas : [],
				podeEditarDados: permitted && !self,
				podeAlterarStatus: permitted && !self && !bloqueioStatus,
				podeRedefinirSenha: permitted,
				bloqueioStatus,
			}
		},
		administer(
			atorId: string,
			integranteId: string,
			changes: AlteracaoIntegrante,
		) {
			const next = data()
			const ator = next.integrantes.find(
				(item) => item.id === atorId && item.ativo,
			)
			const target = next.integrantes.find(
				(item) => item.id === integranteId,
			)
			if (
				!ator ||
				!target ||
				!podeAdministrarPerfil(ator.perfil, target.perfil)
			)
				throw new AdministracaoIntegranteError(
					'Você não tem permissão para administrar esta conta.',
				)
			if (
				atorId === integranteId &&
				(changes.nome !== undefined ||
					changes.identificador !== undefined ||
					changes.perfil !== undefined ||
					changes.ativo === false)
			)
				throw new AdministracaoIntegranteError(
					'Você não pode alterar seus próprios dados administrativos nem desativar sua conta.',
				)
			if (changes.perfil !== undefined) {
				if (
					target.perfil === 'lider' ||
					String(changes.perfil) === 'lider'
				)
					throw new AdministracaoIntegranteError(
						'A liderança é definida em um fluxo próprio do subsistema.',
						{ perfil: 'Use o fluxo de liderança do subsistema.' },
					)
				if (
					ator.perfil === 'gestor' &&
					!['membro', 'orientador'].includes(changes.perfil)
				)
					throw new AdministracaoIntegranteError(
						'Você não tem permissão para atribuir este perfil.',
						{ perfil: 'Perfil fora da sua responsabilidade.' },
					)
				if (target.financeiro && changes.perfil !== target.perfil)
					throw new AdministracaoIntegranteError(
						'Retire ou transfira a responsabilidade financeira antes de alterar o perfil.',
						{
							perfil: 'A atribuição financeira precisa ser tratada em seu fluxo próprio.',
						},
					)
			}
			if (target.perfil === 'lider' && changes.ativo === false)
				throw new AdministracaoIntegranteError(
					'Defina outro Líder para este subsistema antes de desativar esta conta.',
					{ ativo: 'A liderança precisa ser substituída primeiro.' },
				)
			if (target.financeiro && changes.ativo === false)
				throw new AdministracaoIntegranteError(
					'Retire ou transfira a responsabilidade financeira antes de desativar esta conta.',
					{ ativo: 'A atribuição financeira ainda está ativa.' },
				)
			const proximoPerfil = changes.perfil ?? target.perfil
			let proximoSubsistemaId = target.subsistemaId
			if (proximoPerfil === 'capitao') {
				proximoSubsistemaId = null
			} else if (
				target.perfil === 'capitao' ||
				(target.subsistemaId === null && proximoPerfil !== 'orientador')
			) {
				if (changes.subsistemaId === undefined)
					throw new AdministracaoIntegranteError(
						'Selecione um subsistema para este perfil.',
						{ subsistemaId: 'Selecione um subsistema.' },
					)
				proximoSubsistemaId = changes.subsistemaId
			} else if (
				changes.subsistemaId !== undefined &&
				changes.subsistemaId !== target.subsistemaId
			) {
				throw new AdministracaoIntegranteError(
					'A transferência entre subsistemas deve ser feita pelo fluxo próprio.',
					{
						subsistemaId:
							'Use o fluxo de transferência de integrantes.',
					},
				)
			}
			if (
				proximoPerfil !== 'capitao' &&
				proximoPerfil !== 'orientador' &&
				proximoSubsistemaId === null
			)
				throw new AdministracaoIntegranteError(
					'Selecione um subsistema para este perfil.',
					{
						subsistemaId:
							'Este perfil precisa pertencer a um subsistema.',
					},
				)
			if (
				proximoSubsistemaId !== null &&
				!next.subsistemas.some(
					(subsistema) => subsistema.id === proximoSubsistemaId,
				)
			)
				throw new AdministracaoIntegranteError(
					'Selecione um subsistema disponível.',
					{
						subsistemaId:
							'O subsistema selecionado não está disponível.',
					},
				)
			if (changes.nome !== undefined) {
				const nome = changes.nome.trim()
				if (!nome)
					throw new AdministracaoIntegranteError(
						'Informe o nome completo.',
						{ nome: 'Informe o nome completo.' },
					)
				if (nome.length > 150)
					throw new AdministracaoIntegranteError(
						'O nome deve ter até 150 caracteres.',
						{ nome: 'O nome deve ter até 150 caracteres.' },
					)
				target.nome = nome
			}
			if (changes.identificador !== undefined) {
				if (!/^\d{1,20}$/.test(changes.identificador))
					throw new AdministracaoIntegranteError(
						'Informe um identificador numérico de até 20 caracteres.',
						{ identificador: 'Use de 1 a 20 números.' },
					)
				if (
					next.integrantes.some(
						(item) =>
							item.id !== target.id &&
							item.identificador === changes.identificador,
					)
				)
					throw new AdministracaoIntegranteError(
						'Este identificador já está em uso.',
						{ identificador: 'Este identificador já está em uso.' },
					)
				target.identificador = changes.identificador
			}
			if (
				changes.ativo === false &&
				target.perfil === 'capitao' &&
				target.ativo &&
				next.integrantes.filter(
					(item) =>
						item.ativo &&
						item.perfil === 'capitao' &&
						item.id !== target.id,
				).length === 0
			)
				throw new AdministracaoIntegranteError(
					'Não é possível desativar o último Capitão ativo.',
					{ ativo: 'Mantenha ao menos um Capitão ativo.' },
				)
			if (
				changes.perfil !== undefined &&
				target.perfil === 'capitao' &&
				target.ativo &&
				changes.perfil !== 'capitao' &&
				next.integrantes.filter(
					(item) =>
						item.ativo &&
						item.perfil === 'capitao' &&
						item.id !== target.id,
				).length === 0
			)
				throw new AdministracaoIntegranteError(
					'Não é possível alterar o perfil do último Capitão ativo.',
					{ perfil: 'Mantenha ao menos um Capitão ativo.' },
				)
			if (changes.perfil !== undefined) target.perfil = changes.perfil
			target.subsistemaId = proximoSubsistemaId
			if (changes.ativo !== undefined) target.ativo = changes.ativo
			persist(next)
		},
		resetTemporaryPassword(atorId: string, integranteId: string) {
			const next = data()
			const ator = next.integrantes.find(
				(item) => item.id === atorId && item.ativo,
			)
			const target = next.integrantes.find(
				(item) => item.id === integranteId,
			)
			if (
				!ator ||
				!target ||
				!podeAdministrarPerfil(ator.perfil, target.perfil)
			)
				throw new AdministracaoIntegranteError(
					'Você não tem permissão para redefinir esta senha.',
				)
			target.passwordChangePending = true
			persist(next)
			const alphabet =
				'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*+-'
			const random = crypto.getRandomValues(new Uint8Array(20))
			return Array.from(
				random,
				(value) => alphabet[value % alphabet.length],
			).join('')
		},
		failNextRead() {
			failNext = true
		},
		identities(perspective?: DemoPerspective): DemoIdentity[] {
			const source = data()
			return source.integrantes
				.filter(
					(item) =>
						item.ativo &&
						(!perspective ||
							(perspective === 'financeiro'
								? item.perfil === 'gestor' && item.financeiro
								: item.perfil === perspective)),
				)
				.map((item) => toIdentity(item, source))
		},
		identity(id: string): DemoIdentity | null {
			return this.identities().find((item) => item.id === id) ?? null
		},
		defaultIdentity(): DemoIdentity | null {
			return this.identities('gestor')[0] ?? null
		},
		updateIntegrante(id: string, changes: Partial<Integrante>) {
			const next = data()
			const item = next.integrantes.find(
				(candidate) => candidate.id === id,
			)
			if (!item)
				throw new Error('Integrante demonstrativo não encontrado.')
			const allowed = [
				'nome',
				'identificador',
				'perfil',
				'subsistemaId',
				'ativo',
				'financeiro',
				'passwordChangePending',
			] as const
			for (const key of allowed) {
				if (changes[key] !== undefined)
					Object.assign(item, { [key]: changes[key] })
			}
			if (item.financeiro) {
				for (const other of next.integrantes)
					if (other.id !== id) other.financeiro = false
			}
			persist(next)
		},
		reset() {
			try {
				storage.removeItem(DEMO_DATA_KEY)
			} catch {
				/* storage unavailable */
			}
		},
	}
}

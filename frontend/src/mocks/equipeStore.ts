import type {
	CadastroIntegrante,
	DemoIdentity,
	DemoPerspective,
	Integrante,
	SubsistemaDemo,
} from '../services/equipeTypes'
import { DEMO_DATA_KEY } from '../services/demoStorage.ts'
import {
	CadastroIntegranteError,
	perfisParaCadastro,
	podeAdministrarPerfil,
	validarCadastroIntegrante,
} from '../services/cadastroIntegrante.ts'

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

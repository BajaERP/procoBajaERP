import type {
	DemoIdentity,
	DemoPerspective,
	Integrante,
	SubsistemaDemo,
} from '../services/equipeTypes'

export const DEMO_DATA_KEY = 'proco.demo.equipe.v1'

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
	return {
		data,
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

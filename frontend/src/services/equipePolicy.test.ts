import assert from 'node:assert/strict'
import test from 'node:test'
import {
	filtrarIntegrantesVisiveis,
	pesquisarIntegrantes,
} from './equipePolicy.ts'
import type { Integrante, Visualizador } from './equipeTypes.ts'

const subsistemas = [
	{ id: 'gestao', nome: 'Gestão', ativo: true },
	{ id: 'chassi', nome: 'Chassi', ativo: true },
	{ id: 'inativo', nome: 'Suspensão', ativo: false },
]

const integrantes: Integrante[] = [
	{
		id: 'ana',
		nome: 'Ana Ribeiro',
		identificador: '123',
		perfil: 'capitao',
		subsistemaId: null,
		ativo: true,
		financeiro: false,
	},
	{
		id: 'bruno',
		nome: 'Bruno Lima',
		identificador: '456',
		perfil: 'gestor',
		subsistemaId: 'gestao',
		ativo: true,
		financeiro: true,
	},
	{
		id: 'carla',
		nome: 'Carla Souza',
		identificador: '789',
		perfil: 'membro',
		subsistemaId: 'gestao',
		ativo: true,
		financeiro: false,
		passwordChangePending: true,
	},
	{
		id: 'diego',
		nome: 'Diego Moraes',
		identificador: '901',
		perfil: 'lider',
		subsistemaId: 'chassi',
		ativo: true,
		financeiro: false,
	},
	{
		id: 'elisa',
		nome: 'Elisa Costa',
		identificador: '902',
		perfil: 'membro',
		subsistemaId: 'chassi',
		ativo: false,
		financeiro: false,
	},
]

test('Gestor consulta integrantes autorizados e identificadores', () => {
	const resultado = filtrarIntegrantesVisiveis(
		integrantes,
		{
			id: 'bruno',
			perfil: 'gestor',
			subsistemaId: 'gestao',
		},
		subsistemas,
	)
	assert.equal(resultado.length, 5)
	assert.equal(resultado[0].identificador, '123')
})

test('Gestor com atribuição financeira conserva a consulta de Gestor', () => {
	const resultado = filtrarIntegrantesVisiveis(
		integrantes,
		{
			id: 'bruno',
			perfil: 'gestor',
			subsistemaId: 'gestao',
		},
		subsistemas,
	)
	assert.equal(resultado.length, 5)
	assert.equal(
		resultado.find((item) => item.id === 'ana')?.identificador,
		'123',
	)
	assert.equal(
		resultado.find((item) => item.id === 'elisa')?.identificador,
		'902',
	)
})

test('Membro consulta apenas ativos do próprio subsistema e seu identificador', () => {
	const visualizador: Visualizador = {
		id: 'carla',
		perfil: 'membro',
		subsistemaId: 'gestao',
	}
	const resultado = filtrarIntegrantesVisiveis(
		integrantes,
		visualizador,
		subsistemas,
	)
	assert.deepEqual(
		resultado.map((item) => item.id),
		['bruno', 'carla'],
	)
	assert.equal(resultado[0].identificador, null)
	assert.equal(resultado[1].identificador, '789')
	assert.equal('passwordChangePending' in resultado[1], false)
	assert.deepEqual(pesquisarIntegrantes(resultado, '456', '', ''), [])
})

test('Líder não consulta integrante desativado do próprio subsistema', () => {
	const resultado = filtrarIntegrantesVisiveis(
		integrantes,
		{
			id: 'diego',
			perfil: 'lider',
			subsistemaId: 'chassi',
		},
		subsistemas,
	)
	assert.deepEqual(
		resultado.map((item) => item.id),
		['diego'],
	)
})

test('Orientador vê seu SIAPE, mas buscas não revelam identificadores de terceiros', () => {
	const resultado = filtrarIntegrantesVisiveis(
		[
			...integrantes,
			{
				id: 'joao',
				nome: 'João Almeida',
				identificador: '456789',
				perfil: 'orientador',
				subsistemaId: null,
				ativo: true,
				financeiro: false,
			},
		],
		{ id: 'joao', perfil: 'orientador', subsistemaId: null },
		subsistemas,
	)
	assert.equal(
		resultado.find((item) => item.id === 'joao')?.identificador,
		'456789',
	)
	assert.equal(
		resultado.find((item) => item.id === 'ana')?.identificador,
		null,
	)
	assert.equal(
		resultado.some((item) => item.id === 'elisa'),
		false,
	)
	assert.deepEqual(pesquisarIntegrantes(resultado, '123', '', ''), [])
})

test('Orientador vê apenas integrantes de subsistemas ativos, além de si e pessoas sem subsistema', () => {
	const orientadorInativo: Integrante = {
		id: 'orientador-inativo',
		nome: 'Orientador em Suspensão',
		identificador: '456790',
		perfil: 'orientador',
		subsistemaId: 'inativo',
		ativo: true,
		financeiro: false,
	}
	const integranteSuspensao: Integrante = {
		id: 'membro-inativo',
		nome: 'Membro em Suspensão',
		identificador: '456791',
		perfil: 'membro',
		subsistemaId: 'inativo',
		ativo: true,
		financeiro: false,
	}
	const resultado = filtrarIntegrantesVisiveis(
		[...integrantes, orientadorInativo, integranteSuspensao],
		{
			id: orientadorInativo.id,
			perfil: 'orientador',
			subsistemaId: orientadorInativo.subsistemaId,
		},
		subsistemas,
	)

	assert.deepEqual(
		resultado.map((item) => item.id),
		['ana', 'bruno', 'carla', 'diego', orientadorInativo.id],
	)
	assert.equal(
		resultado.find((item) => item.id === 'ana')?.identificador,
		null,
	)
	assert.equal(
		resultado.find((item) => item.id === orientadorInativo.id)
			?.identificador,
		'456790',
	)
})

test('Busca e filtros operam sobre dados recebidos', () => {
	const resultado = filtrarIntegrantesVisiveis(
		integrantes,
		{
			id: 'bruno',
			perfil: 'gestor',
			subsistemaId: 'gestao',
		},
		subsistemas,
	)
	assert.deepEqual(
		pesquisarIntegrantes(resultado, 'cArLa', 'membro', 'gestao').map(
			(item) => item.id,
		),
		['carla'],
	)
	assert.deepEqual(
		pesquisarIntegrantes(resultado, '', 'membro', 'chassi').map(
			(item) => item.id,
		),
		['elisa'],
	)
})

test('Capitão e Gestor podem ver troca pendente para administrar contas', () => {
	const resultado = filtrarIntegrantesVisiveis(integrantes, {
		id: 'ana',
		perfil: 'capitao',
		subsistemaId: null,
	})
	assert.equal(
		resultado.find((item) => item.id === 'carla')?.passwordChangePending,
		true,
	)
})

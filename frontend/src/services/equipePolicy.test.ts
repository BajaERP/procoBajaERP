import assert from 'node:assert/strict'
import test from 'node:test'
import {
	filtrarIntegrantesVisiveis,
	pesquisarIntegrantes,
} from './equipePolicy.ts'
import type { Integrante, Visualizador } from './equipeTypes.ts'

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
	const resultado = filtrarIntegrantesVisiveis(integrantes, {
		id: 'bruno',
		perfil: 'gestor',
		subsistemaId: 'gestao',
	})
	assert.equal(resultado.length, 5)
	assert.equal(resultado[0].identificador, '123')
})

test('Gestor com atribuição financeira conserva a consulta de Gestor', () => {
	const resultado = filtrarIntegrantesVisiveis(integrantes, {
		id: 'bruno',
		perfil: 'gestor',
		subsistemaId: 'gestao',
	})
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
	const resultado = filtrarIntegrantesVisiveis(integrantes, visualizador)
	assert.deepEqual(
		resultado.map((item) => item.id),
		['bruno', 'carla'],
	)
	assert.equal(resultado[0].identificador, null)
	assert.equal(resultado[1].identificador, '789')
	assert.deepEqual(pesquisarIntegrantes(resultado, '456', '', ''), [])
})

test('Líder não consulta integrante desativado do próprio subsistema', () => {
	const resultado = filtrarIntegrantesVisiveis(integrantes, {
		id: 'diego',
		perfil: 'lider',
		subsistemaId: 'chassi',
	})
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

test('Busca e filtros operam sobre dados recebidos', () => {
	const resultado = filtrarIntegrantesVisiveis(integrantes, {
		id: 'bruno',
		perfil: 'gestor',
		subsistemaId: 'gestao',
	})
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

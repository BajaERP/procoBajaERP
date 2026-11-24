import assert from 'node:assert/strict'
import test from 'node:test'
import { mapCurrentUser, mapApiRole, mapUsuario } from './apiMappers.ts'

test('mapeia os perfis e conserva a atribuição financeira como atributo do Gestor', () => {
	assert.deepEqual(
		['CAPITAO_ADMIN', 'GESTOR', 'LIDER', 'MEMBRO', 'ORIENTADOR'].map(
			mapApiRole,
		),
		['capitao', 'gestor', 'lider', 'membro', 'orientador'],
	)
	assert.throws(() => mapApiRole('FINANCEIRO'))

	const user = mapCurrentUser({
		id: 52,
		nome: 'Carla Gestora',
		ra: '20260052',
		perfil: 'GESTOR',
		gestorFinanceiro: true,
		trocaDeSenhaPendente: true,
		subsistema: { id: 4, nome: 'Financeiro' },
		permissoes: ['EQUIPE_CONSULTAR'],
	})
	assert.equal(user.id, '52')
	assert.equal(user.role, 'gestor')
	assert.equal(user.financial, true)
	assert.equal(user.passwordChangePending, true)
	assert.deepEqual(user.permissions, ['EQUIPE_CONSULTAR'])
	assert.equal(user.isDemo, false)
})

test('mapeia RA oculto e associações sem inventar valores', () => {
	assert.deepEqual(
		mapUsuario({
			id: 18,
			nome: 'Pessoa',
			ra: null,
			perfil: 'MEMBRO',
			gestorFinanceiro: false,
			subsistema: null,
			ativo: true,
		}),
		{
			id: '18',
			nome: 'Pessoa',
			identificador: null,
			perfil: 'membro',
			subsistemaId: null,
			subsistema: null,
			ativo: true,
			financeiro: false,
		},
	)
})

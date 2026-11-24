import assert from 'node:assert/strict'
import test from 'node:test'
import { createDemoStore } from '../mocks/equipeStore.ts'
import { chooseDemoIdentity, identitiesForPerspective } from './demoSession.ts'

const storage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }
const identities = createDemoStore(storage).identities()

test('sessão com pessoa desativada volta ao Gestor padrão e avisa', () => {
	const chosen = chooseDemoIdentity(identities, 'inexistente')
	assert.equal(chosen.identity?.id, 'bruno')
	assert.match(chosen.notice ?? '', /indisponível/)
})

test('ausência de Gestor seleciona outra identidade ativa coerente', () => {
	const chosen = chooseDemoIdentity(
		identities.filter((item) => item.role !== 'gestor'),
		'inexistente',
	)
	assert.equal(chosen.identity?.id, 'ana')
	assert.equal(chosen.perspective, 'capitao')
	assert.match(chosen.notice ?? '', /indisponível/)
})

test('mudança de perfil seleciona outra pessoa na perspectiva anterior', () => {
	const changed = identities.map((item) =>
		item.id === 'diego' ? { ...item, role: 'membro' as const } : item,
	)
	const chosen = chooseDemoIdentity(changed, 'diego', 'lider')
	assert.equal(chosen.identity?.id, 'gabriel')
	assert.equal(chosen.perspective, 'lider')
	assert.match(chosen.notice ?? '', /indisponível/)
})

test('retirada financeira mantém uma perspectiva coerente com aviso', () => {
	const changed = identities.map((item) => ({ ...item, financial: false }))
	const chosen = chooseDemoIdentity(changed, 'bruno', 'financeiro')
	assert.equal(chosen.identity?.id, 'bruno')
	assert.equal(chosen.perspective, 'gestor')
	assert.match(chosen.notice ?? '', /indisponível/)
})

test('sem identidade ativa informa indisponibilidade e não cria usuário', () => {
	const chosen = chooseDemoIdentity([], 'bruno', 'gestor')
	assert.equal(chosen.identity, null)
	assert.match(chosen.notice ?? '', /indisponível/)
})

test('visão financeira contém só o Gestor atribuído e perfil não inventa usuário', () => {
	assert.deepEqual(
		identitiesForPerspective(identities, 'financeiro').map(
			(item) => item.id,
		),
		['bruno'],
	)
	assert.equal(
		identitiesForPerspective(identities, 'lider').some(
			(item) => item.id === 'bruno',
		),
		false,
	)
})

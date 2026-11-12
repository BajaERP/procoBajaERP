import assert from 'node:assert/strict'
import test from 'node:test'
import { getEquipePageContentKeys } from './equipePageKeys.ts'

test('conteúdos de equipe têm chaves distintas quando são irmãos', () => {
	const keys = getEquipePageContentKeys('ana', 'capitao', 1)
	assert.equal(new Set(Object.values(keys)).size, 4)
})

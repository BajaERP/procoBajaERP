import assert from 'node:assert/strict'
import test from 'node:test'
import { getEquipePageContentKeys } from './equipePageKeys.ts'

test('conteúdos irmãos têm chaves distintas na rota financeira', () => {
	const keys = getEquipePageContentKeys('ana', 'capitao', 1)
	assert.notEqual(keys.integrantes, keys.financeiro)
	assert.notEqual(keys.subsistemas, keys.financeiro)
})

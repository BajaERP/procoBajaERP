import assert from 'node:assert/strict'
import test from 'node:test'
import { mensagemSemSelecao } from './definirLiderEstado.ts'

test('orienta a escolher um Membro quando existem opções sem seleção', () => {
	assert.equal(
		mensagemSemSelecao(2),
		'Selecione um Membro para ver as consequências.',
	)
})

test('informa que não há Membros ativos quando a lista está vazia', () => {
	assert.equal(
		mensagemSemSelecao(0),
		'Não há Membros ativos disponíveis para definir como Líder.',
	)
})

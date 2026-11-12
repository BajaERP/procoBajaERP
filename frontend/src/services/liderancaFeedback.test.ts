import assert from 'node:assert/strict'
import test from 'node:test'
import { toast } from 'sonner'
import {
	notificarFalhaLideranca,
	notificarSucessoLideranca,
} from './liderancaFeedback.ts'

test('falha de definição emite toast Sonner para o toaster da liderança', () => {
	const id = notificarFalhaLideranca('Não foi possível salvar.')
	const emitted = toast.getToasts().find((item) => item.id === id)

	assert.ok(emitted && 'title' in emitted)
	assert.equal(emitted?.title, 'Não foi possível salvar.')
	assert.equal(emitted?.type, 'error')
	assert.equal(emitted?.toasterId, 'lideranca-modal')
})

test('sucesso de definição emite toast Sonner para o toaster da liderança', () => {
	const id = notificarSucessoLideranca('Chassi')
	const emitted = toast.getToasts().find((item) => item.id === id)

	assert.ok(emitted && 'title' in emitted)
	assert.equal(emitted?.title, 'Liderança de Chassi atualizada.')
	assert.equal(emitted?.type, 'success')
	assert.equal(emitted?.toasterId, 'lideranca')
})

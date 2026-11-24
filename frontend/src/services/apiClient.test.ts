import assert from 'node:assert/strict'
import test from 'node:test'
import { ApiError, createApiClient } from './apiClient.ts'

test('obtém o token CSRF e o reenvia em operações que alteram dados', async () => {
	let cookie: string | null = null
	const requests: { input: RequestInfo | URL; init?: RequestInit }[] = []
	const client = createApiClient({
		readCookie: () => cookie,
		fetcher: async (input, init) => {
			requests.push({ input, init })
			if (input === '/api/auth/csrf') {
				cookie = 'csrf-token'
				return new Response(null, { status: 204 })
			}
			return Response.json({ id: 9 }, { status: 201 })
		},
	})

	const result = await client.request<{ id: number }>('/api/usuarios', {
		method: 'POST',
		body: { nome: 'Pessoa' },
	})

	assert.deepEqual(result, { id: 9 })
	assert.equal(requests[0]?.input, '/api/auth/csrf')
	const mutation = requests[1]?.init
	assert.equal(mutation?.credentials, 'same-origin')
	assert.equal(
		new Headers(mutation?.headers).get('X-XSRF-TOKEN'),
		'csrf-token',
	)
	assert.equal(mutation?.body, JSON.stringify({ nome: 'Pessoa' }))
})

test('converte ProblemDetail em erro legível e preserva os erros de campo', async () => {
	const client = createApiClient({
		readCookie: () => 'csrf-token',
		fetcher: async () =>
			Response.json(
				{
					title: 'Bad Request',
					detail: 'Confira os campos destacados.',
					erros: { ra: 'Este RA já está em uso.' },
				},
				{ status: 400 },
			),
	})

	await assert.rejects(
		client.request('/api/usuarios', { method: 'POST', body: {} }),
		(error: unknown) => {
			assert.ok(error instanceof ApiError)
			assert.equal(error.message, 'Confira os campos destacados.')
			assert.deepEqual(error.fields, { ra: 'Este RA já está em uso.' })
			return true
		},
	)
})

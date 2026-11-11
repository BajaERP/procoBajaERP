import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('filtro inclui subsistema autorizado sem integrantes', async () => {
	const server = await createServer({
		configFile: false,
		server: { middlewareMode: true, hmr: false },
	})
	try {
		const { IntegrantesList } = await server.ssrLoadModule(
			'/src/components/pages/equipe/IntegrantesList.tsx',
		)
		const html = renderToStaticMarkup(
			React.createElement(IntegrantesList, {
				data: {
					integrantes: [],
					subsistemasAtivos: 2,
					gestoresFinanceirosAtivos: 0,
					subsistemas: [
						{ id: 'gestao', nome: 'Gestão' },
						{ id: 'freios', nome: 'Freios' },
					],
				},
			}),
		)
		assert.match(html, /<option value="freios">Freios<\/option>/)
	} finally {
		await server.close()
	}
})

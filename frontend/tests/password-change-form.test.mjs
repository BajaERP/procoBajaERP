import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('troca obrigatória permite sair e ambas as modalidades permitem simular falha', async () => {
	const server = await createServer({
		configFile: false,
		server: { middlewareMode: true, hmr: false },
	})
	try {
		const { AuthProvider } = await server.ssrLoadModule(
			'/src/contexts/AuthContext.tsx',
		)
		const { ThemeProvider } = await server.ssrLoadModule(
			'/src/contexts/ThemeContext.tsx',
		)
		const { PasswordChangeForm } = await server.ssrLoadModule(
			'/src/components/pages/configuracoes/PasswordChangeForm.tsx',
		)
		function render(required) {
			return renderToStaticMarkup(
				React.createElement(
					ThemeProvider,
					null,
					React.createElement(
						AuthProvider,
						null,
						React.createElement(PasswordChangeForm, { required }),
					),
				),
			)
		}
		const required = render(true)
		const voluntary = render(false)
		assert.match(required, />Sair<\/button>/)
		assert.match(required, /Simular falha nesta troca/)
		assert.match(voluntary, /Simular falha nesta troca/)
		assert.doesNotMatch(voluntary, />Sair<\/button>/)
	} finally {
		await server.close()
	}
})

# ProcoBaja ERP — Frontend

Siga também o [AGENTS.md da raiz](../AGENTS.md).

## Referências por mudança

- Para rotas, sessão, API ou execução local, consulte a [arquitetura do frontend](ARCHITECTURE.md).
- Para layout, componentes, temas, responsividade ou acessibilidade, consulte o [guia de design](DESIGN.md). Ele registra os ajustes do projeto em relação ao Figma.

## Implementação

- Componha rotas em `src/pages/` e mantenha seus componentes exclusivos em `src/components/pages/<pagina>/`. Use `src/components/layout/` para a estrutura do aplicativo e `src/components/shared/` quando houver reutilização entre páginas.
- Em Equipe e Subsistemas, use a interface de `src/services/equipe.ts` e preserve o comportamento nos dois modos. Use as permissões da sessão para apresentar ações e trate as recusas da API. O backend valida identidade, permissão, escopo e regras de negócio.
- Use os tokens semânticos de `src/styles.css` para cores e `lucide-react` para ícones. Siga a [configuração do Prettier](.prettierrc.json) ao editar código.

## Verificação

Execute em `frontend/` após mudanças de código. Para instalação e versão de Node, consulte a seção de [execução local](ARCHITECTURE.md#execução-local).

```bash
npm run format:check
npm run build
node --experimental-strip-types --test
```

- Em mudanças de layout ou interação, confira no navegador os estados e tamanhos afetados e siga a [validação visual](DESIGN.md#validação-de-mudanças-visuais).
- Em mudanças de navegação ou de sessão, confira a seleção da sidebar, o destino padrão após login, o retorno à rota solicitada e a troca obrigatória de senha, conforme o fluxo afetado.
- Em mudanças na integração, use `VITE_DEMO_MODE=false` com o backend ativo e uma conta de teste. Confira o caminho de sucesso e as recusas relevantes para o perfil e o escopo.
- Informe os comandos e cenários verificados, os resultados e as limitações do ambiente.

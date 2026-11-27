# Arquitetura do frontend

O frontend do ProcoBaja ERP é uma aplicação React de página única. Login, Conta em Configurações e Equipe e Subsistemas usam a API quando o modo demonstrativo está desabilitado. Configurações também inclui a preferência de tema, mantida no navegador. As rotas dos módulos 2 a 8 exibem páginas em construção, incluindo o Dashboard. A rota `/app/gestao` também exibe uma página em construção.

React e TypeScript compõem a aplicação. Vite cuida do servidor de desenvolvimento e do build, Tailwind CSS v4 dos estilos, React Router da navegação, Lucide React dos ícones e Sonner das notificações. As versões e os scripts ficam em [`package.json`](package.json). O [lockfile](package-lock.json) orienta a instalação com `npm ci`.

## Organização

| Caminho em `src/` | Responsabilidade |
| --- | --- |
| `main.tsx` e `App.tsx` | Inicialização do React, provedores e roteador |
| `app/` | Rotas, proteção de sessão e estrutura compartilhada da aplicação |
| `pages/` e `components/pages/` | Composição das rotas e componentes específicos de cada página |
| `components/layout/`, `components/shared/` e `components/dev/` | Sidebar e barra superior, componentes compartilhados e controles de demonstração |
| `contexts/` | Sessão e tema |
| `services/` | Cliente HTTP, adaptadores, conversão dos dados da API e regras de apresentação |
| `mocks/` | Adaptador e armazenamento dos dados fictícios |
| `styles.css` e `assets/` | Tokens, estilos globais e identidade visual |

## Rotas e navegação

O roteador usa `createHashRouter`. Os caminhos abaixo aparecem após `#` no endereço, como em `/#/login`. A lista completa fica em [`routes.tsx`](src/app/routes.tsx).

| Caminho | Comportamento |
| --- | --- |
| `/` | Exibe a introdução e avança automaticamente para o login. Uma sessão válida segue para o Dashboard. |
| `/login` | Recebe RA e senha. Após a autenticação, abre a rota protegida solicitada ou usa `/app/dashboard` como destino padrão. |
| `/app/*` | Aguarda recuperar a sessão. A proteção redireciona ao login quando necessário e guarda o caminho solicitado. Se houver troca de senha pendente, apresenta o formulário obrigatório antes de montar o `Shell` e mantém a rota após a troca. |
| `/app/equipe` | Redireciona para `/app/equipe/integrantes`. O módulo oferece as abas Integrantes e Subsistemas, além de Histórico para quem tem `AUDITORIA_CONSULTAR`. |
| `/app/configuracoes` | Exibe Conta, troca voluntária de senha e Aparência. |

O `Shell` contém sidebar, barra superior e conteúdo da rota. A sidebar apresenta uma entrada principal por módulo e a mesma lista para todos os perfis. Em telas estreitas, abre em um drawer. Em Equipe e Subsistemas, **Perfis e permissões** abre um diálogo informativo e **Gestor Financeiro** abre a consulta de responsabilidade financeira. Esses atalhos complementam as abas do módulo.

## Sessão e dados

### API

- O login envia as credenciais a `POST /api/auth/login`. O servidor mantém a sessão em cookie HttpOnly e devolve identidade, perfil, permissões e estado da troca de senha. No navegador, `AuthContext` mantém a identidade em memória e a recupera por `GET /api/auth/eu` ao recarregar a aplicação. O login oferece nova tentativa quando falha a consulta de sessão. Um `401` em uma operação protegida encerra a sessão no frontend e preserva a rota para novo login. **Sair** usa `POST /api/auth/logout`.
- As trocas obrigatória e voluntária usam `PUT /api/auth/senha`. O servidor valida a senha atual, atualiza a sessão vigente e encerra as demais sessões. O formulário mantém as senhas apenas em memória.
- [`apiClient.ts`](src/services/apiClient.ts) chama caminhos relativos a `/api` na mesma origem do frontend. Antes de uma operação que altera dados, obtém `XSRF-TOKEN` por `GET /api/auth/csrf` se o cookie estiver ausente e envia seu valor no cabeçalho `X-XSRF-TOKEN`. Converte respostas de erro da API em mensagens e erros de campo.
- [`equipe.ts`](src/services/equipe.ts) seleciona o adaptador HTTP, que converte as respostas do servidor e atende aos fluxos de consulta, administração de integrantes e subsistemas, liderança, transferências, sucessão e auditoria. O histórico tem escopo, filtros e paginação no servidor. A responsabilidade financeira acompanha o vínculo do Gestor ativo ao subsistema Financeiro. Alterações que podem afetar a identidade atual solicitam nova consulta de sessão.
- Os dados e as permissões retornados pela API orientam a visibilidade das ações. A matriz **Perfis e permissões** é informativa e definida no frontend. O backend aplica a autorização de cada operação e o escopo de cada consulta. Consulte a [arquitetura do backend](../backend/ARCHITECTURE.md) para o contrato e suas validações.

### Demonstração

O servidor de desenvolvimento usa a demonstração por padrão. O formulário aceita RA numérico e senha preenchida para selecionar o Gestor fictício padrão. No shell, o botão **Dev** permite escolher a perspectiva e uma identidade ativa, inclusive com troca de senha pendente. **Gestor Financeiro** representa a perspectiva de um Gestor que tem a atribuição financeira.

A demonstração grava o ID e a perspectiva escolhidos em `proco.auth.user` e os registros fictícios sem senhas em `proco.demo.equipe.v1`. Alterações na base atualizam a sessão e a listagem. Se a identidade selecionada ficar indisponível, a aplicação procura uma alternativa válida e mostra um aviso. A opção **Restaurar dados demonstrativos** pede confirmação antes de repor a base e retornar à identidade padrão. Controles de simulação de falhas ficam restritos a esse modo.

### Tema

`ThemeContext` controla Claro, Escuro e Sistema. As escolhas explícitas são salvas como `proco.theme` no armazenamento local. Sistema acompanha `prefers-color-scheme`. O script em [`index.html`](index.html) aplica a preferência antes da montagem do React. Consulte o [guia de design](DESIGN.md) para tokens e variantes.

## Execução local

Use Node 22.18 ou mais recente na série 22, ou Node 24, para executar o Vite e a suíte nativa de testes. A partir da raiz, instale as dependências e inicie a demonstração.

```bash
cd frontend
npm ci
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`. Para testar a integração, inicie o backend, prepare uma conta de teste e inicie o Vite em modo API a partir de `frontend/`.

```bash
VITE_DEMO_MODE=false npm run dev
```

O [proxy do Vite](vite.config.ts) encaminha `/api` a `http://localhost:8080` por padrão. Defina `VITE_API_PROXY_TARGET` no ambiente do Vite se o backend estiver em outro endereço. Com Docker Compose, defina `VITE_DEMO_MODE=false` no `.env` da raiz. O Compose configura o proxy para `http://backend:8080`. O guia de [Docker no desenvolvimento](../docs/infraestrutura/docker/docker-dev.md) descreve a criação da conta inicial, as portas e a atualização do volume de dependências. Use variáveis `VITE_` apenas para configurações públicas.

Para verificação de código e fluxos no navegador, siga [AGENTS.md](AGENTS.md#verificação). `npm run format` aplica o Prettier. `npm run preview` serve localmente o build gerado.

## Build e produção

`npm run build` verifica os tipos com TypeScript e gera `frontend/dist/`. O build usa sempre a API e exclui o adaptador com os dados fictícios. O [Dockerfile](Dockerfile) copia os arquivos estáticos para o Nginx, que os serve na porta 80 do container. Em produção, o proxy HTTPS encaminha a página ao frontend e `/api` ao backend na mesma origem. Consulte o [guia de Docker em produção](../docs/infraestrutura/docker/docker-prod.md).

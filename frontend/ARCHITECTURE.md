# Arquitetura do frontend

O frontend do ProcoBaja ERP é uma aplicação React de página única, localizada em [`frontend/`](./). O módulo Equipe e Subsistemas está conectado à autenticação e à API do backend; os outros módulos ainda apresentam páginas em construção.

## Tecnologias

A aplicação usa React e TypeScript, com Vite para desenvolvimento e build, Tailwind CSS v4 para estilos, React Router para navegação e Lucide React para ícones. O Prettier padroniza a formatação. As versões e os comandos são mantidos em [`package.json`](./package.json), com instalação reproduzível pelo `package-lock.json`.

## Organização

```text
frontend/src/
├── app/                   # Rotas, proteção de sessão e shell
├── assets/                # Logos da equipe
├── components/
│   ├── layout/            # Sidebar e barra superior
│   ├── pages/             # Componentes específicos de cada página
│   └── shared/            # Componentes compartilhados
├── contexts/              # Sessão e tema
├── mocks/                 # Dados fictícios exclusivos do desenvolvimento
├── pages/                 # Composição das páginas e navegação
├── services/              # APIs, adaptadores demo e regras de apresentação
├── App.tsx                # Provedores e roteador
├── main.tsx               # Inicialização do React
└── styles.css             # Tokens, temas e estilos globais
```

As páginas compõem seções e coordenam dados ou navegação próprios da rota. Componentes exclusivos ficam em `components/pages/<pagina>/`; componentes comuns ficam em `shared/` ou `layout/`, conforme sua responsabilidade. As regras visuais e de responsividade estão em [`frontend/DESIGN.md`](./DESIGN.md); orientações de desenvolvimento ficam em [`frontend/AGENTS.md`](./AGENTS.md).

## Navegação

O roteador usa `createHashRouter`, portanto os caminhos aparecem após `#` no endereço, por exemplo `/#/login` e `/#/app/dashboard`.

- `/` apresenta a introdução e avança automaticamente para o login; uma sessão válida existente segue para o Dashboard.
- `/login` recebe RA e senha. Após a autenticação, abre o Dashboard ou restaura uma rota protegida solicitada anteriormente.
- `/app/*` usa `ProtectedRoute` e `Shell`. Enquanto a identidade tiver troca de senha pendente, `ProtectedRoute` apresenta o formulário obrigatório antes de montar o `Shell`, inclusive em rotas acessadas diretamente; após o sucesso, mantém a rota solicitada. O shell reúne sidebar, barra superior e conteúdo da rota. No mobile, a navegação é apresentada em um drawer.
- A sidebar apresenta uma entrada principal por módulo, sem subitens; ainda não adapta o menu por perfil. Equipe e Subsistemas oferece abas internas para Integrantes e Subsistemas e para Histórico, quando a sessão recebe a permissão correspondente. Histórico, visibilidade e paginação são consultados no servidor. A responsabilidade financeira abre pelo indicador de Gestor Financeiro na lista, em um painel lateral no desktop e uma tela adaptada ao mobile. Outras rotas ainda exibem `PlaceholderPage`. As rotas atuais estão em [`routes.tsx`](./src/app/routes.tsx).

As páginas do módulo consultam `services/equipe.ts`, que seleciona o adaptador demonstrativo ou o adaptador HTTP. O modo demonstrativo existe apenas em desenvolvimento e é o padrão local; `VITE_DEMO_MODE=false` permite testar o backend pelo proxy same-origin do Vite. No build de produção, a seleção é sempre a API e os dados demonstrativos não são empacotados. O adaptador HTTP converte DTOs do backend para os tipos de apresentação e não aplica regras de autorização local: filtros da interface operam sobre os resultados já autorizados pelo servidor. A API usa paginação remota para o histórico e retorna somente seus campos públicos.

## Sessão e tema

`AuthContext` aguarda a recuperação da sessão antes de liberar rotas protegidas. No modo demonstrativo, o login aceita RA numérico e senha não vazia e seleciona uma identidade fictícia sem validar credenciais; `proco.auth.user` guarda apenas ID e perspectiva fictícios. No modo real, o login envia RA e senha a `/api/auth/login`; o backend mantém a sessão em cookie HttpOnly e retorna identidade, perfil, permissões e estado de troca obrigatória. A senha, o cookie e a sessão real nunca são gravados em `localStorage`. Uma falha de rede ao consultar `/api/auth/eu` é apresentada separadamente da ausência de sessão, e um `401` posterior encerra a sessão no frontend preservando a rota solicitada para novo login.

No modo demonstrativo, o botão **Dev** permite escolher um dos cinco perfis e uma pessoa ativa daquele perfil, inclusive identidades com troca de senha pendente. A visão adicional **Gestor Financeiro** seleciona o Gestor com atribuição financeira; não cria um sexto perfil. Header, sidebar e Conta refletem a identidade atual. No modo real, o frontend usa as permissões retornadas por `/api/auth/eu` para exibir ações e o backend valida cada operação. A troca obrigatória e a voluntária usam `PUT /api/auth/senha`; o backend valida a senha atual, atualiza a sessão vigente e encerra as demais sessões. Os campos não são persistidos pelo frontend.

`mocks/equipeStore.ts` mantém os registros fictícios em `proco.demo.equipe.v1`, sem senhas, e grava a versão do esquema dos dados. Essas identidades existem apenas quando `DEMO_MODE` está habilitado. Mudanças do serviço e eventos de armazenamento atualizam a identidade e a listagem; se a pessoa selecionada ficar indisponível, a demonstração escolhe outra identidade válida e avisa.

Gestor Financeiro é uma atribuição adicional a um Gestor ativo, determinada pela associação ao subsistema Financeiro. A interface consulta esse vínculo no backend; ela não oferece uma atribuição separada. Alterações de perfil, associação ou situação são validadas pelo servidor.

O controle **Restaurar dados demonstrativos** pede confirmação, restaura a base inicial e retorna ao Gestor fictício padrão. Os controles de falha simulada e alteração de dados de teste só aparecem quando a demonstração está ativa. No modo real, cadastro, edição, alteração de situação, redefinição provisória, transferências, liderança, sucessão e auditoria usam os endpoints correspondentes; o frontend atualiza a sessão a partir de `/api/auth/eu` após operações que podem alterar o perfil vigente.

O cliente HTTP usa `/api` na mesma origem e envia o cookie de sessão automaticamente. Antes de cada mutação, obtém o cookie `XSRF-TOKEN` e o reenvia em `X-XSRF-TOKEN`. O Vite encaminha `/api` ao backend no desenvolvimento; em produção, o proxy HTTPS deve encaminhar `/api` e o frontend pelo mesmo domínio. Erros RFC 9457 do backend são convertidos para mensagens e erros de campo. A autorização e a visibilidade continuam no servidor. O modelo relacional está documentado em [`docs/diagramas`](../docs/diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v5.dbml); variáveis públicas do Vite usam o prefixo `VITE_` e não devem conter segredos.

`ThemeContext` controla as preferências claro, escuro e sistema. A preferência explícita é salva em `localStorage` como `proco.theme`; a opção sistema acompanha `prefers-color-scheme`. Os tokens e as variantes escuras ficam em `styles.css`.

## Desenvolvimento e verificação

Para executar localmente:

```bash
cd frontend
npm ci
npm run dev
```

O Vite normalmente inicia em `http://localhost:5173`; caso a porta esteja ocupada, consulte o endereço exibido no terminal. Antes de concluir alterações, execute:

Para usar o backend real em execução local, configure `VITE_DEMO_MODE=false` no ambiente do Vite. No Compose, defina essa variável no `.env` da raiz. A sessão real usa cookies same-origin e CSRF.

```bash
npm run format:check
npm run build
node --experimental-strip-types --test
```

`npm run format` aplica o Prettier, e `npm run preview` serve o build localmente. A suíte usa o runner nativo do Node, sem script ou dependência adicional; com Node 22.18+ ou 24, o comando acima executa todos os arquivos `*.test.*` a partir de `frontend/`. Verifique também as interações afetadas no navegador.

Para Docker Compose e configuração de ambiente, consulte os guias de [desenvolvimento](../docs/infraestrutura/docker/docker-dev.md) e [produção](../docs/infraestrutura/docker/docker-prod.md). No desenvolvimento, `node_modules` fica em um volume próprio do container; ao adicionar uma dependência, atualize também esse ambiente e reinicie o servidor se necessário.

## Build de produção

`npm run build` executa a verificação TypeScript e o build do Vite em `frontend/dist/`. A imagem de produção definida em [`frontend/Dockerfile`](./Dockerfile) copia os arquivos gerados para o Nginx, que os serve na porta 80 do container.

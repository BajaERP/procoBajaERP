# Arquitetura do frontend

O frontend do ProcoBaja ERP é uma aplicação React de página única, localizada em [`frontend/`](./). A interface integrada ainda é um protótipo: a maior parte dos módulos apresenta páginas em construção, e a sessão não está conectada à autenticação do backend.

## Tecnologias

A aplicação usa React e TypeScript, com Vite para desenvolvimento e build, Tailwind CSS v4 para estilos, React Router para navegação e Lucide React para ícones. O Prettier padroniza a formatação. As versões e os comandos são mantidos em [`package.json`](./package.json), com instalação reproduzível pelo `package-lock.json`.

## Organização

```text
frontend/src/
├── app/                   # Rotas, proteção demonstrativa e shell
├── assets/                # Logos da equipe
├── components/
│   ├── layout/            # Sidebar e barra superior
│   ├── pages/             # Componentes específicos de cada página
│   └── shared/            # Componentes compartilhados
├── contexts/              # Sessão demonstrativa e tema
├── mocks/                 # Dados fictícios exclusivos do desenvolvimento
├── pages/                 # Composição das páginas e navegação
├── services/              # Fronteira de consulta e regras de visibilidade
├── App.tsx                # Provedores e roteador
├── main.tsx               # Inicialização do React
└── styles.css             # Tokens, temas e estilos globais
```

As páginas compõem seções e coordenam dados ou navegação próprios da rota. Componentes exclusivos ficam em `components/pages/<pagina>/`; componentes comuns ficam em `shared/` ou `layout/`, conforme sua responsabilidade. As regras visuais e de responsividade estão em [`frontend/DESIGN.md`](./DESIGN.md); orientações de desenvolvimento ficam em [`frontend/AGENTS.md`](./AGENTS.md).

## Navegação

O roteador usa `createHashRouter`, portanto os caminhos aparecem após `#` no endereço, por exemplo `/#/login` e `/#/app/dashboard`.

- `/` apresenta a introdução e avança automaticamente para o login; uma sessão demonstrativa existente segue para o Dashboard.
- `/login` recebe RA e senha. Após o acesso demonstrativo, abre o Dashboard ou restaura uma rota protegida solicitada anteriormente.
- `/app/*` usa `ProtectedRoute` e `Shell`. O shell reúne sidebar, barra superior e conteúdo da rota. No mobile, a navegação é apresentada em um drawer.
- A sidebar apresenta uma entrada principal por módulo, sem subitens; ainda não adapta o menu por perfil. Equipe e Subsistemas oferece abas internas para Integrantes e Subsistemas. Outras rotas ainda exibem `PlaceholderPage`. As rotas atuais estão em [`routes.tsx`](./src/app/routes.tsx).

Em desenvolvimento, a página de Integrantes consulta `services/equipe.ts`, que seleciona o serviço fictício em `mocks/equipe.ts`. O serviço aplica a visibilidade demonstrativa antes de entregar dados à tela; busca, filtros e paginação operam somente sobre essa lista recebida. O botão de simulação provoca uma falha na próxima consulta para conferir o estado de recuperação. Esta regra local não é autorização de dados reais. No build de produção, o módulo apresenta indisponibilidade até a integração e não inclui os dados fictícios do módulo.

## Sessão e tema

`AuthContext` mantém uma sessão **apenas demonstrativa** no navegador. Ele aceita um RA numérico de até 20 caracteres e uma senha não vazia, cria um usuário fictício e armazena os dados em `localStorage` sob `proco.auth.user`. A senha não é armazenada; os dados locais não representam um usuário autenticado pelo backend. `ProtectedRoute` depende desse estado local para o fluxo de interface: isso **não é autenticação ou autorização** e não protege dados reais. As informações indisponíveis não devem ser apresentadas como se viessem do servidor.

Após o login, o botão **Dev** no header permite escolher um dos seis perfis para a sessão demonstrativa. A seleção permanece após recarregar a página e é usada pelos componentes que leem o perfil, como a sidebar e a seção de conta. Essa ferramenta existe apenas no servidor de desenvolvimento do Vite; ela não testa nem concede permissões reais. Ao integrar autenticação, o perfil deve vir do backend e a autorização deve ser verificada no servidor.

O backend possui migrações de banco, mas o frontend ainda não consome endpoints de autenticação ou uma API de aplicação. O formulário de login atual não testa credenciais contra o servidor. O modelo relacional proposto está em [`docs/diagramas`](../docs/diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v4.dbml). Uma futura integração deve autenticar e autorizar no servidor; variáveis públicas do Vite usam o prefixo `VITE_` e não devem conter segredos.

`ThemeContext` controla as preferências claro, escuro e sistema. A preferência explícita é salva em `localStorage` como `proco.theme`; a opção sistema acompanha `prefers-color-scheme`. Os tokens e as variantes escuras ficam em `styles.css`.

## Desenvolvimento e verificação

Para executar localmente:

```bash
cd frontend
npm ci
npm run dev
```

O Vite normalmente inicia em `http://localhost:5173`; caso a porta esteja ocupada, consulte o endereço exibido no terminal. Antes de concluir alterações, execute:

```bash
npm run format:check
npm run build
```

`npm run format` aplica o Prettier, e `npm run preview` serve o build localmente. Não há comando de testes configurado no frontend; verifique as interações afetadas no navegador quando necessário.

Para Docker Compose e configuração de ambiente, consulte os guias de [desenvolvimento](../docs/infraestrutura/docker/docker-dev.md) e [produção](../docs/infraestrutura/docker/docker-prod.md). No desenvolvimento, `node_modules` fica em um volume próprio do container; ao adicionar uma dependência, atualize também esse ambiente e reinicie o servidor se necessário.

## Build de produção

`npm run build` executa a verificação TypeScript e o build do Vite em `frontend/dist/`. A imagem de produção definida em [`frontend/Dockerfile`](./Dockerfile) copia os arquivos gerados para o Nginx, que os serve na porta 80 do container.

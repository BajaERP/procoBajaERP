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
- A sidebar apresenta uma entrada principal por módulo, sem subitens; ainda não adapta o menu por perfil. Equipe e Subsistemas oferece abas internas para Integrantes e Subsistemas. A responsabilidade financeira abre pelo indicador de Gestor Financeiro na lista, em um painel lateral no desktop e uma tela adaptada ao mobile. Outras rotas ainda exibem `PlaceholderPage`. As rotas atuais estão em [`routes.tsx`](./src/app/routes.tsx).

Em desenvolvimento, a página de Integrantes consulta `services/equipe.ts`, que seleciona o serviço fictício em `mocks/equipe.ts`. O serviço aplica a visibilidade demonstrativa antes de entregar dados à tela; busca, filtros e paginação operam somente sobre essa lista recebida. O botão de simulação provoca uma falha na próxima consulta para conferir o estado de recuperação. Esta regra local não é autorização de dados reais. No build de produção, o módulo apresenta indisponibilidade até a integração e não inclui os dados fictícios do módulo.

## Sessão e tema

`AuthContext` mantém uma sessão **apenas demonstrativa e exclusiva de desenvolvimento**. O login preserva os campos de RA numérico (até 20 caracteres) e senha não vazia, mas assume o primeiro Gestor ativo dos dados fictícios, sem conferir credenciais. O armazenamento `proco.auth.user` guarda somente ID e perspectiva; a identidade é recuperada dos dados compartilhados. A inicialização aguarda essa recuperação antes de redirecionar rotas protegidas. A senha não é armazenada. `ProtectedRoute` coordena o fluxo local de interface; isso **não é autenticação ou autorização** e não protege dados reais. Em produção, o login informa indisponibilidade, não cria nem recupera sessões demonstrativas e não oferece os controles Dev.

Após o login, o botão **Dev** permite escolher um dos cinco perfis e uma pessoa ativa daquele perfil. A visão adicional **Gestor Financeiro** seleciona o Gestor com atribuição financeira; não cria um sexto perfil. Header, sidebar e Conta refletem nome, perfil e situação demonstrativa. A seção de Conta também mostra subsistema, RA ou SIAPE e troca de senha pendente. O estado pendente está disponível para testar os fluxos de senha previstos nas próximas etapas; esta etapa ainda não implementa a troca obrigatória.

`mocks/equipeStore.ts` mantém os registros compartilhados em `proco.demo.equipe.v1`, sem senhas. Cada leitura e alteração consulta o estado persistido, preservando alterações realizadas em outras abas. Mudanças do serviço e eventos de armazenamento atualizam a identidade e a listagem. Se a pessoa selecionada ficar indisponível para a perspectiva atual, outra da mesma perspectiva é escolhida; na ausência dela, a sessão tenta um Gestor ou outra pessoa ativa, atualiza a perspectiva e avisa. Sem pessoas ativas, volta ao login com a indicação de indisponibilidade. Uma tentativa de selecionar um perfil vazio mantém a identidade atual e apresenta um aviso.

Gestor Financeiro é uma atribuição adicional a um Gestor ativo. O Capitão atribui, retira ou transfere a responsabilidade por operações específicas do serviço mock; há no máximo uma atribuição, e a transferência grava a troca em uma única operação. A atribuição é persistida junto aos dados compartilhados e sincronizada com a visão demonstrativa `financeiro`. Desativação ou troca de perfil do responsável exige retirada ou transferência prévia, inclusive em operações gerais de administração. A interface demonstra essas regras locais e não autoriza operações no servidor.

O controle **Restaurar dados demonstrativos** pede confirmação, restaura a base inicial e retorna ao Gestor padrão. A falha de consulta pode ser simulada uma vez pelo botão da listagem. Alterações de dados para testar reatividade podem ser feitas pela operação de desenvolvimento `equipeService.atualizarIntegranteDemo`; as telas de cadastro e edição pertencem às próximas etapas. Esses recursos não concedem permissões reais: a integração deve buscar identidade e autorização no backend.

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

`npm run format` aplica o Prettier, e `npm run preview` serve o build localmente. Não há script de testes no `package.json`. Os testes de política, seleção de identidade e persistência usam o runner nativo do Node; com Node 22.18+ ou 24, execute `node --experimental-strip-types --test src/services/*.test.ts src/mocks/*.test.ts`. Verifique também as interações afetadas no navegador.

Para Docker Compose e configuração de ambiente, consulte os guias de [desenvolvimento](../docs/infraestrutura/docker/docker-dev.md) e [produção](../docs/infraestrutura/docker/docker-prod.md). No desenvolvimento, `node_modules` fica em um volume próprio do container; ao adicionar uma dependência, atualize também esse ambiente e reinicie o servidor se necessário.

## Build de produção

`npm run build` executa a verificação TypeScript e o build do Vite em `frontend/dist/`. A imagem de produção definida em [`frontend/Dockerfile`](./Dockerfile) copia os arquivos gerados para o Nginx, que os serve na porta 80 do container.

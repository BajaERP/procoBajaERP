# Backend: corrigir Gestor com responsabilidade financeira e modelo de dados

Status: ready-for-human

## Contexto

A regra anterior de um Financeiro vinculado a outro Usuário Gestor foi corrigida pelo responsável pelo projeto. A mesma pessoa deve ser Gestor antes de receber a responsabilidade financeira; ao recebê-la, seu Perfil continua sendo Gestor, conserva as funções de Gestor e ganha as funções financeiras por uma atribuição adicional. A interface a identifica como Gestor Financeiro. No máximo um Gestor pode ter essa responsabilidade por vez, a posição pode ficar vaga e só o Capitão pode atribuí-la ou retirá-la.

O modelo relacional v4, a especificação anterior e o backend incorporado pelos PRs #32 e #34 representam Gestor e Financeiro como Perfis distintos e preveem vínculo entre duas pessoas. A implementação existente precisa ser adaptada. A migração histórica V2 usou outra representação, mas não determina a solução atual.

## Trabalho esperado

- Adaptar os fluxos existentes de Usuário e Vínculo às decisões registradas nesta issue e no glossário.
- Atualizar o modelo relacional de referência para uma versão v5 corrigida e revisar os artefatos e regras afetados.
- Adaptar o esquema efetivo e os dados existentes com novas migrações Flyway, preservando as já versionadas. A V5 do Flyway já existe; a versão seguinte disponível atualmente é V6.
- O responsável informou que o sistema ainda não foi usado e não há dados antigos a migrar. A migração não concede a responsabilidade financeira a ninguém; veja em "Decisões" o tratamento de contas com o Perfil Financeiro.
- Adaptar perfis, permissões, identidade autenticada, regras de negócio e contratos da API para a regra acordada, com validação e testes no servidor.
- Comunicar o contrato ao responsável pelo frontend antes da integração final.

## Decisões (2026-11-17)

- **Representação:** tabela própria `atribuicao_financeira` com no máximo uma linha: o Gestor responsável, quem atribuiu e quando. Posição vaga é a tabela sem linha. A transferência troca o Gestor dessa linha numa única operação, então nunca há dois responsáveis.
- **Perfil Financeiro:** removido na V6, junto com `vinculos_financeiro_gestor`; ficam cinco Perfis. A permissão `VINCULOS_GERENCIAR` é renomeada para `ATRIBUICAO_FINANCEIRA_GERENCIAR`, que continua só do Capitão. Se a migração encontrar algum Usuário com o Perfil Financeiro, ela falha com uma mensagem clara, em vez de escolher um Perfil por ele. Isso substitui a ideia de manter essas contas desativadas para revisão.
- **Identidade e permissões:** `/api/auth/login` e `/api/auth/eu` informam `gestorFinanceiro`. As permissões do Gestor Financeiro são as do Perfil Gestor somadas a um conjunto fixo de permissões financeiras da atribuição, vazio até o módulo Financeiro criá-las. Como a sessão é relida a cada requisição, a mudança vale na hora.
- **Visibilidade:** quem pode ver o Gestor vê também que ele é o Gestor Financeiro, inclusive em listas e Composições.
- **Administração:** o Gestor passa a administrar só Usuários de Perfil Líder, Membro e Orientador.
- **Aprovação de compras:** o valor `FINANCEIRO` do tipo `papel_aprovador` vira `GESTOR_FINANCEIRO`. As tabelas do módulo Financeiro ainda estão vazias.

## Pronto quando

- O modelo e o backend representam a mesma pessoa como Gestor com responsabilidade financeira, sem vínculo com outro Gestor.
- As ações de Gestor permanecem disponíveis para essa pessoa, que também pode exercer as funções financeiras autorizadas.
- O Perfil continua sendo Gestor; a responsabilidade financeira é uma atribuição adicional.
- Não é possível atribuir simultaneamente a responsabilidade financeira a mais de um Gestor.
- O Capitão pode retirar a responsabilidade e deixar a posição vaga.
- Somente o Capitão consegue atribuir ou retirar a responsabilidade financeira.
- A responsabilidade só pode ser atribuída ou transferida a um Gestor com conta ativa.
- Um Gestor com conta ativa pode receber a responsabilidade financeira mesmo que seu Subsistema esteja inativo.
- Somente o Capitão pode alterar Nome, RA, Perfil ou situação do Gestor Financeiro, assim como ocorre com os demais Gestores; o próprio Usuário pode trocar sua senha.
- O Capitão pode transferir a responsabilidade entre Gestores em uma única operação, sem permitir dois responsáveis simultâneos.
- A atribuição, retirada ou transferência de responsabilidade passa a valer imediatamente no servidor, inclusive nas sessões abertas, e a interface reflete as permissões atualizadas ao receber os dados ou na próxima requisição.
- O Gestor responsável não pode ser desativado nem mudar de Perfil até o Capitão retirar ou transferir a responsabilidade.
- A migração e os testes cobrem a regra final, inclusive os dados preexistentes quando houver.
- A migração não concede a responsabilidade financeira a ninguém.
- Se algum Usuário ainda tiver o Perfil Financeiro, a migração falha com uma mensagem clara, sem alterar dados.

## Comments

### Contrato para o frontend (2026-11-17)

Implementado na branch `feat/06-gestor-financeiro`. Pontos que mudam para a [issue 08 do frontend](../../modulo-1_frontend/issues/08-responsabilidade-financeira.md) e a [11](../../modulo-1_frontend/issues/11-integracao-backend.md):

- **Saem:** `/api/vinculos` (todas as rotas), o Perfil `FINANCEIRO` e o campo `gestorId` em `POST /api/usuarios` e `PUT /api/usuarios/{id}/perfil`. Enviar `"perfil": "FINANCEIRO"` agora dá 400.
- **`GET /api/atribuicao-financeira`**, para quem tem `EQUIPE_CONSULTAR`: `{ "gestor": { "id", "nome" } | null, "atribuidaEm": "…" | null }`. Os dois campos nulos indicam a posição vaga.
  - Capitão e Gestor sempre consultam. Os demais Perfis só recebem 200 quando há Gestor Financeiro e ele lhes é visível; caso contrário, 403 (inclusive com a posição vaga).
- **`PUT /api/atribuicao-financeira`** com `{ "gestorId": 7 }`, só para o Capitão (`ATRIBUICAO_FINANCEIRA_GERENCIAR`). Atribui a posição vaga ou a transfere de outro Gestor, numa só operação, e devolve o mesmo corpo do GET.
  - 422 se o alvo não for um Gestor ativo ou já for o Gestor Financeiro.
  - 403 para quem não é Capitão.
- **`DELETE /api/atribuicao-financeira`**, só para o Capitão: devolve 204 e deixa a posição vaga, ou 422 se ela já estiver vaga.
- **`gestorFinanceiro: boolean`** aparece em `UsuarioResposta` (listas, detalhe, Composição) e em `/api/auth/login` e `/api/auth/eu`. Essas duas rotas somam às permissões do Gestor as da atribuição; o conjunto ainda está vazio, até o módulo Financeiro criar as dele.
- **Desativar ou trocar o Perfil do Gestor Financeiro** devolve 422, com uma mensagem pedindo para retirar ou transferir a responsabilidade antes.
- **Auditoria:** entidade `ATRIBUICAO_FINANCEIRA`, ações `ATRIBUIDA`, `TRANSFERIDA` (com `gestorAnteriorId`) e `RETIRADA`.

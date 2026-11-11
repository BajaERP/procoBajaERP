# Backend: corrigir Gestor com responsabilidade financeira e modelo de dados

Status: ready-for-human

## Contexto

A regra anterior de um Financeiro vinculado a outro Usuário Gestor foi corrigida pelo responsável pelo projeto. A mesma pessoa deve ser Gestor antes de receber a responsabilidade financeira; ao recebê-la, seu Perfil continua sendo Gestor, conserva as funções de Gestor e ganha as funções financeiras por uma atribuição adicional. A interface a identifica como Gestor Financeiro. No máximo um Gestor pode ter essa responsabilidade por vez, a posição pode ficar vaga e só o Capitão pode atribuí-la ou retirá-la.

O modelo relacional v4, a especificação anterior e o backend incorporado pelos PRs #32 e #34 representam Gestor e Financeiro como Perfis distintos e preveem vínculo entre duas pessoas. A implementação existente precisa ser adaptada. A migração histórica V2 usou outra representação, mas não determina a solução atual.

## Trabalho esperado

- Adaptar os fluxos existentes de Usuário e Vínculo às decisões registradas nesta issue e no glossário.
- Atualizar o modelo relacional de referência para uma versão v5 corrigida e revisar os artefatos e regras afetados.
- Adaptar o esquema efetivo e os dados existentes com novas migrações Flyway, preservando as já versionadas. A V5 do Flyway já existe; a versão seguinte disponível atualmente é V6.
- O responsável informou que o sistema ainda não foi usado e não há dados antigos a migrar. Caso algum ambiente de teste já contenha dados do modelo anterior, não conceder automaticamente a responsabilidade financeira; preservar os registros e deixar contas do Perfil Financeiro independente desativadas para revisão pelo Capitão, que decide o Perfil e a eventual reativação.
- Adaptar perfis, permissões, identidade autenticada, regras de negócio e contratos da API para a regra acordada, com validação e testes no servidor.
- Comunicar o contrato ao responsável pelo frontend antes da integração final.

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
- Dados anteriores são preservados, sem concessão automática da responsabilidade financeira.
- Caso existam dados antigos em algum ambiente, contas que tinham o Perfil Financeiro independente ficam desativadas para revisão, preservadas e sem novas permissões automáticas; o Capitão pode selecionar um novo Perfil sem reativá-las automaticamente.

## Comments

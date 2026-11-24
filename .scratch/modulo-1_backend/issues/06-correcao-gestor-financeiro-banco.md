# Backend: derivar o Gestor Financeiro do Subsistema Financeiro

Status: ready-for-human

## Contexto

Gestor Financeiro é a mesma pessoa que exerce o Perfil Gestor e está associada ao Subsistema Financeiro. Não existe um Perfil Financeiro separado, vínculo entre duas pessoas nem operação manual para conceder ou retirar essa responsabilidade. O Subsistema Financeiro é canônico e permanente; nasce desativado e pode ser ativado pela Definição de Líder normal.

A regra substitui a tabela `atribuicao_financeira` criada pela migration V6 e a especificação anterior. A migration V8 preserva as migrations já aplicadas, adapta o estado atual e impede mais de um Gestor ativo no Subsistema Financeiro.

## Critérios de aceite

- [x] A migration V8 cria ou normaliza o Subsistema canônico `Financeiro`, preserva os dados históricos de auditoria e remove a antiga tabela de estado atual.
- [x] Um Gestor ativo associado ao Financeiro é identificado como Gestor Financeiro; Gestor continua sendo seu Perfil e suas permissões comuns permanecem intactas.
- [x] Atribuir o Gestor ao Subsistema Financeiro por cadastro, transferência ou mudança de Perfil concede automaticamente a responsabilidade; transferi-lo para fora, mudar seu Perfil ou desativá-lo a retira.
- [x] No máximo um Gestor ativo pode estar associado ao Financeiro. A regra é serializada no serviço e protegida também por índice único parcial no banco, inclusive contra concorrência.
- [x] Reativar ou transferir um Gestor para Financeiro valida novamente a regra de unicidade.
- [x] Transferências em lote que tentariam colocar mais de um Gestor ativo no Financeiro falham antes de alterar usuários ou subsistemas.
- [x] O Subsistema Financeiro não pode ser renomeado nem desativado.
- [x] `GET /api/atribuicao-financeira` é somente leitura e retorna `{ "gestor": { "id", "nome" } | null }`; não há endpoints de concessão, retirada ou transferência.
- [x] `/api/auth/login`, `/api/auth/eu`, listas e detalhes refletem o Gestor Financeiro derivado da associação atual.
- [x] Testes cobrem migração, acesso, mudanças de perfil, reativação, transferência, desativação, unicidade e atomicidade das transferências em lote.

## Decisões

- A associação ao Subsistema Financeiro é a única fonte de verdade para a responsabilidade financeira.
- Um Gestor inativo não exerce a responsabilidade. Sua associação pode permanecer para preservar o arranjo e, ao reativá-lo, a unicidade volta a ser validada.
- A responsabilidade financeira pode ficar vaga: basta não haver Gestor ativo associado ao Financeiro.
- A migração pode preservar uma atribuição manual antiga apenas quando o respectivo Gestor ainda estiver ativo e não houver outro Gestor ativo no Subsistema Financeiro. Conflitos são interrompidos com mensagem clara.

## Contrato para o frontend

- A tela de responsabilidade financeira é de consulta: mostra o Gestor ativo do Subsistema Financeiro ou informa que a posição está vaga.
- Remover controles para atribuir, retirar ou transferir essa responsabilidade. As ações comuns de associação de integrantes ao Subsistema determinam o resultado.
- O indicador de Gestor Financeiro deve acompanhar o estado recebido do serviço/autenticação; mocks devem aplicar a mesma regra.
- A matriz de permissões não apresenta uma permissão manual de gerenciamento da atribuição financeira.

Consulte a [issue 08 do frontend](../../modulo-1_frontend/issues/08-responsabilidade-financeira.md) e a [decisão de domínio ADR 0002](../../../docs/adr/0002-gestor-financeiro-derivado-do-subsistema.md).

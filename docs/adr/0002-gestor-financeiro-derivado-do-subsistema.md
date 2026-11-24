# ADR 0002: Gestor Financeiro derivado do Subsistema Financeiro

- **Status:** aceito
- **Data:** 2026-11-24
- **Decisores:** responsável pelo projeto

## Contexto

O modelo anterior representava a responsabilidade financeira como um estado separado, atribuível manualmente a um Gestor. Isso duplicava a associação que o sistema já mantém entre usuários e subsistemas e criava operações, permissões e estados adicionais para manter sincronizados.

## Decisão

O Gestor Financeiro é o Gestor ativo associado ao Subsistema canônico `Financeiro`. O Subsistema é permanente, nasce desativado e pode ser ativado pelo fluxo comum de definição de Líder. Não há Perfil Financeiro, vínculo entre pessoas ou operação manual de concessão, retirada ou transferência da responsabilidade.

O Gestor mantém seu Perfil e permissões normais. As permissões financeiras são derivadas da combinação de conta ativa, Perfil Gestor e associação ao Subsistema Financeiro. No máximo um Gestor ativo pode estar associado a esse Subsistema; a regra deve ser validada transacionalmente e protegida por uma restrição única no banco. A responsabilidade fica vaga quando não há Gestor ativo associado.

Cadastro, transferência, troca de Perfil, desativação e reativação seguem os fluxos comuns do módulo de Equipe. Qualquer operação que associe um Gestor ativo ao Financeiro valida a unicidade. Transferências em lote são validadas como um conjunto antes de efetuar alterações. O Subsistema Financeiro não pode ser renomeado nem desativado.

## Consequências

- Interfaces de Gestão Financeira apenas consultam quem ocupa a responsabilidade; não oferecem concessão ou retirada manual.
- A associação atual determina as permissões em toda requisição, sem depender de atualizar uma tabela de atribuição ou uma sessão antiga.
- A tabela histórica `atribuicao_financeira` é removida por nova migration; migrations já aplicadas permanecem imutáveis.
- A migração V8 normaliza ou cria o Subsistema Financeiro, mapeia a atribuição manual existente quando não há conflito e interrompe a migração se o estado for ambíguo.
- O modelo relacional v5 permanece uma referência acadêmica anterior em conflito neste ponto; para o esquema executável prevalecem as migrations e este ADR até que o modelo de referência seja revisado.

## Alternativas consideradas

1. **Manter uma tabela com o estado atual da atribuição:** rejeitada por duplicar o vínculo ao Subsistema e exigir operações específicas para sincronizar esse estado.
2. **Manter um Perfil Financeiro separado ou um vínculo entre duas pessoas:** rejeitada porque a responsabilidade é exercida pelo próprio Gestor e ele precisa manter as permissões do seu Perfil.

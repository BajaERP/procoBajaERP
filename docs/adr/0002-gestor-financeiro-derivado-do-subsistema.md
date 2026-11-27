# ADR 0002 — Gestor Financeiro derivado do Subsistema Financeiro

- **Status:** aceito
- **Data:** 2026-11-24
- **Decisores:** responsável pelo projeto

## Contexto

O modelo anterior representava a responsabilidade financeira como um estado separado, atribuível manualmente a um Gestor. Isso duplicava a associação que o sistema já mantém entre usuários e subsistemas e criava operações, permissões e estados adicionais para manter sincronizados.

## Decisão

O Gestor Financeiro é o Gestor ativo associado ao Subsistema canônico `Financeiro`. O Subsistema é permanente, nasce desativado e passa a ativo pelo fluxo comum de Definição de Líder. O Perfil do Usuário continua sendo Gestor.

As permissões financeiras são derivadas da combinação de conta ativa, Perfil Gestor e associação ao Subsistema Financeiro. O serviço valida a unicidade transacionalmente e o banco limita a associação a um Gestor ativo por vez. A responsabilidade fica vaga quando não há Gestor ativo associado.

Cadastro, transferência, troca de Perfil, desativação e reativação seguem os fluxos comuns do módulo de Equipe. Qualquer operação que associe um Gestor ativo ao Financeiro valida a unicidade. Transferências em lote são validadas como um conjunto antes de efetuar alterações. O Subsistema Financeiro não pode ser renomeado nem desativado.

## Consequências

- A consulta de responsabilidade financeira mostra quem ocupa a função. A administração usa as operações existentes de Usuários e Subsistemas.
- A associação ativa na requisição determina as permissões.
- A [migração V8](../../backend/src/main/resources/db/migration/V8__financeiro_com_gestor_automatico.sql) normaliza ou cria o Subsistema Financeiro, preserva a atribuição aproveitável, interrompe a migração quando encontra conflito e remove a tabela `atribuicao_financeira`.
- O [modelo relacional v6](../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v6.dbml) inclui esta decisão. O v5 documenta o desenho anterior.

## Alternativas consideradas

1. Manter uma tabela de atribuição duplicaria o vínculo ao Subsistema e exigiria sincronização.
2. Separar um Perfil Financeiro ou manter um vínculo entre duas pessoas dificultaria preservar as permissões que o Gestor já possui.

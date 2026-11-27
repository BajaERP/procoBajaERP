# 03: Aprovar ou reprovar uma Revisão

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).
**Histórias cobertas:** 14–20.

**Blocked by:** [02 — Gerenciar Solicitações, Revisões e Orçamentos](02-backend-solicitacoes-revisoes-orcamentos.md)

## Entrega

Registrar decisões de Capitão e Gestor Financeiro e produzir uma Compra aprovada quando houver aprovação conjunta.

## Critérios de aceitação

- [ ] Vincular cada aprovação à mesma Revisão e a um de seus Orçamentos. Só aprovar a Compra quando as decisões vigentes de Capitão e Gestor Financeiro apontarem para o mesmo Orçamento. Escolhas diferentes mantêm a Solicitação aguardando.
- [ ] Exigir justificativa para reprovar e encerrar imediatamente a análise daquela Revisão. Preservar as decisões anteriores.
- [ ] Informar ausência de Gestor Financeiro. Se mudar qualquer titular em uma Revisão pendente, exigir a decisão do titular atual e conservar a decisão anterior no histórico. Compras já aprovadas conservam a aprovação.
- [ ] Verificar pela API com contas distintas a reprovação, aprovação divergente, aprovação conjunta, troca de cada titular e tentativa de decidir sem autorização.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

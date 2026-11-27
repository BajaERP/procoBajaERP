# 06: Corrigir Pagamentos e registrar Reembolsos

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).
**Histórias cobertas:** 25–26.

**Blocked by:** [05 — Registrar Pagamento e Previsão vinculada](05-backend-pagamento-previsao-vinculada.md)

## Entrega

Distinguir a correção de uma Saída indevida da devolução de dinheiro efetivamente pago.

## Critérios de aceitação

- [ ] Capitão e Gestor Financeiro podem cancelar a Saída indevida com motivo, autor e data. Preservar o histórico, devolver a Compra para Aprovada e manter a Previsão vinculada consistente com esse estado. A Compra pode receber o Pagamento correto.
- [ ] Registrar Reembolso total ou parcial como Entrada vinculada à Compra, preservando a Saída original. A soma dos Reembolsos não pode exceder o total efetivamente pago, inclusive em registros concorrentes.
- [ ] Verificar pela API correção seguida de novo Pagamento, consulta ao histórico, Reembolsos parciais válidos e rejeição de excedente sem gravação parcial.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

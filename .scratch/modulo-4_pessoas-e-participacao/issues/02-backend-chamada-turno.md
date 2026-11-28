# 02: Registrar e corrigir chamada de turno

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 4 · Pessoas e Participação](../spec.md).
**Histórias cobertas:** 1, 5–14.

**Blocked by:** [01 — Fechar o contrato da API](01-contrato-api.md)

## Entrega

Disponibilizar a chamada de turno pela API autenticada, com escopo por Subsistema e tratamento de vínculos históricos.

## Critérios de aceitação

- [ ] Permitir registrar somente as pessoas selecionadas. Quem ainda não foi conferido fica sem lançamento. Se algum registro do lote for inválido, manter o lote intacto e identificar o erro respeitando o escopo de consulta.
- [ ] Aceitar Presente sem horários ou com horário real. Quando houver horários, validar entrada e saída, incluindo data de saída para turno que cruza a meia-noite. Rejeitar turnos sobrepostos do mesmo Integrante e aceitar intervalos consecutivos.
- [ ] Exigir motivo para Justificada. Em Ausente, aceitar motivo opcional.
- [ ] Usar o Subsistema na data inicial. Depois de transferência, autorizar o Líder atual do Subsistema de origem, Capitão ou Gestor a completar a chamada. Vínculo não comprovado fica pendente até Capitão ou Gestor confirmar o Subsistema da época com justificativa. Admitir presença do Capitão sem Subsistema registrada por Capitão ou Gestor.
- [ ] Autorizar a correção antes da Validação para Capitão e Gestor e para o Líder atual no Subsistema de referência. Verificar pela API autenticada com PostgreSQL e dois Subsistemas, incluindo erro de lote, vínculo retroativo e ausência de exposição fora do escopo.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

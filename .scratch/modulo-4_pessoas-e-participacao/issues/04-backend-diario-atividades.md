# 04: Registrar e revisar Diário de atividades

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 4 · Pessoas e Participação](../spec.md).
**Histórias cobertas:** 21–25.

**Blocked by:** [01 — Fechar o contrato da API](01-contrato-api.md)

## Entrega

Disponibilizar o Diário de atividades com autoria do Membro e fluxo administrativo de revisão.

## Critérios de aceitação

- [ ] Garantir um Diário por Membro e dia real de trabalho. Permitir reunir relatos de vários turnos, lançar depois e enviar independentemente de presença validada. Só o autor cria ou edita o texto.
- [ ] Manter o rascunho inicial privado. Só o envio explícito coloca a versão na fila. Capitão e Gestor podem validar com comentário opcional, devolver com motivo ou reabrir um Diário validado.
- [ ] Após devolução ou reabertura, manter a última versão enviada e o histórico visíveis a Capitão e Gestor. Alterações do Membro ficam privadas até o reenvio.
- [ ] Verificar pela API unicidade, escopo de autoria, privacidade de rascunho, envio, devolução, reenvio, Validação e reabertura com versões preservadas.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

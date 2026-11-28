# 12: Verificar consulta pessoal de Aceites

Status: blocked
Frente: Backend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 15–16, 21–24, 26.

**Blocked by:** [01 — Fechar o contrato dos cartões](01-contrato-cartoes.md); [Módulo 7 · 06 — Registrar Ciência e Aceite e consultar pendências pessoais](../../modulo-7_governanca/issues/06-backend-ciencia-aceite-pendencias.md)

## Entrega

Garantir que Governança forneça as pendências atuais da pessoa da sessão.

## Critérios de aceitação

- [ ] Verificar Documento, Versão, data de início da Vigência e referência de abertura. Cobrir pendência atribuída de Vigência futura e Ciência já registrada com Aceite ainda pendente.
- [ ] Testar com pessoas distintas, inclusive Capitão e Gestor, que cada sessão recebe somente suas pendências e segue com acesso ao ERP. Verificar ausência de dados de outro Usuário em consultas diretas.
- [ ] Confirmar que o Aceite concluído sai da consulta pessoal. Ajustar na consulta de Governança somente os campos ou comportamentos previstos no contrato que estiverem faltando.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

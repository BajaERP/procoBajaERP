# 06: Encaminhar e analisar Ocorrências

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 4 · Pessoas e Participação](../spec.md).
**Histórias cobertas:** 29–30.

**Blocked by:** [01 — Fechar o contrato da API](01-contrato-api.md)

## Entrega

Receber Ocorrências encaminhadas pelo Líder e disponibilizar análise confidencial para Capitão e Gestor.

## Critérios de aceitação

- [ ] Permitir que Líder encaminhe Ocorrência do próprio Subsistema e receba confirmação de envio. A resposta e as consultas posteriores não revelam o conteúdo confidencial ao Líder.
- [ ] Capitão e Gestor podem consultar a Ocorrência e encerrar a análise sem emitir Advertência. Conservar relato e decisão no histórico confidencial.
- [ ] Verificar pela API os escopos de envio, o acesso administrativo, o encerramento e a negação de consulta posterior, inclusive por filtros ou acesso direto.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

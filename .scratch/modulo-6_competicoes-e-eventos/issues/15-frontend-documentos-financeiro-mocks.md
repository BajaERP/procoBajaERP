# 15: Demonstrar vínculos de Documentos e Financeiro

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 36–40.

**Blocked by:** [08 — Montar agenda e cadastro com mocks](08-frontend-agenda-cadastro-mocks.md)

## Entrega

Simular os acessos que ligam o detalhe do Evento a Documentação e ao Financeiro.

## Critérios de aceitação

- [ ] Demonstrar associação opcional, consulta e abertura de Documentos conforme capacidades. Simular o Drive indisponível com feedback e nova tentativa, mantendo o detalhe operacional acessível.
- [ ] Demonstrar a ação que encaminha Capitão e Gestor Financeiro à consulta filtrada no Financeiro. Os mocks do detalhe operacional não incluem valores, totais, comprovantes ou metadados financeiros protegidos.
- [ ] Verificar as interações em desktop e mobile, incluindo estados vazio, restrito e indisponível.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

# 12: Exclusão e restauração com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 5 · Documentação](../spec.md).
**Histórias cobertas:** 25–30.

**Blocked by:** [08 — Biblioteca e detalhe com mocks](08-frontend-biblioteca-mocks.md)

## Entrega

Entregar os fluxos demonstrativos de solicitação, decisão, ida à lixeira e restauração.

## Critérios de aceitação

- [ ] Permitir solicitar exclusão com motivo pela visão de Líder e analisar pela visão administrativa autorizada. Exibir o histórico da decisão.
- [ ] Distinguir decisão de execução confirmada. Demonstrar espera, falha e nova tentativa, mantendo o Documento na biblioteca ativa até confirmação simulada.
- [ ] Oferecer restauração conforme as capacidades. Demonstrar recuperação do cadastro, das Associações e do acesso anterior após confirmação.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

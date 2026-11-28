# 12: Registrar Ciência, Aceite e comprovante com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 7 · Governança](../spec.md).
**Histórias cobertas:** 19–27, 30–31.

**Blocked by:** [08 — Montar biblioteca, leitura e histórico com mocks](08-frontend-biblioteca-leitura-historico-mocks.md)

## Entrega

Simular o registro das confirmações e a consulta de pendências pessoais, comprovante e histórico.

## Critérios de aceitação

- [ ] Demonstrar Ciência isolada, Aceite posterior e confirmação conjunta. Preservar as datas e explicar o estado Ciência registrada com Aceite pendente.
- [ ] Exibir a data da Vigência futura quando houver Aceite antecipado. Simular a entrada de usuário, a reativação, as pendências vigentes e o histórico de Aceites sem bloquear o uso do ERP.
- [ ] Apresentar comprovante no ERP com Documento, Versão, Usuário e datas. Conferir a leitura e as ações em desktop e mobile, incluindo estados vazio, erro e restrição.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

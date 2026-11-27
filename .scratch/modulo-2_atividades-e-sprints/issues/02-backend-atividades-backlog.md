# 02: Gerenciar Atividades e Backlog

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 2 · Atividades e Sprints](../spec.md).

**Blocked by:** [01 — Fechar o contrato da API](01-contrato-api.md)

## Entrega

Disponibilizar pela API autenticada a consulta, os filtros, o detalhe e os comandos de criação, edição e arquivamento de Atividades, com histórico de planejamento.

## Critérios de aceitação

- [ ] Aplicar o escopo de Capitão, Gestor, Líder, Membro e Orientador em leitura, filtros, detalhe e histórico. Gestor Financeiro tem o mesmo acesso de Gestor.
- [ ] Permitir planejar Atividades de vários Subsistemas conforme a matriz. Toda Atividade exige ao menos um Subsistema e pode ter vários Responsáveis, inclusive de outro Subsistema.
- [ ] Aceitar prazo, Estimativa e Responsável ausentes no Backlog. Estimativas informadas aceitam somente 1, 2, 3, 5, 8, 13 e 21. Registrar mudanças de planejamento, como ajuste de prazo.
- [ ] Arquivar com motivo, autor e data. Capitão e Gestor podem arquivar conforme seu escopo, e Líder apenas Atividades exclusivas do próprio Subsistema no Backlog. Remover arquivadas das visões ativas e preservar histórico.
- [ ] Cobrir consultas e comandos com testes da API autenticada no PostgreSQL, inclusive tentativas sem permissão e uma Atividade compartilhada.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de banco e novas migrações ficam fora desta issue.

## Comments

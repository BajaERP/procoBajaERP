# 07: Navegação, Backlog e formulários com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 2 · Atividades e Sprints](../spec.md).

**Blocked by:** [01 — Fechar o contrato da API](01-contrato-api.md)

## Entrega

Entregar a entrada de Atividades e Sprints, com navegação interna, Backlog, detalhes e formulários que funcionem usando dados demonstrativos.

## Critérios de aceitação

- [ ] Manter uma entrada na sidebar e navegação interna para Quadro, Backlog e Sprints. Usar design system e Figma em desktop e mobile, com teclado e temas claro e escuro.
- [ ] Consultar e filtrar Backlog, apresentar detalhe e permitir cadastro, edição e arquivamento conforme as capacidades simuladas. Exibir motivo de arquivamento quando solicitado e retirar a Atividade da visão ativa após a ação.
- [ ] Permitir os cenários de Atividade compartilhada, Responsável de outro Subsistema e campos opcionais do Backlog. Refletir os limites de Estimativa e os erros de validação.
- [ ] Isolar dados e operações simuladas atrás do contrato da issue 01. Incluir cenários de carregamento, vazio, falha, nova tentativa e consulta sem permissão de edição.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de banco e novas migrações ficam fora desta issue.

## Comments

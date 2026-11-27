# 01: Fechar o contrato da API

Status: ready-for-agent
Frente: Compartilhada

**Especificação:** [Módulo 2 · Atividades e Sprints](../spec.md).

**Blocked by:** Nenhuma issue nova.

## Entrega

Acordar um contrato único para os adaptadores de frontend e para a API de Atividades e Sprints. A entrega é o contrato revisado pelos responsáveis pelas duas frentes, com exemplos que possam alimentar mocks e verificações da API.

## Critérios de aceitação

- [ ] Definir rotas, filtros, campos, formatos de datas, comandos e respostas para Quadro, Backlog, detalhes e históricos, Sprints planejadas, em andamento e encerradas.
- [ ] Explicitar capacidades no escopo do usuário e distinguir erro de validação, falta de permissão e conflito de estado. Alinhar sessão e CSRF ao padrão do ERP.
- [ ] Exemplificar Atividade compartilhada, Alocação em Sprint futura, alertas independentes e encerramento com destinos mistos. Diferenciar estado atual de resultado histórico e documentar a resposta para encerramento inválido.
- [ ] Revisar o contrato em conjunto e deixar exemplos utilizáveis pelas duas frentes sem depender de endpoints implementados.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de banco e novas migrações ficam fora desta issue.

## Comments

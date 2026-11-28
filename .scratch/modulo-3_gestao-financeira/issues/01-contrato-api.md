# 01: Fechar o contrato da API

Status: ready-for-agent
Frente: Compartilhada

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).

**Blocked by:** Nenhuma issue nova.

## Entrega

Acordar entre frontend e backend como consultar e operar Gestão Financeira.

## Critérios de aceitação

- [ ] Definir consultas, filtros, comandos, campos, capacidades por perfil e erros de validação, autorização e conflito. Reutilizar a sessão e o padrão HTTP e CSRF do ERP.
- [ ] Definir uma representação exata para BRL e distinguir Solicitação, Revisão, decisão, Compra, Pagamento, Movimentação e Previsão.
- [ ] Revisar exemplos com e sem valores autorizados, Orçamentos divergentes, troca de titular e Pagamento com Previsão vinculada. Entregar exemplos utilizáveis tanto nos mocks quanto nas verificações da API.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

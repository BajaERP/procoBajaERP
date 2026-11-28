# 14: Integrar à API real e validar ponta a ponta

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).
**Histórias cobertas:** 1–26, 28–34.

**Blocked by:** [07 — Consultar saldo, Previsão de caixa e gastos](07-backend-saldo-previsao-relatorios.md); [12 — Correção de Pagamento e Reembolsos com mocks](12-frontend-correcoes-reembolsos-mocks.md); [13 — Saldo, Previsão de caixa e relatórios com mocks](13-frontend-relatorios-mocks.md)

## Entrega

Conectar todas as entregas principais à API real e verificar os fluxos integrados.

## Critérios de aceitação

- [ ] Usar sessão real, padrão HTTP e CSRF do ERP e capacidades do servidor. Restringir mocks ao ambiente de desenvolvimento.
- [ ] Conectar consultas, comandos e filtros da entrega principal. Após operações, atualizar o histórico e as consultas afetadas. Distinguir erros de validação, autorização e conflito.
- [ ] Verificar com contas distintas o percurso Solicitação → Revisão → duas decisões → Pagamento → Saída e Previsão. Conferir a visibilidade depois de pagar e a rejeição de solicitação direta de uma ação sem permissão.
- [ ] Registrar os cenários integrados verificados. O vínculo posterior de arquivos tem dependências próprias nas issues 15 e 16.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

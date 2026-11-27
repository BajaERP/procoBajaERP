# 16: Associar e consultar documentos da Compra

Status: blocked
Frente: Frontend

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).
**Histórias cobertas:** 27, 34.

**Blocked by:** [14 — Integrar à API real e validar ponta a ponta](14-frontend-integracao-api.md); [15 — Vincular documentos à Compra](15-backend-documentos-compra.md); Dependência externa indireta via issue 15: API de consulta e autorização de arquivos do Módulo 5.

## Entrega

Oferecer na tela da Compra a associação e consulta de comprovantes e notas fiscais autorizados.

## Critérios de aceitação

- [ ] Oferecer ações com base nas capacidades devolvidas pelo servidor, inclusive quando a Compra já estiver paga.
- [ ] Consultar somente arquivos autorizados e mostrar o estado indisponível ou a falha de Documentação quando necessário, preservando o acesso aos demais dados autorizados da Compra.
- [ ] Verificar com sessão real a associação, a consulta autorizada e a ausência de acesso quando o servidor negar. O fluxo de Pagamento continua utilizável sem arquivo associado.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

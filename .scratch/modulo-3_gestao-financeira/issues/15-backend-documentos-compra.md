# 15: Vincular documentos à Compra

Status: blocked
Frente: Backend

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).
**Histórias cobertas:** 27.

**Blocked by:** [05 — Registrar Pagamento e Previsão vinculada](05-backend-pagamento-previsao-vinculada.md); Módulo 5 — [02 — Consultar biblioteca e aplicar permissões](../../modulo-5_documentacao/issues/02-backend-biblioteca-permissoes.md) para localizar e validar acesso aos Documentos, e [05 — Publicar, consultar e baixar Versões](../../modulo-5_documentacao/issues/05-backend-versoes.md) para consultar arquivos autorizados.

## Entrega

Permitir associar comprovante ou nota fiscal autorizados a uma Compra, inclusive depois do Pagamento.

## Critérios de aceitação

- [ ] Integrar a associação e a consulta de metadados ou arquivos às permissões de Documentação. O vínculo por si só não amplia acesso ao arquivo.
- [ ] Permitir que Capitão ou Gestor Financeiro associe o Documento conforme o contrato de Documentação, sem tornar obrigatório o vínculo para registrar um Pagamento.
- [ ] Verificar pela API associação posterior ao Pagamento, consulta autorizada e tentativa de acesso a arquivo restrito por pessoa sem permissão.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

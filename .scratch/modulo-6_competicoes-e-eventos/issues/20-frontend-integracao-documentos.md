# 20: Integrar Documentos na tela do Evento

Status: blocked
Frente: Frontend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 36–37, 40.

**Blocked by:** [15 — Demonstrar vínculos de Documentos e Financeiro](15-frontend-documentos-financeiro-mocks.md); [16 — Integrar o frontend à API de Competições e Eventos](16-frontend-integracao-api.md); [19 — Associar Documentos ao Evento](19-backend-documentos-evento.md); [Módulo 5 · 05 — Publicar, consultar e baixar Versões](../../modulo-5_documentacao/issues/05-backend-versoes.md)

## Entrega

Conectar a associação e a abertura de Documentos no detalhe do Evento.

## Critérios de aceitação

- [ ] Usar as capacidades do servidor para localizar, associar e abrir Documentos e Versões autorizados. Manter a Associação opcional no cadastro e no encerramento.
- [ ] Verificar consultas autorizadas e restritas, inclusive por link direto. Exibir feedback de falha do Drive e nova tentativa sem interromper o restante do Evento.
- [ ] Validar o fluxo integrado com sessão real e o Drive simulado. A conferência com arquivos reais segue a entrega de validação do Módulo 5.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

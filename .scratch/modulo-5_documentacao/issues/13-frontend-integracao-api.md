# 13: Integrar o frontend à API de Documentação

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 5 · Documentação](../spec.md).
**Histórias cobertas:** 1–23, 25–30.

**Blocked by:** [05 — Publicar, consultar e baixar Versões](05-backend-versoes.md); [06 — Solicitar exclusão e restaurar Documentos](06-backend-exclusao-restauracao.md); [10 — Envio e importação com mocks](10-frontend-envio-importacao-mocks.md); [11 — Histórico e Versões com mocks](11-frontend-versoes-mocks.md); [12 — Exclusão e restauração com mocks](12-frontend-exclusao-restauracao-mocks.md)

## Entrega

Ligar os fluxos de Documentação à API do módulo e validar a integração usando o Drive simulado em ambiente de teste.

## Critérios de aceitação

- [ ] Usar sessão real, HTTP e CSRF do ERP e capacidades devolvidas pelo servidor. Mocks do frontend ficam restritos ao desenvolvimento.
- [ ] Integrar biblioteca, classificação, envio, importação, Versões, exclusão e restauração. Atualizar as consultas afetadas e apresentar erros autorizados após cada ação.
- [ ] Validar os fluxos com Perfis e Subsistemas distintos, incluindo acesso negado a metadados ou arquivos e a separação entre solicitação e exclusão confirmada. Registrar evidências em desktop e mobile.
- [ ] Concluir com as APIs do Módulo 5 e o Drive simulado. A conferência com arquivos reais fica na issue 14. As telas de Compras, Atividades e Eventos ficam com seus módulos consumidores.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

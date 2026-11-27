# 14: Integrar à API de Governança

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 7 · Governança](../spec.md).
**Histórias cobertas:** 1–31.

**Blocked by:** [05 — Encerrar ou cancelar uma Vigência](05-backend-encerramento-cancelamento.md); [07 — Acompanhar Ciência e Aceite da equipe](07-backend-acompanhamento-aceites.md); [10 — Revisar e publicar com mocks](10-frontend-publicacao-mocks.md); [11 — Encerrar ou cancelar Vigência com mocks](11-frontend-encerramento-cancelamento-mocks.md); [12 — Registrar Ciência, Aceite e comprovante com mocks](12-frontend-ciencia-aceite-mocks.md); [13 — Acompanhar Aceites da equipe com mocks](13-frontend-acompanhamento-mocks.md)

## Entrega

Conectar os fluxos de Governança à API real e verificar o percurso do Rascunho ao Aceite e ao histórico.

## Critérios de aceitação

- [ ] Usar sessão real, HTTP e CSRF do ERP e capacidades do servidor. Restringir os mocks ao desenvolvimento.
- [ ] Conectar biblioteca, leitura, históricos, Rascunhos, publicação, encerramento, cancelamento, Ciência, Aceite, comprovante e acompanhamento. Atualizar as consultas afetadas após comandos e tratar acesso negado, conflito e falha.
- [ ] Verificar com sessão real a revisão de um Rascunho preparado pelo Gestor, publicação pelo Capitão, Aceite antecipado, entrada em Vigência, encerramento e histórico. Conferir também cancelamento futuro e preservação da Versão vigente.
- [ ] Conferir estados em desktop e mobile a partir de 320 px, temas claro e escuro, teclado e foco. Validar que a referência de abertura da issue 06 leva à Versão autorizada em Governança. O cartão do Dashboard pertence ao Módulo 8.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

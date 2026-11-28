# 15: Integrar o Módulo 4 à API real

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 4 · Pessoas e Participação](../spec.md).
**Histórias cobertas:** 1–34, 40.

**Blocked by:** [03 — Validar presença e calcular indicadores](03-backend-validacao-indicadores.md), [04 — Registrar e revisar Diário de atividades](04-backend-diario-atividades.md), [05 — Publicar e corrigir Observações](05-backend-observacoes.md), [07 — Emitir, comunicar e revogar Advertências](07-backend-advertencias.md), [10 — Validação, Frequência e Carga horária com mocks](10-frontend-validacao-indicadores-mocks.md), [11 — Diário de atividades com mocks](11-frontend-diario-mocks.md), [12 — Observações com mocks](12-frontend-observacoes-mocks.md), [14 — Advertências com mocks](14-frontend-advertencias-mocks.md)

## Entrega

Conectar os fluxos principais de Pessoas e Participação às próprias APIs e verificar o comportamento com sessões reais.

## Critérios de aceitação

- [ ] Usar sessão real, padrão HTTP e CSRF do ERP e capacidades do servidor. Mocks permanecem restritos ao desenvolvimento.
- [ ] Conectar chamada, Validação, indicadores, Diário, Observações, Ocorrências e Advertências. Atualizar consultas após comandos e apresentar erros de autorização, validação e conflito sem perder seleção quando aplicável.
- [ ] Verificar com contas de Perfis distintos os percursos chamada → Validação → indicadores, Diário → envio → revisão e Advertência → comunicação → ciência. Confirmar que solicitações diretas não ampliam o acesso e que erros em lote preservam os registros.
- [ ] Registrar evidências em desktop e mobile, com teclado e temas claro e escuro. A validação ponta a ponta da tela de Evento fica no Módulo 6. A issue 08 e a entrega do Dashboard seguem independentes desta integração.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

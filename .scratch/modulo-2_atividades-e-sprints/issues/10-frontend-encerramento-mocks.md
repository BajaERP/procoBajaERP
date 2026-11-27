# 10: Retirada, encerramento e resultado com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 2 · Atividades e Sprints](../spec.md).

**Blocked by:** [09 — Planejamento e Alocação com mocks](09-frontend-planejamento-alocacao-mocks.md)

## Entrega

Entregar os fluxos de retirada e encerramento no adaptador demonstrativo, com consulta do resultado da Sprint.

## Critérios de aceitação

- [ ] Oferecer retirada com motivo e escolha de destino. Apresentar a retirada separadamente de Não concluída no resultado da Sprint.
- [ ] Permitir selecionar Backlog ou Sprint futura para cada pendência e confirmar o encerramento. Simular destinos mistos, destino inválido e conflito, mantendo a tela e os dados consistentes após falha.
- [ ] Após sucesso, atualizar as consultas afetadas e mostrar o resultado de cada passagem, origem, destino e prazo preservado. Distinguir estado de trabalho atual de resultado histórico.
- [ ] Verificar capacidades por Perfil e os fluxos com teclado, em desktop e mobile.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de banco e novas migrações ficam fora desta issue.

## Comments

# 08: Montar agenda e cadastro com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 1–10, 39–40.

**Blocked by:** [01 — Fechar o contrato compartilhado](01-contrato-api.md)

## Entrega

Permitir navegar pela agenda, consultar o detalhe e simular cadastro e edição de cada tipo de Evento.

## Critérios de aceitação

- [ ] Reusar a entrada Competições e Eventos na sidebar. Implementar Próximos, Histórico, busca e filtros, com detalhe por tipo e edição. Mostrar somente Competições na agenda demonstrativa do Orientador.
- [ ] Simular criação e edição com as capacidades de cada Perfil e os campos de Evento geral, Reunião e Competição. Exibir feedback de campos obrigatórios e datas inconsistentes.
- [ ] Manter dados e comportamento demonstrativos em mocks isolados com o contrato da issue 01, acessíveis em desenvolvimento.
- [ ] Verificar estados vazio, carregamento, restrição e erro, em desktop e mobile a partir de 320 px, nos temas claro e escuro e com teclado.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

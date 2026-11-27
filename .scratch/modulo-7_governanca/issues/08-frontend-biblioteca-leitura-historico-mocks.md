# 08: Montar biblioteca, leitura e histórico com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 7 · Governança](../spec.md).
**Histórias cobertas:** 1–5, 31.

**Blocked by:** [01 — Fechar o contrato compartilhado](01-contrato-api.md)

## Entrega

Permitir navegar, buscar e ler Documentos de governança e consultar suas Versões com dados demonstrativos.

## Critérios de aceitação

- [ ] Reusar a entrada Governança na sidebar e o design system. Implementar busca por título ou tipo, leitura da Versão e histórico conforme o Perfil demonstrativo.
- [ ] Distinguir Versão vigente, futura, histórica e Rascunho autorizado. Exibir as datas de Vigência e representar carregamento, vazio, erro e acesso restrito.
- [ ] Manter os mocks isolados em desenvolvimento e alinhados ao contrato. Verificar desktop e mobile a partir de 320 px, temas claro e escuro, teclado e foco.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

# ProcoBaja ERP

## Agent skills

### Issue tracker

As issues ficam em arquivos Markdown locais em `.scratch/<feature>/`. Consulte `docs/agents/issue-tracker.md`.

### Triage labels

Use o vocabulário padrão (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) na linha `Status:` de cada issue. Consulte `docs/agents/triage-labels.md`.

### Domain docs

Contexto único: use `CONTEXT.md` e `docs/adr/` na raiz do repositório. Consulte `docs/agents/domain.md`.

## Projeto e referências

O ProcoBaja ERP é um sistema interno de gestão da equipe Baja SAE da UTFPR. O repositório reúne `frontend/` (React, TypeScript e Vite), `backend/` (Java e Spring Boot), PostgreSQL e configurações Docker Compose.

- Para alterações no frontend, siga `frontend/AGENTS.md`; consulte `frontend/ARCHITECTURE.md` para fluxos e `frontend/DESIGN.md` para padrões visuais.
- Para estrutura e dependências entre funcionalidades do backend, consulte `backend/ARCHITECTURE.md`.
- Para modelo de domínio e decisões, siga os apontamentos em `docs/agents/domain.md`; os diagramas e o modelo relacional proposto estão em `docs/diagramas/`.
- Para executar ou operar os serviços, consulte os guias em `docs/infraestrutura/docker/` e os arquivos Compose na raiz.

## Cuidados de integração

O frontend usa uma sessão local demonstrativa e ainda não está conectado à autenticação ou a uma API de aplicação. Não trate esse estado como autenticação, autorização ou proteção de dados reais. Ao implementar a integração, valide permissões e regras de negócio no backend.

As migrações Flyway versionadas ficam em `backend/src/main/resources/db/migration/`. Preserve as migrações já aplicadas e introduza mudanças de esquema em novas migrações; o modelo proposto em `docs/diagramas/` não significa que toda funcionalidade já esteja implementada.

## Verificação

Execute as verificações relevantes à alteração. Para frontend, use os comandos e cenários de `frontend/AGENTS.md`; para backend, execute os testes Maven apropriados a partir de `backend/` (`./mvnw test`). Se uma verificação depender de serviços ou credenciais indisponíveis, informe a limitação e o que foi possível verificar.

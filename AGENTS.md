# ProcoBaja ERP

## Agent skills

### Issue tracker

As issues ficam em arquivos Markdown locais em `.scratch/<feature>/`. Consulte `docs/agents/issue-tracker.md`.

### Triage labels

Use o vocabulário padrão (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) na linha `Status:` de cada issue. Consulte `docs/agents/triage-labels.md`.

### Domain docs

Contexto único: quando uma skill mencionar `GLOSSARY.md`, use `CONTEXT.md`. Para decisões, consulte `docs/adr/` e `docs/agents/domain.md`.

## Projeto e orientação

O ProcoBaja ERP é um sistema interno de gestão da equipe Baja SAE da UTFPR. O repositório reúne `frontend/` (React, TypeScript e Vite), `backend/` (Java e Spring Boot), PostgreSQL e configurações Docker Compose.

- **Frontend:** siga `frontend/AGENTS.md`. Para navegação e estrutura, consulte `frontend/ARCHITECTURE.md`; para interface, estados e temas, consulte `frontend/DESIGN.md`.
- **Backend:** para estrutura, dependências e persistência, consulte `backend/ARCHITECTURE.md`. A arquitetura descreve também funcionalidades planejadas: confirme o estado atual no código e nas migrações.
- **Requisitos:** comece por `docs/projeto/visao-geral.md` e consulte os documentos relevantes em `docs/projeto/modulos/` e `docs/projeto/requisitos/`. O PDF em `docs/projeto/` é a referência acadêmica; os Markdown são sínteses, não prova de implementação.
- **Domínio e banco:** consulte `CONTEXT.md`, `docs/agents/domain.md` e, quando relevante, `docs/diagramas/`. Compare modelos e regras propostas com o código e as migrações. Ao encontrar uma divergência que afete a solução, registre-a e confirme a regra antes de presumir uma decisão.
- **Execução e infraestrutura:** consulte os guias em `docs/infraestrutura/docker/` e os arquivos Compose na raiz para o ambiente correspondente.

## Cuidados de integração

O frontend usa uma sessão local demonstrativa e ainda não está conectado à autenticação ou a uma API de aplicação. Ao integrar frontend e backend, valide identidade, permissões e regras de negócio no servidor; a sessão local não protege dados reais.

As migrações Flyway versionadas ficam em `backend/src/main/resources/db/migration/`. Preserve as migrações já aplicadas e introduza mudanças de esquema em novas migrações; o modelo proposto em `docs/diagramas/` não significa que toda funcionalidade já esteja implementada.

## Verificação

Escolha verificações que cubram as partes afetadas:

- **Frontend:** siga os comandos e cenários de `frontend/AGENTS.md`, incluindo a verificação no navegador quando a interação ou o layout mudar.
- **Backend:** execute os testes Maven apropriados a partir de `backend/` (por exemplo, `./mvnw test`). Para alterações no banco, verifique também as migrações e os fluxos de persistência afetados.
- **Documentação:** confira os caminhos e links alterados e compare instruções técnicas com os arquivos de configuração ou código correspondentes.

Informe o que foi verificado e qualquer limitação, como serviços, dados ou credenciais indisponíveis.

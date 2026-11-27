# ProcoBaja ERP

## Agent skills

### Issue tracker

Para trabalho publicado, consulte as [Issues do GitHub](https://github.com/BajaERP/procoBajaERP/issues) e o [Projects procoBajaERP](https://github.com/orgs/BajaERP/projects/2). Use `.scratch/<feature>/` para planejamento local quando estiver disponível. Consulte [o fluxo de issues](docs/agents/issue-tracker.md).

### Triage labels

Use o vocabulário padrão (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) na linha `Status:` dos arquivos locais. No GitHub, use o campo Status do Projects. Consulte [as convenções de triagem](docs/agents/triage-labels.md).

### Domain docs

Quando uma skill mencionar `GLOSSARY.md`, use o [glossário único do projeto](CONTEXT.md). Consulte os [ADRs](docs/adr/) e a [orientação de domínio](docs/agents/domain.md) antes de alterar uma regra.

## Projeto e orientação

O ProcoBaja ERP é um sistema interno de gestão da equipe Baja SAE da UTFPR. O repositório reúne `frontend/` (React, TypeScript e Vite), `backend/` (Java e Spring Boot), PostgreSQL e configurações Docker Compose.

- **Frontend:** siga `frontend/AGENTS.md`. Para navegação e estrutura, consulte `frontend/ARCHITECTURE.md`; para interface, estados e temas, consulte `frontend/DESIGN.md`.
- **Backend:** para estrutura, dependências e persistência, consulte `backend/ARCHITECTURE.md`. A arquitetura descreve também funcionalidades planejadas: confirme o estado atual no código e nas migrações.
- **Requisitos:** comece por `docs/projeto/visao-geral.md` e consulte os documentos relevantes em `docs/projeto/modulos/` e `docs/projeto/requisitos/`. O PDF em `docs/projeto/` é a referência acadêmica; os Markdown são sínteses, não prova de implementação.
- **Domínio e banco:** consulte `CONTEXT.md`, `docs/agents/domain.md` e, quando relevante, `docs/diagramas/`. Compare modelos e regras propostas com o código e as migrações. Ao encontrar uma divergência que afete a solução, registre-a e confirme a regra antes de presumir uma decisão.
- **Execução e infraestrutura:** consulte os guias em `docs/infraestrutura/docker/` e os arquivos Compose na raiz para o ambiente correspondente.

## Cuidados de integração

Equipe e Subsistemas usa a API real em produção. O modo demonstrativo com dados fictícios fica disponível em desenvolvimento. Para testar a sessão real localmente, use `VITE_DEMO_MODE=false` e o proxy same-origin de `/api`. Identidade, permissões, escopo e regras de negócio são validados pelo servidor.

O esquema executável é a sequência [Flyway V1 a V11](backend/src/main/resources/db/migration/). As issues dos módulos 2 a 7 usam as tabelas preparadas pela V11, e o Dashboard consulta as tabelas dos módulos de origem. Preserve as migrações já aplicadas. Consulte a [modelagem vigente](docs/projeto/modelagem.md) para distinguir estrutura de banco e comportamento implementado.

## Verificação

Escolha verificações que cubram as partes afetadas:

- **Frontend:** siga os comandos e cenários de `frontend/AGENTS.md`, incluindo a verificação no navegador quando a interação ou o layout mudar.
- **Backend:** execute os testes Maven apropriados a partir de `backend/` (por exemplo, `./mvnw test`). Para alterações no banco, verifique também as migrações e os fluxos de persistência afetados.
- **Documentação:** confira os caminhos e links alterados e compare instruções técnicas com os arquivos de configuração ou código correspondentes.

Informe o que foi verificado e qualquer limitação, como serviços, dados ou credenciais indisponíveis.

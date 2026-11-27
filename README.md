# ProcoBaja ERP

Sistema interno da equipe **ProcoBaja** — projeto Baja SAE da **UTFPR — Câmpus Cornélio Procópio**, desenvolvido como trabalho da disciplina **Oficina de Integração 1**.

**Equipe e Subsistemas (Módulo 1)** está integrado à API, com autenticação por RA, sessão no servidor e autorização por perfil. O ambiente de desenvolvimento também oferece uma sessão demonstrativa com dados fictícios. Os módulos 2 a 8 têm escopo e issues de implementação no GitHub. O banco já contém a base para esses módulos. [Módulos do projeto](docs/projeto/modulos/README.md) · [Quadro de acompanhamento](https://github.com/orgs/BajaERP/projects/2)

---

## Estrutura

| Área | Tecnologias e configuração |
| --- | --- |
| [Frontend](frontend/) | React, TypeScript, Vite, Tailwind CSS e React Router. Consulte as versões e os scripts no [package.json](frontend/package.json). |
| [Backend](backend/) | Java 21, Spring Boot, Spring Security, Spring Data JPA e OpenAPI. Consulte as versões no [pom.xml](backend/pom.xml). |
| Banco e infraestrutura | PostgreSQL 16, Flyway e Docker Compose. Consulte a [modelagem](docs/projeto/modelagem.md) e a [configuração base](compose.yaml). |

---

## Como executar

1. Crie o `.env` com base no [arquivo de exemplo](.env.example) e preencha as variáveis do [guia de desenvolvimento](docs/infraestrutura/docker/docker-dev.md).
2. Na raiz do repositório, execute `docker compose -f compose.yaml -f compose.dev.yaml up --build`.
3. Abra [o frontend local](http://localhost:5173). Para testar a sessão real, use `VITE_DEMO_MODE=false` e configure o Capitão inicial conforme o guia.

Para rodar o frontend diretamente, consulte a [arquitetura do frontend](frontend/ARCHITECTURE.md). Para publicar o ERP, siga o [guia de produção](docs/infraestrutura/docker/docker-prod.md), incluindo o encaminhamento de `/api` pela mesma origem HTTPS.

## Documentação do projeto

- [Visão geral e documento de referência](docs/projeto/visao-geral.md).
- [Requisitos funcionais](docs/projeto/requisitos/funcionais.md), [não funcionais](docs/projeto/requisitos/nao-funcionais.md) e [módulos](docs/projeto/modulos/README.md).
- [Diagramas e modelo relacional](docs/diagramas/README.md).
- [Arquitetura do frontend](frontend/ARCHITECTURE.md), [design](frontend/DESIGN.md) e [arquitetura do backend](backend/ARCHITECTURE.md).
- [Vocabulário do domínio](CONTEXT.md).
- [Issues do repositório](https://github.com/BajaERP/procoBajaERP/issues) e [Projects procoBajaERP](https://github.com/orgs/BajaERP/projects/2).

---

## Equipe

Projeto desenvolvido por alunos da disciplina:

- **Thales**
- **Diego**
- **João Pedro**
- **Ana Cecília**
- **Carlos**

---

## Licença

[MIT](./LICENSE) — Copyright (c) 2026 BajaERP.

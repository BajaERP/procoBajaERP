# ProcoBaja ERP

Sistema interno da equipe **ProcoBaja** — projeto Baja SAE da **UTFPR — Câmpus Cornélio Procópio**, desenvolvido como trabalho da disciplina **Oficina de Integração 1**.

O projeto prevê integrar a gestão da equipe, subsistemas, atividades, finanças, participação, competições, documentos e governança. A interface atual é um protótipo: a maior parte dos módulos está em construção e o login é apenas demonstrativo, sem autenticação no servidor.

---

## Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend | React | 19.3.0 |
| Frontend (build) | Vite | 8.3.0 |
| Frontend (linguagem) | TypeScript | 7.0.2 |
| Frontend (estilo) | Tailwind CSS v4 (via `@tailwindcss/vite`) | ^4.3.3 |
| Frontend (router) | react-router-dom (`createHashRouter`) | ^6.30.6 |
| Backend | Spring Boot | 4.1.1 |
| Backend (linguagem) | Java | 21 |
| Backend (persistência) | Spring Data JPA + PostgreSQL | 16 |
| Backend (API docs) | springdoc-openapi | 3.1.0 |

Estrutura: monorepo com `frontend/` (SPA React), `backend/` (API Spring Boot) e orquestração via Docker Compose.

---

## Como executar

Para desenvolvimento com Docker, configure o ambiente seguindo o [guia de desenvolvimento](docs/infraestrutura/docker/docker-dev.md). Para executar o frontend diretamente, consulte [sua arquitetura e comandos](frontend/ARCHITECTURE.md). O guia de [produção](docs/infraestrutura/docker/docker-prod.md) descreve o Compose e seus limites.

## Documentação do projeto

- [Visão geral e documento de referência](docs/projeto/visao-geral.md).
- [Requisitos funcionais](docs/projeto/requisitos/funcionais.md), [não funcionais](docs/projeto/requisitos/nao-funcionais.md) e [módulos](docs/projeto/modulos/README.md).
- [Diagramas e modelo relacional](docs/diagramas/README.md).
- [Arquitetura do frontend](frontend/ARCHITECTURE.md), [design](frontend/DESIGN.md) e [arquitetura do backend](backend/ARCHITECTURE.md).
- [Vocabulário do domínio](CONTEXT.md).

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

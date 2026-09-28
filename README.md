# ProcoBaja ERP

Sistema interno da equipe **ProcoBaja** — projeto Baja SAE da **UTFPR — Câmpus Cornélio Procópio**, desenvolvido como trabalho da disciplina **Oficina de Integração 1**.

O sistema cobre a gestão da equipe e seus subsistemas: membros, presenças, reuniões, atividades, finanças, competições e documentação, servindo como ponto único de organização para a equipe durante o ciclo de competições da Baja SAE.


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

# Frontend: login real e telas de Equipe

Status: needs-triage
Blocked by: 01, 02, 03, 04

Parte de [spec.md](../spec.md).

## O que fazer

- Trocar a sessão demonstrativa do `AuthContext` pelo login do backend, com cookie de sessão e token XSRF, chamando a API pelo proxy do Vite. O contrato do CSRF está na seção "Sessão e login" da spec: o valor vem do cookie `XSRF-TOKEN`, lido a cada requisição, e vai no cabeçalho `X-XSRF-TOKEN`.
- Criar as telas de Usuários, Subsistemas e Vínculos conforme o Perfil.
- Criar a troca da própria senha em Configurações.
- Separar da `GestaoPage` o que é do módulo 1 e o que é do módulo 4 (presenças e reuniões).

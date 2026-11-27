# ADR 0001 — Sessão no servidor

**Status:** Aceito

## Contexto

Uma Troca de Perfil ou Desativação precisa valer na próxima requisição. O ERP tem um backend e um frontend que consome a API pela mesma origem.

## Decisão

O Spring Security mantém a sessão no servidor. O navegador envia o cookie de sessão HttpOnly e o backend atualiza identidade e permissões ao atender requisições autenticadas. Uma sessão de conta desativada perde o acesso.

## Consequências

- A SPA usa `/api` na mesma origem. Para requisições que alteram dados, ela lê `XSRF-TOKEN` e envia o valor no cabeçalho `X-XSRF-TOKEN`. Os dados fictícios de desenvolvimento usam armazenamento local próprio.
- Em produção, o proxy serve frontend e API por HTTPS no mesmo domínio. Os cookies de sessão e de CSRF são `Secure`. [Guia de produção](../infraestrutura/docker/docker-prod.md)
- Um ambiente com várias instâncias de backend precisaria compartilhar as sessões, por exemplo, com Spring Session JDBC. A topologia atual usa uma instância.

## Alternativa considerada

JWT foi considerado pela autenticação sem estado. A sessão no servidor resolve a revogação de acesso para a topologia atual sem depender da expiração de um token.

## Implementação

Consulte a [arquitetura do backend](../../backend/ARCHITECTURE.md) e o [fluxo de sessão no navegador](../../frontend/ARCHITECTURE.md).

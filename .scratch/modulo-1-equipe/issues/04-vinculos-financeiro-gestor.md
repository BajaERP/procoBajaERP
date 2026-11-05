# Vínculos Financeiro–Gestor

Status: resolved
Blocked by: 02

Parte de [spec.md](../spec.md), seção "Vínculo Financeiro–Gestor".

## O que fazer

- Endpoints, só para o Capitão, para definir, alterar, transferir em lote e remover Vínculos.
- Consulta de Vínculos: o Capitão vê todos, o Gestor vê os seus e o Financeiro vê o próprio.

## Pronto quando

- Definir o primeiro Vínculo ativa o Financeiro, e remover o Vínculo de um Financeiro ativo o desativa.
- Depois que o Capitão transfere os Vínculos de um Gestor, esse Gestor pode trocar de Perfil.
- Gestor e Financeiro recebem 403 ao tentar alterar Vínculos.

## Comments

Implementado em `VinculoService` e `VinculoController`. Verificado por `VinculoControllerTest`.

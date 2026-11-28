# Vínculos Financeiro–Gestor

Status: resolved
Blocked by: 02

> Implementação original incorporada à `develop` pelo PR #36, a partir do #34. O vínculo entre duas pessoas foi substituído pela atribuição ao próprio Gestor; a correção está na [issue 06](06-correcao-gestor-financeiro-banco.md). Os critérios abaixo registram o escopo original, não a regra desejada.

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

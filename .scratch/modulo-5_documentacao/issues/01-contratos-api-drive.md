# 01: Fechar os contratos da API e do Drive

Status: ready-for-agent
Frente: Compartilhada

**Especificação:** [Módulo 5 · Documentação](../spec.md).

**Blocked by:** Nenhuma issue nova.

## Entrega

Acordar os contratos que permitem desenvolver frontend e backend em paralelo.

## Critérios de aceitação

- [ ] Definir consultas, filtros, comandos, capacidades e erros. Distinguir Documento, Versão, Associação, classificação e estado de exclusão. Reusar a sessão e o padrão HTTP e CSRF do ERP.
- [ ] Definir as operações entre backend e Drive para localizar, verificar compartilhamento, enviar, obter versões, abrir, baixar, enviar à lixeira e restaurar. Os testes do backend podem usar um adaptador simulado.
- [ ] Revisar exemplos de acesso negado, arquivo já importado, compartilhamento incompatível, Versão indisponível, falha temporária e exclusão sem confirmação. Entregar exemplos para os mocks de frontend e verificações da API.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

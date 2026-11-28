# 02: Consultar biblioteca e aplicar permissões

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 5 · Documentação](../spec.md).
**Histórias cobertas:** 1–6, 23–24.

**Blocked by:** [01 — Fechar os contratos da API e do Drive](01-contratos-api-drive.md)

## Entrega

Disponibilizar biblioteca, busca, filtros, detalhe e consulta autorizada para módulos consumidores.

## Critérios de aceitação

- [ ] Aplicar a matriz de consulta a listagens, busca, metadados e detalhe: comum de equipe para Perfis ativos; comum restrito para Capitão, Gestores e Integrantes dos Subsistemas indicados; administrativo para Capitão e Gestores; financeiro para Capitão e Gestor Financeiro.
- [ ] Reusar identidade, Perfil e Subsistema do Módulo 1. O Gestor Financeiro deriva da associação ao Subsistema Financeiro. A visibilidade contextual de Orçamentos no Financeiro não concede acesso à biblioteca confidencial.
- [ ] Representar separadamente a Associação temática a Subsistema e os Subsistemas autorizados. Permitir localizar Documentos associados e expor consulta e autorização para os módulos consumidores, sempre no escopo de Documentação.
- [ ] Verificar pela API autenticada com PostgreSQL e Flyway, incluindo Perfis diferentes, dois Subsistemas e consulta direta ou por Associação sem autorização. Excluir metadados restritos também de busca e filtros.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments

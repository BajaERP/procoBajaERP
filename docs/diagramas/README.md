# Diagramas e modelo de dados

Esta pasta reúne artefatos de análise do ProcoBaja ERP. Eles descrevem uma modelagem proposta e podem evoluir independentemente do código e das migrações aplicadas.

- [Banco de dados](Diagramas%20de%20Banco%20de%20Dados/): DBML V5, SQL de referência e figuras principais e complementares. As figuras ainda mostram o modelo V4, com o Perfil Financeiro vinculado a um Gestor; o DBML/SQL V5 também antecedem a decisão de derivar o Gestor Financeiro da associação ao Subsistema canônico. Para esse ponto, prevalecem o [ADR 0002](../adr/0002-gestor-financeiro-derivado-do-subsistema.md) e as migrações Flyway. Consulte o [guia de modelagem](../projeto/modelagem.md) antes de usar o esquema.
- [Casos de uso](Diagramas%20de%20Caso%20de%20Uso/): arquivo editável Draw.io e imagens por módulo.
- [Classes](Diagramas%20de%20Classe/): arquivo editável Draw.io e imagens por módulo.
- [Documento de projeto](../projeto/documento-de-projeto.pdf): fonte acadêmica de referência, com requisitos, dicionário, protótipos e diagramas.

O [índice dos módulos](../projeto/modulos/README.md) relaciona cada área aos requisitos e diagramas correspondentes. Para funcionamento atual, consulte as arquiteturas do [frontend](../../frontend/ARCHITECTURE.md) e do [backend](../../backend/ARCHITECTURE.md).

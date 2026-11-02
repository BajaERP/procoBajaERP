# Modelagem e integridade previstas

A seção 5 do [documento de projeto](documento-de-projeto.pdf#page=57), páginas 57–98, apresenta modelo relacional, dicionário, classes e fluxo de atividades. Este arquivo é um guia de leitura, não uma especificação substituta nem uma garantia sobre o banco instalado. O PDF informa 50 tabelas, 345 atributos e 19 domínios enumerados na versão apresentada.

## Fontes e limites

- O [DBML V4](../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v4.dbml) representa o modelo lógico proposto; o [SQL do esquema](../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_criar_esquema_v4.sql) e o [SQL complementar](../diagramas/Diagramas%20de%20Banco%20de%20Dados/02_indices_adicionais.sql) acompanham essa modelagem.
- As migrações do backend ficam em [`backend/src/main/resources/db/migration/`](../../backend/src/main/resources/db/migration/). Compare-as com o modelo antes de implementar ou afirmar compatibilidade; não aplique os SQLs de referência diretamente sobre um banco existente sem avaliar o histórico Flyway.
- O dicionário do PDF, páginas 68–87, distingue campos obrigatórios no DBML de regras condicionais de negócio. Nulidade na tabela não implica necessariamente que um valor possa faltar em toda operação.
- Os [diagramas de classes](../diagramas/Diagramas%20de%20Classe/) são análise proposta, não um retrato obrigatório das classes já criadas. O dashboard consulta dados dos demais módulos e não tem tabelas ou classes de domínio próprias na modelagem apresentada.

## Relações e invariantes destacados no PDF

- **Equipe:** RA único, perfil por usuário e vínculo Financeiro–Gestor; a associação do Líder ao próprio subsistema usa relacionamento composto. No modelo, subsistema ativo exige Líder, embora o campo admita nulo em outros estados.
- **Atividades:** alocações de atividades em sprints preservam entrada, saída e origem; a transferência referencia uma alocação da mesma atividade. O SQL complementar prevê no máximo uma alocação aberta por atividade.
- **Financeiro:** solicitações preservam revisões, itens, orçamentos e decisões; o orçamento escolhido deve pertencer à solicitação e revisão autorizadas. O SQL complementar prevê no máximo uma movimentação ativa de pagamento por compra.
- **Pessoas:** presença, diários, validações, participação e registros disciplinares possuem vínculos e históricos próprios; confidencialidade e autorização exigem validação contextual.
- **Documentos:** arquivos são previstos no Drive; categorias, metadados, revisões, solicitações de exclusão e associações ficam no ERP. Associar um documento não amplia seu acesso.
- **Eventos:** competições e reuniões se relacionam a eventos, participantes, responsáveis e logística; valores financeiros e documentos continuam sujeitos aos seus módulos.
- **Governança e auditoria:** versões, histórico e aceites são preservados; o registro de auditoria identifica entidade e registro de forma polimórfica, sem FK para todas as tabelas.

As FKs e os checks não garantem, por si só, os perfis corretos, as permissões, os três orçamentos, as duas aprovações e a integridade transacional da compra. O PDF exige verificá-los no backend e nos testes. A seção 5.1.2.10 também informa que o DBML não define contas internas do PostgreSQL, funções, procedimentos ou gatilhos.

## Dicionário por módulo

Os nomes abaixo ajudam a localizar as tabelas do DBML e do PDF. A tabela de `usuarios` e outras entidades compartilhadas aparecem em diversos fluxos; campos, tipos, chaves e regras completas permanecem no dicionário original, seções 5.1.2.1–5.1.2.8.

- **01 - Equipe e Subsistemas:** `perfis`, `permissoes`, `perfil_permissoes`, `usuarios`, `subsistemas`, `vinculos_financeiro_gestor`.

- **02 - Atividades e Sprints:** `sprints`, `atividades`, `atividades_responsaveis`, `atividades_subsistemas`, `atividades_sprints`, `historico_status_atividades`.

- **03 - Gestao Financeira:** `categorias_financeiras`, `fornecedores`, `solicitacoes_compra`, `revisoes_solicitacoes_compra`, `solicitacoes_itens`, `solicitacoes_compra_subsistemas`, `orcamentos_compra`, `aprovacoes_compra`, `historico_solicitacoes_compra`, `compras`, `movimentacoes_financeiras`, `previsoes_financeiras`.

- **04 - Pessoas e Participacao:** `registros_presenca`, `historico_registros_presenca`, `diarios_atividades`, `participacoes_eventos`, `registros_disciplinares`.

- **05 - Documentacao:** `categorias_documentos`, `documentos`, `versoes_documentos`, `documentos_subsistemas`, `documentos_atividades`, `documentos_eventos`, `documentos_compras`, `solicitacoes_exclusao_documentos`.

- **06 - Competicoes e Eventos:** `eventos`, `evento_responsaveis`, `reunioes`, `reunioes_subsistemas`, `competicoes`, `logistica_eventos`, `inscricoes_competicao`, `resultados_competicao`.

- **07 - Governanca:** `documentos_governanca`, `versoes_governanca`, `historico_edicoes_governanca`, `aceites_governanca`.

- **09 - Auditoria Transversal:** `logs_auditoria`.

## Domínios enumerados

O DBML define os seguintes domínios; valores e contexto constam na tabela 62 do PDF e no próprio modelo:

`estado_atividade`, `prioridade_atividade`, `tipo_entrada_sprint`, `escopo_compra`, `status_compra`, `papel_aprovador`, `decisao_aprovacao`, `tipo_movimentacao`, `situacao_movimentacao`, `situacao_previsao_financeira`, `situacao_presenca`, `situacao_participacao`, `tipo_registro_pessoas`, `nivel_registro_pessoas`, `tipo_evento`, `tipo_logistica`, `confidencialidade_documento`, `status_exclusao_documento`, `status_versao_governanca`.

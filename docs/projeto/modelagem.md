# Modelagem e integridade previstas

A seção 5 do [documento de projeto](documento-de-projeto.pdf#page=57), páginas 57–98, apresenta modelo relacional, dicionário, classes e fluxo de atividades. Este arquivo é um guia de leitura, não uma especificação substituta nem uma garantia sobre o banco instalado. O PDF informa 50 tabelas, 345 atributos e 19 domínios enumerados na versão apresentada.

## Fontes e limites

- O [modelo relacional V6](../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v6.dbml) reúne as decisões atuais. O esquema executável é a sequência Flyway V1 a V11. A [V11](../../backend/src/main/resources/db/migration/V11__alinhar_modelo_modulos_2_a_8.sql) depende da V10 integrada em `develop` e aproveita as tabelas criadas na V4.
- Na V6, o Gestor Financeiro deriva do vínculo do Gestor ativo com o Subsistema Financeiro, conforme a migração V8. O Capitão ativo único e o escopo da auditoria continuam sob as migrações V9 e V10. O PDF conserva a modelagem histórica da V4.
- O [DBML v5 histórico](../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v5.dbml) representa o modelo lógico proposto; o [SQL do esquema](../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_criar_esquema_v5.sql) e o [SQL complementar](../diagramas/Diagramas%20de%20Banco%20de%20Dados/02_indices_adicionais.sql) acompanham essa modelagem.
- As migrações do backend ficam em [`backend/src/main/resources/db/migration/`](../../backend/src/main/resources/db/migration/). Compare-as com o modelo antes de implementar ou afirmar compatibilidade; não aplique os SQLs de referência diretamente sobre um banco existente sem avaliar o histórico Flyway.
- O dicionário do PDF, páginas 68–87, distingue campos obrigatórios no DBML de regras condicionais de negócio. Nulidade na tabela não implica necessariamente que um valor possa faltar em toda operação.
- Os [diagramas de classes](../diagramas/Diagramas%20de%20Classe/) são análise proposta, não um retrato obrigatório das classes já criadas. O dashboard consulta dados dos demais módulos e não tem tabelas ou classes de domínio próprias na modelagem apresentada.

## Relações e invariantes destacados no PDF

- **Equipe:** RA único e perfil por usuário; o Gestor Financeiro é derivado da associação do único Gestor ativo ao Subsistema Financeiro, sem tabela de atribuição separada. A associação do Líder ao próprio subsistema usa relacionamento composto. No modelo, subsistema ativo exige Líder, embora o campo admita nulo em outros estados.
- **Atividades:** alocações de atividades em sprints preservam entrada, saída e origem; a transferência referencia uma alocação da mesma atividade. O SQL complementar prevê no máximo uma alocação aberta por atividade.
- **Financeiro:** solicitações preservam revisões, itens, orçamentos e decisões; o orçamento escolhido deve pertencer à solicitação e revisão autorizadas. O SQL complementar prevê no máximo uma movimentação ativa de pagamento por compra.
- **Pessoas:** presença, diários, validações, participação e registros disciplinares possuem vínculos e históricos próprios; confidencialidade e autorização exigem validação contextual.
- **Documentos:** arquivos são previstos no Drive; categorias, metadados, revisões, solicitações de exclusão e associações ficam no ERP. Associar um documento não amplia seu acesso.
- **Eventos:** competições e reuniões se relacionam a eventos, participantes, responsáveis e logística; valores financeiros e documentos continuam sujeitos aos seus módulos.
- **Governança e auditoria:** versões, histórico e aceites são preservados; o registro de auditoria identifica entidade e registro de forma polimórfica, sem FK para todas as tabelas.

As FKs e os checks não garantem, por si só, os perfis corretos, as permissões, os três orçamentos, as duas aprovações e a integridade transacional da compra. O PDF exige verificá-los no backend e nos testes. A seção 5.1.2.10 também informa que o DBML não define contas internas do PostgreSQL, funções, procedimentos ou gatilhos.

## Restrições da V11

A V11 foi validada com Flyway no PostgreSQL 16.4, tanto em banco vazio quanto na atualização da V10 com dados de teste. Os cenários cobriram a preservação de presenças, diários, aprovações de compra, versões de Governança e aceites. A extensão `btree_gist` foi instalada com o usuário do ambiente descartável de teste.

- O índice parcial limita a equipe a uma Sprint em andamento. A exclusão GiST impede sobreposição de turnos lançados para o mesmo usuário e de vigências publicadas para o mesmo documento de Governança. A migração instala `btree_gist`; a conta que executa o Flyway precisa poder instalar a extensão nesse banco.
- Registros anteriores de presença com horários recebem a própria data de registro como data de saída. Versões de Governança anteriormente publicadas ganham vigência a partir da publicação até a publicação seguinte do mesmo documento.
- Em bancos com dados anteriores dos módulos ainda em planejamento, diários duplicados por dia ou turnos com sobreposição precisam ser reconciliados antes de aplicar a V11. Nenhum desses registros é apagado pela migração. Os `CHECK`s marcados `NOT VALID` preservam linhas antigas sem os novos dados, mas são exigidos em novas gravações e atualizações.
- Autorização, transições, histórico gravado junto à operação, aprovação conjunta e integração com o Drive serão verificados nos serviços de cada módulo. O Dashboard lê as fontes conforme as permissões dos módulos e não duplica os registros.

## Base das especificações dos módulos

| Módulo | Dados e restrições disponíveis |
| --- | --- |
| 02 · Atividades e Sprints | Datas previstas e efetivas, uma Sprint em andamento, arquivo com motivo, histórico de planejamento, estado no encerramento e distinção entre retirada e encerramento. As alocações preservam a origem e permitem consultar o destino. |
| 03 · Gestão Financeira | Revisão atual com FK, itens e quantidades por orçamento, aprovação vinculada ao orçamento da mesma revisão, decisões anteriores preservadas, pagamento único, reembolso separado e previsão vinculada ao pagamento da própria compra. Na submissão, o serviço confirma se pelo menos três fornecedores distintos cobrem todos os itens da revisão. |
| 04 · Pessoas e Participação | Vínculo histórico pela auditoria do Módulo 1, com revisão manual quando houver lacuna. Presença aceita horários do dia seguinte e impede sobreposição. Diário tem unicidade diária e histórico; Participações têm validação própria. Ocorrências e Advertências são confidenciais, com exposição controlada do texto formal comunicado. O banco protege esse texto após a comunicação. |
| 05 · Documentação | Escopo de acesso por Subsistema separado das associações temáticas, autoria e datas de versões, histórico de operações e confirmação do Drive antes de marcar uma exclusão como executada. O serviço autoriza cada leitura e alteração. |
| 06 · Competições e Eventos | Reuniões de Gestores, atribuições independentes de chamada e logística, lista sugerida de inscrições confirmadas, cancelamento e histórico de remarcações. Valores continuam no Financeiro. |
| 07 · Governança | Preparação para publicação, vigências sem sobreposição, conteúdo publicado imutável e pendências de aceite por usuário e versão. Encerrar a vigência preserva conteúdo e aceites. |
| 08 · Dashboard | Indicadores consultam as tabelas dos módulos 02 a 07. Períodos padrão, filtros, escopos por perfil e mensagens de indisponibilidade pertencem aos serviços e à interface. |

As issues dos módulos usam este esquema como base. O trabalho de backend cobre consultas, gravações transacionais e permissões com as tabelas existentes.

## Dicionário por módulo

Os nomes abaixo ajudam a localizar as tabelas do DBML e do PDF. A tabela de `usuarios` e outras entidades compartilhadas aparecem em diversos fluxos; campos, tipos, chaves e regras completas permanecem no dicionário original, seções 5.1.2.1–5.1.2.8.

- **01 - Equipe e Subsistemas:** `perfis`, `permissoes`, `perfil_permissoes`, `usuarios`, `subsistemas`. O vínculo financeiro atual é derivado dos dados de `usuarios` e `subsistemas`.

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

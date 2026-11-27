# Modelagem e integridade

As migrações Flyway V1 a V11 definem o esquema executável do ERP. O DBML v6 documenta o modelo vigente. O Módulo 1 usa o esquema na aplicação. A V4 introduziu as tabelas dos módulos 2 a 7 e a V11 ajustou suas estruturas para o comportamento planejado. O Dashboard consulta as fontes de origem. [Migrações Flyway](../../backend/src/main/resources/db/migration/) · [Modelo relacional v6](../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v6.dbml)

## Fontes de modelagem

| Fonte | Uso |
|---|---|
| Migrações Flyway | Verificar colunas, tipos, chaves, índices, extensões, gatilhos e transformações já aplicadas. Corrigir o esquema com nova migração, preservando as versões executadas. |
| DBML v6 | Localizar entidades, relações e decisões atuais, junto das restrições registradas em SQL. |
| Documento de Projeto de Software | Consultar a modelagem acadêmica, o dicionário e suas regras de referência. A versão do PDF informa 50 tabelas, 345 atributos e 19 domínios enumerados. |
| Diagramas de classes e caso de uso | Consultar os conceitos, relações e fluxos de análise de cada módulo. |

As decisões posteriores sobre a responsabilidade financeira, a sucessão do Capitão e a auditoria estão nas migrações V8, V9 e V10. Os arquivos V5 são referências históricas do modelo acadêmico. Para criar ou atualizar ambientes, use a sequência Flyway. [Documento de projeto, capítulo 5](documento-de-projeto.pdf#page=57) · [ADRs](../adr/) · [DBML v5 histórico](../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v5.dbml) · [SQL do esquema histórico](../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_criar_esquema_v5.sql) · [SQL complementar histórico](../diagramas/Diagramas%20de%20Banco%20de%20Dados/02_indices_adicionais.sql)

## Base das especificações dos módulos

| Módulo | Estruturas e garantias do banco | Regras a cargo dos serviços |
|---|---|---|
| [01 · Equipe e Subsistemas](modulos/equipe-e-subsistemas.md) | RA único, um Perfil por Usuário, no máximo um Capitão ativo e um Gestor ativo no Financeiro. Auditoria com Subsistemas de origem e destino. | Autorizar operações e campos, validar liderança e transferências, tratar a sucessão em uma transação e usar o escopo do registro na consulta de auditoria. |
| [02 · Atividades e Sprints](modulos/atividades-e-sprints.md) | Uma Sprint em andamento, uma Alocação aberta por Atividade, datas planejadas e efetivas, origem da transferência, arquivamento, histórico de planejamento e resultado no fechamento. | Exigir campos de Alocação, validar destinos e executar a retirada ou o fechamento com histórico consistente. |
| [03 · Gestão Financeira](modulos/gestao-financeira.md) | Referência à Revisão atual, itens e quantidades associados aos Orçamentos e FK de decisão para Orçamento da mesma Revisão. Uma Saída de Pagamento ativa por Compra, Reembolso separado e Previsão vinculada ao Pagamento da própria Compra. | Conferir os três Fornecedores distintos e a cobertura dos itens, aplicar a aprovação conjunta, proteger valores, limitar Reembolsos e gravar Pagamento, Saída e realização da Previsão na mesma transação. |
| [04 · Pessoas e Participação](modulos/pessoas-e-participacao.md) | Turnos com data de saída e sem sobreposição por Usuário, Diário único por dia, Validação e histórico de Participações, texto formal de Advertência protegido após comunicação. | Determinar vínculo histórico, aplicar escopo e confidencialidade, processar lotes de forma atômica e definir a elegibilidade nos indicadores. |
| [05 · Documentação](modulos/documentacao.md) | Escopo de acesso separado das associações temáticas, metadados de Versões, histórico e estado da operação de exclusão. | Autorizar cada leitura, respeitar a classificação no Drive e gravar a exclusão como executada após confirmação do Drive. |
| [06 · Competições e Eventos](modulos/competicoes-e-eventos.md) | Subtipos de Evento, atribuições independentes para chamada e Logística, Inscrições, Resultados, cancelamento e histórico de remarcação. | Validar datas, autorizar atribuições e edições, sugerir somente Inscrições confirmadas para a chamada e consultar valores e documentos de origem conforme permissões. |
| [07 · Governança](modulos/governanca.md) | Preparação para publicação, Vigências sem sobreposição, conteúdo publicado imutável e registro de confirmações por Usuário e Versão. | Publicar e substituir Versões, atribuir pendências às contas elegíveis e preservar Ciência e Aceites no histórico. |
| [08 · Dashboard e Indicadores](modulos/dashboard-e-indicadores.md) | Usa as tabelas dos módulos de origem. | Compor consultas autorizadas por cartão, aplicar períodos e filtros e tratar falhas sem interromper as demais consultas. |

Campos que admitem nulo no banco podem ser obrigatórios em operações específicas, como a Alocação de uma Atividade. Confidencialidade, transições e regras que envolvem vários registros exigem verificação no servidor e em testes de integração. [Requisitos não funcionais](requisitos/nao-funcionais.md)

## Aplicação da V11

O histórico do projeto registra a execução da V11 com Flyway no PostgreSQL 16.4, em instalação limpa e em atualização de uma base V10 com dados de teste. A atualização verificou presenças, Diários, aprovações de Compra, Versões de Governança e Aceites. [Migração V11](../../backend/src/main/resources/db/migration/V11__alinhar_modelo_modulos_2_a_8.sql)

- A V11 instala `btree_gist` para garantir que turnos do mesmo Usuário e Vigências publicadas do mesmo Documento de Governança não se sobreponham. A conta que executa o Flyway precisa poder instalar a extensão quando ela ainda não estiver disponível.
- Presenças anteriores com horários recebem como data de saída a própria data de registro. Versões de Governança anteriormente publicadas ganham Vigência a partir da publicação até a publicação seguinte do mesmo Documento, quando houver.
- Se uma base anterior contiver Diários duplicados por dia ou turnos sobrepostos, reconcilie esses registros antes de atualizar. A V11 preserva as linhas, e as novas regras de unicidade e exclusão exigem dados compatíveis. As restrições `CHECK NOT VALID` deixam de revalidar linhas existentes na instalação e passam a ser exigidas em novas gravações e atualizações.

## Índice de tabelas

O DBML v6 detalha tipos, chaves e outros vínculos. O dicionário acadêmico está nas seções 5.1.2.1 a 5.1.2.8 do PDF. [DBML v6](../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v6.dbml) · [Dicionário de dados acadêmico](documento-de-projeto.pdf#page=68)

- **Equipe e Subsistemas** reúne `usuarios`, `subsistemas`, `perfis`, `permissoes` e `perfil_permissoes`.
- **Atividades e Sprints** usa `atividades`, `atividades_responsaveis`, `atividades_subsistemas`, `sprints`, `atividades_sprints`, `historico_status_atividades` e `historico_planejamento_atividades`.
- **Gestão Financeira** usa `solicitacoes_compra`, `revisoes_solicitacoes_compra`, `solicitacoes_itens`, `solicitacoes_compra_subsistemas`, `fornecedores`, `orcamentos_compra`, `orcamentos_itens`, `aprovacoes_compra`, `historico_solicitacoes_compra`, `compras`, `categorias_financeiras`, `movimentacoes_financeiras` e `previsoes_financeiras`.
- **Pessoas e Participação** usa `registros_presenca`, `historico_registros_presenca`, `diarios_atividades`, `historico_diarios_atividades`, `participacoes_eventos`, `historico_participacoes_eventos`, `registros_disciplinares` e `historico_observacoes`.
- **Documentação** usa `categorias_documentos`, `documentos`, `versoes_documentos`, `documentos_acessos_subsistemas`, `documentos_subsistemas`, `documentos_atividades`, `documentos_eventos`, `documentos_compras`, `solicitacoes_exclusao_documentos` e `historico_operacoes_documentos`.
- **Competições e Eventos** usa `eventos`, `evento_responsaveis`, `reunioes`, `reunioes_subsistemas`, `competicoes`, `logistica_eventos`, `inscricoes_competicao`, `resultados_competicao` e `historico_remarcacoes_eventos`.
- **Governança** usa `documentos_governanca`, `versoes_governanca`, `historico_edicoes_governanca` e `aceites_governanca`.
- **Auditoria** usa `logs_auditoria`, em que o tipo da entidade e o identificador do registro permitem referenciar registros de diferentes módulos.

Os domínios enumerados, incluindo `status_diario` introduzido na V11, estão no DBML v6 e na sequência Flyway. Para os domínios do modelo original, consulte a tabela 62 do PDF.

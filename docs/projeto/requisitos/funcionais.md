# Requisitos funcionais

Síntese da tabela 2 do [Documento de Projeto de Software](../documento-de-projeto.pdf#page=17), páginas 17–19, preservando IDs e prioridades. São requisitos propostos, não uma lista de funcionalidades concluídas. As regras completas e matrizes de permissão estão nas seções 4.1.1–4.1.8, páginas 19–35 do PDF.

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | Autenticar usuários por RA e senha própria do ERP, sem credenciais da UTFPR. | Essencial |
| RF02 | Cadastrar, consultar, editar e gerenciar usuários. | Essencial |
| RF03 | Definir um perfil ativo por usuário; vincular cada Financeiro a um único Gestor, com manutenção do vínculo restrita ao Capitão/Administrador. | Essencial |
| RF04 | Cadastrar, consultar, editar e gerenciar subsistemas. | Essencial |
| RF05 | Associar cada integrante a um único subsistema por vez, definir o Líder e permitir transferências autorizadas. | Essencial |
| RF06 | Criar e gerenciar sprints da equipe com duração prevista de 15 dias. | Essencial |
| RF07 | Gerenciar atividades no backlog e nas sprints, transferindo atividades não concluídas e preservando sua origem. | Essencial |
| RF08 | Associar um ou mais responsáveis e subsistemas às atividades, inclusive compartilhadas. | Essencial |
| RF09 | Definir prazo, prioridade e estimativa de esforço em escala Fibonacci. | Essencial |
| RF10 | Alterar o status de atividades entre Não iniciada, Não concluída, Em andamento, Concluída e Pausada, respeitando permissões. | Essencial |
| RF11 | Visualizar e acompanhar atividades em quadro Kanban. | Essencial |
| RF12 | Exibir indicadores e alertas de progresso, atividades com pouco progresso ou transferidas e aviso próximo à metade da sprint. | Importante |
| RF13 | Gerenciar entradas e saídas financeiras, preservando histórico e justificativas de cancelamentos. | Essencial |
| RF14 | Permitir a Líderes e Membros criar e acompanhar solicitações de compra relacionadas aos seus subsistemas e aos perfis autorizados gerenciar compras. | Essencial |
| RF15 | Associar compras à equipe ou a um ou mais subsistemas, sem divisão do valor entre os subsistemas. | Importante |
| RF16 | Registrar fornecedores, itens, links, pelo menos três orçamentos, notas fiscais e demais informações das compras. | Importante |
| RF17 | Planejar compras, controlar estados, exigir aprovação conjunta de Financeiro e Capitão/Administrador, registrar reprovações, permitir reenvio e consultar previsão de caixa. | Importante |
| RF18 | Consultar gastos por subsistema e período e o histórico de compras e solicitações. | Importante |
| RF19 | Registrar, alterar, validar e acompanhar presença e carga horária, incluindo turnos, justificativas e frequência. | Importante |
| RF20 | Registrar participação em reuniões, eventos e competições conforme o responsável pelo registro. | Importante |
| RF21 | Permitir o registro do diário de atividades pelos Membros e sua validação por Gestores e Capitão/Administrador. | Importante |
| RF22 | Registrar e consultar observações, ocorrências e advertências com níveis de confidencialidade. | Importante |
| RF23 | Enviar, consultar, organizar e gerenciar documentos por integração com Google Drive, respeitando permissões de exclusão. | Essencial |
| RF24 | Associar documentos a subsistemas, atividades, reuniões, eventos e competições. | Importante |
| RF25 | Consultar pelo ERP o histórico e as versões de documentos no Google Drive, inclusive documentos existentes. | Importante |
| RF26 | Cadastrar e gerenciar competições, eventos e reuniões. | Importante |
| RF27 | Registrar participantes, inscrições, resultados, logística, hospedagem, alimentação, veículo, gastos e documentos de competições. | Importante |
| RF28 | Criar, consultar e editar documentos de governança, normas e diretrizes conforme permissões. | Importante |
| RF29 | Controlar versões, alterações e aprovações de governança e registrar ciência e aceite de versões publicadas. | Importante |
| RF30 | Disponibilizar dashboard personalizado por perfil, subsistema e permissões. | Essencial |
| RF31 | Exibir indicadores e alertas sobre atividades, equipe, frequência, documentação, reuniões, compras e situação financeira. | Importante |
| RF32 | Restringir operações, informações e campos conforme perfil, subsistema e confidencialidade. | Essencial |

## Como usar esta lista

A prioridade é a da tabela 2, não o estado de entrega. Para planejar ou validar uma funcionalidade, combine o requisito com a seção do [módulo correspondente](../modulos/README.md), as regras de perfil, o modelo de dados e a implementação efetiva. Os resumos abaixo não incluem todas as condições das matrizes e não substituem critérios de aceitação.

## Regras transversais de referência

- **Acesso:** o controle de acesso e de confidencialidade deve ser aplicado no backend, inclusive em consultas, indicadores e associações entre módulos. Consulte RF01, RF03 e RF32 e o PDF, páginas 19–20 e 33–35.
- **Vínculo Financeiro–Gestor:** o vínculo é organizacional e não concede ao Gestor acesso a dados financeiros restritos. A manutenção do vínculo é exclusiva do Capitão/Administrador; as condições de mudança de perfil estão no PDF, páginas 19–20.
- **Compras:** as regras de três orçamentos, aprovação conjunta, histórico e visibilidade de preços precisam ser aplicadas conforme perfil e contexto. Consulte RF13–RF18 e o PDF, seção 4.1.3.
- **Governança:** o histórico de versões e aceites deve ser preservado; a aprovação final e publicação são exclusivas do Capitão/Administrador. Consulte RF28–RF29 e o PDF, páginas 32–33.
- **Dashboard:** atalhos e indicadores não concedem acesso adicional aos dados dos módulos de origem. Consulte RF30–RF32 e o PDF, páginas 33–35.

Os resumos não substituem as matrizes de permissões do documento original. Para vocabulário e relações de domínio, consulte [CONTEXT.md](../../../CONTEXT.md); para entidades e restrições propostas, consulte o [modelo relacional](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v4.dbml).

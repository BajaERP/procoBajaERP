# Requisitos funcionais

A tabela resume os requisitos funcionais e preserva os IDs e as prioridades acadêmicas. As descrições incorporam as decisões posteriores sobre contas e responsabilidade financeira. Consulte o índice dos módulos para o estado de implementação. [Tabela 2 do Documento de Projeto de Software](../documento-de-projeto.pdf#page=17) · [Módulos](../modulos/README.md)

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | Autenticar por RA ou SIAPE e senha própria do ERP. | Essencial |
| RF02 | Cadastrar, consultar, editar e gerenciar usuários. | Essencial |
| RF03 | Definir um Perfil por Usuário. Identificar automaticamente como Gestor Financeiro o único Gestor ativo associado ao Subsistema Financeiro. | Essencial |
| RF04 | Cadastrar, consultar, editar e gerenciar subsistemas. | Essencial |
| RF05 | Permitir no máximo um Subsistema por Usuário, conforme o Perfil, definir o Líder e realizar transferências autorizadas. | Essencial |
| RF06 | Criar e gerenciar Sprints da equipe com duração sugerida de 15 dias. | Essencial |
| RF07 | Gerenciar atividades no backlog e nas sprints, transferindo atividades não concluídas e preservando sua origem. | Essencial |
| RF08 | Associar um ou mais responsáveis e subsistemas às atividades, inclusive compartilhadas. | Essencial |
| RF09 | Definir prazo, prioridade e estimativa de esforço em escala Fibonacci. | Essencial |
| RF10 | Alterar o estado de trabalho de Atividades conforme as permissões e registrar Não concluída como resultado histórico de pendência no encerramento. | Essencial |
| RF11 | Visualizar e acompanhar atividades em quadro Kanban. | Essencial |
| RF12 | Exibir indicadores e alertas de progresso, atividades com pouco progresso ou transferidas e aviso próximo à metade da sprint. | Importante |
| RF13 | Gerenciar entradas e saídas financeiras, preservando histórico e justificativas de cancelamentos. | Essencial |
| RF14 | Permitir a Integrantes ativos criar e acompanhar Solicitações de compra do próprio Subsistema e aos Perfis autorizados gerenciar Compras. | Essencial |
| RF15 | Associar compras à equipe ou a um ou mais subsistemas, sem divisão do valor entre os subsistemas. | Importante |
| RF16 | Registrar itens, links e documentos de compra. Exigir ao menos três Orçamentos de Fornecedores distintos para os mesmos itens e quantidades ao enviar uma Revisão. | Importante |
| RF17 | Planejar Compras, exigir aprovação conjunta de Capitão e Gestor Financeiro sobre a mesma Revisão e o mesmo Orçamento, registrar Reprovações, permitir reenvio e consultar Previsão de caixa. | Importante |
| RF18 | Consultar gastos por subsistema e período e o histórico de compras e solicitações. | Importante |
| RF19 | Registrar, alterar, validar e acompanhar presença e carga horária, incluindo turnos, justificativas e frequência. | Importante |
| RF20 | Registrar participação em reuniões, eventos e competições conforme o responsável pelo registro. | Importante |
| RF21 | Permitir o registro do Diário de atividades pelos Membros e sua Validação por Gestores e Capitão. | Importante |
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

## Regras de aplicação

- A API aplica as permissões por Perfil, Subsistema, responsabilidade e confidencialidade. Consultas diretas, agregações e vínculos entre módulos seguem as permissões de origem. [RF32 por módulo](../modulos/README.md)
- Gestor Financeiro é uma responsabilidade derivada da associação ativa entre um Gestor e o Subsistema Financeiro. A regra de visibilidade do Solicitante vale no contexto e estado da própria Solicitação de compra. [ADR do Gestor Financeiro](../../adr/0002-gestor-financeiro-derivado-do-subsistema.md) · [Gestão Financeira](../modulos/gestao-financeira.md)
- O histórico de Versões e Aceites de Governança permanece consultável conforme o Perfil. Aprovação final e publicação cabem ao Capitão. [Governança](../modulos/governanca.md)

Use as páginas dos módulos para detalhar o comportamento esperado e os cenários de validação. As prioridades da tabela registram a classificação acadêmica. Os critérios de aceitação e as dependências de entrega ficam nas issues compartilhadas da equipe. [Módulos](../modulos/README.md) · [Guia de modelagem](../modelagem.md) · [Projeto no GitHub](https://github.com/orgs/BajaERP/projects/2)

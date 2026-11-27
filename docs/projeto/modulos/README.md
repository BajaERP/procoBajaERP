# Módulos do ProcoBaja ERP

Consulte a página de cada módulo para conhecer o comportamento, as permissões e os cenários de validação. O estado das issues e suas dependências fica no [projeto compartilhado no GitHub](https://github.com/orgs/BajaERP/projects/2).

| Módulo | Estado no código | Escopo |
|---|---|---|
| 01 · [Equipe e Subsistemas](equipe-e-subsistemas.md) | Implementado e integrado à API | Sessão, contas, Perfis, liderança, transferências, sucessão, responsabilidade financeira e auditoria. |
| 02 · [Atividades e Sprints](atividades-e-sprints.md) | Planejado | Quadro, Backlog, planejamento de Sprints, Alocações, históricos e alertas. |
| 03 · [Gestão Financeira](gestao-financeira.md) | Planejado | Solicitações, Revisões, aprovações, Pagamento, caixa e previsões. |
| 04 · [Pessoas e Participação](pessoas-e-participacao.md) | Planejado | Presença em turnos, Frequência, Carga horária, Diários e registros administrativos e de Participação. |
| 05 · [Documentação](documentacao.md) | Planejado | Biblioteca, acesso por classificação, arquivos no Drive, versões, exclusão e restauração. |
| 06 · [Competições e Eventos](competicoes-e-eventos.md) | Planejado | Agenda, compromissos, responsáveis, Inscrições, Logística e Resultados. |
| 07 · [Governança](governanca.md) | Planejado | Rascunhos, publicação, Vigência, Ciência, Aceite e acompanhamento. |
| 08 · [Dashboard e Indicadores](dashboard-e-indicadores.md) | Planejado | Cartões e alertas no escopo autorizado, com consultas aos módulos de origem. |

## Dependências entre módulos

- Equipe e Subsistemas fornece sessão, Perfis, vínculos e a responsabilidade financeira. Os módulos aplicam no servidor as permissões de suas consultas e operações.
- Competições e Eventos fornece o contexto e os responsáveis da chamada. Pessoas e Participação mantém lançamentos, Validação e histórico. A chamada na tela do Evento depende das duas entregas.
- Documentação autoriza a pesquisa e a abertura de arquivos vinculados. Compras e Eventos integram esses vínculos como entregas próprias. Eventos também depende da consulta por Evento de Gestão Financeira para apresentar o acesso aos dados autorizados.
- Cada cartão do Dashboard depende da consulta autorizada da própria fonte. Atividades e Sprints fornece Sprint, Atividades e alertas. Gestão Financeira fornece saldo e Previsão. Pessoas e Participação fornece Frequência e horas. Competições e Eventos fornece a Agenda. Governança fornece os Aceites pendentes do Usuário autenticado.

O [documento de projeto](../documento-de-projeto.pdf#page=19) contém as matrizes acadêmicas nas seções 4.1.1 a 4.1.8. As páginas acima incorporam decisões posteriores, como a derivação do Gestor Financeiro. Para localizar requisitos e dados, consulte os [requisitos funcionais](../requisitos/funcionais.md), os [requisitos não funcionais](../requisitos/nao-funcionais.md) e o [guia de modelagem](../modelagem.md).

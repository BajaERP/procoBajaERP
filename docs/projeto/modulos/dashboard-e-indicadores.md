# Dashboard e Indicadores

O Módulo 08 está planejado para atender RF30 e RF31, com as regras de acesso de RF32. A rota inicial do ERP ainda exibe uma página provisória. [Matriz acadêmica, seção 4.1.8](../documento-de-projeto.pdf#page=33) · [Guia de modelagem](../modelagem.md)

## Cartões da primeira entrega

| Cartão | Período e fonte |
|---|---|
| Sprint e Atividades atribuídas ou atrasadas | Sprint atual por padrão, com seleção de outra Sprint. [Atividades e Sprints](atividades-e-sprints.md) |
| Frequência e horas validadas | Mês atual por padrão, com seleção de outro mês. [Pessoas e Participação](pessoas-e-participacao.md) |
| Próximos Eventos | Próximos 30 dias. [Competições e Eventos](competicoes-e-eventos.md) |
| Aceites pendentes | Pendências atuais do Usuário autenticado. [Governança](governanca.md) |
| Saldo e Previsão de caixa | Situação atual, disponível para Capitão e Gestor Financeiro. [Gestão Financeira](gestao-financeira.md) |

Cada cartão informa seu período. As seleções de Sprint e mês afetam apenas os cartões que usam o respectivo recorte. Indicadores de compras, reuniões recentes e Documentação ficam para entregas posteriores.

## Alertas e estados

- O destaque mostra um item que o Usuário pode resolver, na ordem de Atividade atrasada, pouco progresso na Sprint e Aceite pendente. Sem ação autorizada, o destaque fica oculto. Os demais avisos permanecem nos cartões correspondentes enquanto a pendência existir. Os atalhos levam às ações autorizadas no módulo de origem.
- Exibir zero quando houver dados e o resultado for zero. Quando faltarem registros elegíveis, exibir “Sem dados no período”, ou “Sem dados para calcular” para Frequência. Em caso de falha, exibir “Indisponível no momento” com nova tentativa no cartão afetado. Os demais cartões continuam disponíveis.
- O frontend pode avançar com mocks após o contrato compartilhado. Cada cartão integra a consulta real da sua fonte de forma independente. Os módulos de origem calculam os resultados e definem quais registros entram nos indicadores.

## Permissões

| Perfil | Acesso previsto |
|---|---|
| Capitão | Visão operacional da equipe, saldo e Previsão de caixa conforme as permissões de origem. |
| Gestor | Visão operacional da equipe conforme as permissões de origem. |
| Gestor Financeiro | Mantém a visão operacional de Gestor e consulta saldo e Previsão de caixa pela atribuição financeira. |
| Líder | Começa pelo próprio Subsistema e consulta outros escopos conforme as permissões de origem. |
| Membro | Começa pelos próprios dados e consulta as informações permitidas pelos módulos de origem. |
| Orientador | Consulta indicadores agregados da equipe ou de Subsistemas ativos e somente Competições na Agenda. |

Todos os Usuários consultam seus próprios Aceites pendentes. O servidor aplica as permissões de origem às consultas, agregações, escopos selecionáveis e acessos diretos. A interface oculta cartões fora do escopo.

## Referências

- [Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-08%20-%20Dashboard%20e%20Indicadores.drawio.png) · [Visão geral das classes](../../diagramas/Diagramas%20de%20Classe/00%20Vis%C3%A3o%20Geral%20%E2%80%94%20classes%20centrais.drawio.png)
- [Requisitos funcionais](../requisitos/funcionais.md) · [Dashboard no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=138-426)

## Cenários para validar

- Consultar o painel com Perfis diferentes e verificar o escopo dos indicadores, dos atalhos e dos Aceites pessoais.
- Mudar o mês de Frequência ou a Sprint e conferir que o período dos demais cartões permanece independente.
- Testar a prioridade entre alertas autorizados e verificar que cada atalho leva à ação correspondente.
- Comparar zero, ausência de dados e falha de uma fonte, verificando que os cartões saudáveis continuam disponíveis e que é possível tentar novamente no cartão afetado.

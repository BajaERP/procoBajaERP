# Pessoas e Participação

O Módulo 04 está planejado para atender RF19 a RF22. A página atual é provisória e o esquema Flyway inclui a base de turnos, diários, Participações e registros administrativos. [Matriz acadêmica, seção 4.1.4](../documento-de-projeto.pdf#page=25) · [Guia de modelagem](../modelagem.md)

## Presença em turnos e indicadores

- A chamada sugere 18h às 22h e aceita o horário real. O horário em comum é aplicado aos integrantes selecionados e preserva ajustes individuais. É possível salvar apenas o grupo conferido. Cada gravação ou Validação em lote é atômica.
- Presente pode ser lançado sem horários. Quando houver horários, a saída deve ser posterior à entrada. Um turno que cruza a meia-noite indica a data de saída e toda a duração conta no dia de início. Turnos consecutivos são válidos e o banco rejeita sobreposição para o mesmo Integrante. Justificada exige motivo e Ausente aceita motivo opcional.
- Registros retroativos usam o Subsistema no dia de início. O Líder atual desse Subsistema, Capitão ou Gestor pode completar a chamada. Se houver lacuna no histórico, Capitão ou Gestor confirma com justificativa o Subsistema da época. Capitão ou Gestor pode registrar também a presença do Capitão sem Subsistema.
- Capitão e Gestor validam os registros. Corrigir um registro já validado exige Capitão ou Gestor, justificativa e preservação do valor anterior, autor e data. A correção volta à fila e sai dos indicadores até a nova Validação.
- Frequência divide o total de Presente validadas pela soma de Presente e Ausente validadas. Justificadas são exibidas à parte. Sem registros elegíveis, mostrar “Sem dados para calcular”. Carga horária soma a duração dos turnos com horários e Validação vigente. Presente validada sem horários contribui para a Frequência. [Dashboard e Indicadores](dashboard-e-indicadores.md)

## Diário de atividades

- Cada Membro pode criar um Diário por dia de trabalho, inclusive retroativamente e com vários turnos no mesmo dia. Apenas o próprio Membro altera o texto.
- O primeiro Rascunho é privado. O envio explícito abre a versão para Capitão e Gestor, que podem validar com comentário opcional, devolver com motivo ou reabrir um Diário validado. Durante ajustes, os responsáveis pela revisão consultam a última versão enviada e seu histórico. As alterações ficam privadas até o reenvio.

## Observações, Ocorrências e Advertências

- Uma Observação fica disponível ao Integrante citado, ao Líder do Subsistema de referência, ao Capitão e aos Gestores. Capitão e Gestor publicam sobre qualquer Integrante. O Líder publica sobre pessoas do próprio Subsistema. Capitão, Gestor ou o autor ainda autorizado pode corrigir a Observação com motivo e histórico.
- Uma Ocorrência é confidencial. O Líder pode encaminhá-la no próprio Subsistema e recebe confirmação de envio. Capitão e Gestor têm acesso ao relato e podem encerrá-lo sem Advertência.
- A Advertência exige motivo formal e pode estar ligada a uma Ocorrência. Capitão ou Gestor registra a emissão e a comunicação como atos separados. Após a comunicação, o Integrante vê o texto formal da própria Advertência e pode registrar ciência. O acesso à Ocorrência e às notas internas continua restrito a Capitão e Gestor.
- Capitão ou Gestor pode revogar com justificativa. O Integrante continua consultando o texto original com a situação Revogada. A ciência registra quando o Integrante tomou conhecimento.

## Participação em Eventos

[Competições e Eventos](competicoes-e-eventos.md) fornece o tipo de Evento, horário, situação, pessoas esperadas e responsável pela chamada. Pessoas e Participação mantém os lançamentos, a Validação e o histórico.

A lista de Participações Previstas pode ser ajustada antes do Evento. A partir do início, o responsável autorizado registra Presente, Ausente ou Justificada, e Capitão ou Gestor valida as situações finais. Os indicadores usam apenas situações finais validadas de Eventos não cancelados. Um cancelamento bloqueia novos lançamentos e conserva os registros anteriores no histórico.

## Permissões

| Perfil | Acesso planejado |
|---|---|
| Capitão e Gestor | Consultam registros da equipe, corrigem e validam presença e Participação, revisam Diários e administram registros confidenciais. Gestor Financeiro mantém essas permissões. |
| Líder | Registra e corrige presença ainda pendente no próprio Subsistema, publica Observações, encaminha Ocorrências desse escopo e registra a chamada de Evento conforme a atribuição. |
| Membro | Cria, edita e envia o próprio Diário e consulta seus registros e o conteúdo administrativo disponibilizado ao próprio Integrante. |
| Orientador | Consulta indicadores agregados da equipe ou de Subsistemas ativos. |

Cada Integrante pode consultar seus próprios registros de presença e Participação dentro das regras de visibilidade. O servidor aplica o escopo também a filtros, histórico, confirmações e indicadores.

## Referências

- [Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-04%20-%20Pessoas%20e%20Participa%C3%A7%C3%A3o.drawio.png) · [Diagrama de classes](../../diagramas/Diagramas%20de%20Classe/04%20Pessoas%20e%20Participa%C3%A7%C3%A3o.drawio.png) · [Modelo relacional acadêmico](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_32_Pessoas_Presenca_Horas_e_Diario.png)
- [Requisitos funcionais](../requisitos/funcionais.md) · [Pessoas e Participação no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=126-426)

## Cenários para validar

- Registrar um turno que cruza meia-noite, rejeitar um lote com sobreposição e conferir a atribuição da duração à data inicial.
- Corrigir um registro validado com justificativa e conferir o histórico e o retorno aos indicadores após nova Validação.
- Devolver um Diário e comprovar que os responsáveis consultam a última versão enviada enquanto o Membro edita o rascunho.
- Encaminhar uma Ocorrência como Líder e verificar o acesso do Integrante apenas ao texto da Advertência comunicada, inclusive depois da revogação.
- Registrar a chamada com responsáveis de Subsistemas distintos e conferir o histórico após a troca de responsável ou o cancelamento do Evento.

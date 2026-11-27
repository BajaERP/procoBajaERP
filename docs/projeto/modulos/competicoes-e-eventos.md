# Competições e Eventos

O Módulo 06 está planejado para atender RF26 e RF27 e integra RF20 e RF24. A página atual é provisória. [Matriz acadêmica, seção 4.1.6](../documento-de-projeto.pdf#page=29) · [Guia de modelagem](../modelagem.md)

## Agenda, Inscrições e Logística

- A Agenda reúne próximos compromissos e histórico, com busca por nome, local ou responsável e filtros por tipo. O cadastro exige tipo, nome e data e hora de início. Término, local e descrição são opcionais. Reuniões podem incluir pauta, resumo e Subsistemas. Cada edição de Competição é um novo Evento e pode incluir desafio técnico e veículo.
- Capitão ou Gestor registra uma Inscrição por Integrante e Competição. Os estados são Pendente, Confirmada e Cancelada. Somente as confirmadas entram na sugestão da chamada. O cancelamento preserva a Inscrição e a Participação já lançada no histórico.
- Capitão e Gestor gerenciam a Logística e podem delegá-la a um Líder ativo para um Evento específico. A Logística guarda dados operacionais de transporte e compartilhamento, hospedagem, alimentação, Inscrição e Auxílios. O Auxílio registra instituição e descrição quando disponíveis. Custos, valores e pagamentos ficam em Gestão Financeira.
- Capitão e Gestor registram Resultados por edição e modalidade. Cada Resultado exige modalidade e ao menos um dado entre posição, pontuação e descrição.

## Chamada, remarcação e cancelamento

- A atribuição de chamada é independente da Logística. Nas Reuniões semanais, cada Líder registra a chamada do próprio Subsistema, inclusive em Reuniões conjuntas. Nas Reuniões dos Gestores, registra o Gestor responsável. Para Competições, Eventos gerais e Reuniões avulsas, Capitão ou Gestor designa um Capitão, Gestor ou Líder ativo.
- A chamada fica bloqueada até haver responsável. Na troca de responsável, os lançamentos e a autoria permanecem no histórico. A permissão da atribuição anterior é encerrada e o novo responsável pode completar pendências. O servidor verifica situação, horário e responsabilidade ao gravar.
- Competições e Eventos fornece o contexto da chamada. Pessoas e Participação mantém o lançamento, a Validação e o histórico. A chamada na tela do Evento depende das duas entregas. [Pessoas e Participação](pessoas-e-participacao.md)
- A remarcação preserva o Evento, as Inscrições e as Participações Previstas. O motivo é opcional na remarcação comum. Após um lançamento de Presente, Ausente ou Justificada, mesmo pendente de Validação, a correção de data exige justificativa e cabe ao Capitão ou ao Gestor. O histórico conserva as datas anteriores.
- O cancelamento exige motivo e preserva o Evento e as Participações já registradas no histórico. Ele bloqueia novos lançamentos e retira o Evento dos indicadores de Participação.

## Integrações

Atas, regulamentos e outros arquivos podem ser associados ao Evento. A consulta e a abertura dependem das permissões da biblioteca. Os usuários com acesso financeiro consultam os valores no Financeiro a partir dos registros vinculados ao Evento. [Documentação](documentacao.md) · [Gestão Financeira](gestao-financeira.md)

## Permissões

| Perfil | Acesso previsto |
|---|---|
| Capitão | Gerencia e cancela qualquer compromisso e consulta as informações integradas conforme as permissões de origem. |
| Gestor | Gerencia e cancela qualquer compromisso. Os valores financeiros são restritos ao Capitão e ao Gestor Financeiro. |
| Gestor Financeiro | Tem as permissões operacionais de Gestor e as permissões financeiras da sua atribuição. |
| Líder | Cria e edita Reuniões do próprio Subsistema e pode cancelar uma Reunião exclusiva dele. Registra a chamada ou edita a Logística conforme sua responsabilidade em cada Evento. |
| Membro | Consulta as informações e os documentos autorizados, a própria Inscrição e a própria Participação. |
| Orientador | Consulta Competições atuais e históricas, com dados operacionais e documentos autorizados. A Participação é exibida apenas de forma agregada. |

O recorte da Agenda do Orientador segue a tela de referência. As permissões do Gestor Financeiro derivam do vínculo com o Subsistema Financeiro. [Agenda do Orientador no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=1207-11589) · [ADR do Gestor Financeiro](../../adr/0002-gestor-financeiro-derivado-do-subsistema.md)

## Referências

- [Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-06%20-%20Competi%C3%A7%C3%B5es%20e%20Eventos.drawio.png) · [Diagrama de classes](../../diagramas/Diagramas%20de%20Classe/06%20Competi%C3%A7%C3%B5es%20e%20Eventos.drawio.png) · [Modelo relacional acadêmico](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_37_Competicoes_e_Eventos_Organizacao.png)
- [Requisitos funcionais](../requisitos/funcionais.md) · [Competições e Eventos no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=126-3399)

## Cenários para validar

- Cadastrar evento ou competição com informações operacionais e consultar dados por perfil.
- Verificar a atribuição da chamada em uma Reunião avulsa e o escopo do Líder em uma Reunião conjunta.
- Confirmar que o Líder só pode cancelar Reuniões exclusivas do próprio Subsistema e que a correção de data após um lançamento exige justificativa.
- Conferir a preservação das Participações existentes ao cancelar uma Inscrição ou um Evento e o acesso a documentos associados.
- Conferir que quem administra o Evento acessa somente os documentos e valores permitidos pelos respectivos módulos.

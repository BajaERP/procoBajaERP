# ProcoBaja ERP

Vocabulário do ProcoBaja ERP, sistema interno da equipe Baja SAE da UTFPR Câmpus Cornélio Procópio. As definições abrangem os oito módulos e incluem regras das entregas planejadas. Consulte o [índice dos módulos](docs/projeto/modulos/README.md) para saber o que está integrado e os [ADRs](docs/adr/) para decisões de arquitetura.

## Linguagem

### Equipe

**PROCOBAJA**:
Equipe de extensão da UTFPR-CP que projeta e constrói veículos off-road para as competições Baja SAE. O ERP atende a essa equipe.

**Usuário**:
Conta de acesso ao ERP identificada pelo **RA**, com um **Perfil** e situação ativa ou desativada. Uma conta ativa pode acessar o ERP mesmo quando seu Subsistema está inativo. O próprio Usuário altera a senha. Capitão e Gestor corrigem nome e RA conforme seu escopo de administração. A **Desativação** preserva a conta e seu histórico.
_Avoid_: Conta UTFPR, login

**RA**:
Identificador numérico de login do Usuário, usado com uma senha própria do ERP e sem as credenciais institucionais: o Registro Acadêmico do aluno na UTFPR ou, para o Orientador, o SIAPE. Só o próprio Usuário, o Capitão e o Gestor o veem.

**Senha provisória**:
Senha gerada pelo ERP ao cadastrar um Usuário ou redefinir sua senha, mostrada uma única vez a quem fez a operação. A senha configurada para o primeiro Capitão também é provisória. Não tem prazo de expiração. A redefinição encerra as sessões ativas do Usuário. No próximo acesso após o cadastro ou a redefinição, o Usuário deve substituí-la por uma senha própria antes de acessar os módulos.

**Integrante**:
Pessoa que faz parte da equipe. Pertence a um Subsistema, com duas exceções: o Capitão nunca pertence a nenhum, porque atua em todos, e o Orientador pode pertencer ou não, só para fins de informação.
_Avoid_: Membro (para qualquer pessoa da equipe: Membro é um Perfil)

**Perfil**:
Papel de acesso de um **Usuário**. Cada conta tem um dos cinco Perfis do ERP, Capitão, Gestor, Líder, Membro ou Orientador. As permissões seguem o Perfil e o escopo da operação. A **Atribuição financeira** complementa o Perfil Gestor quando aplicável.
_Avoid_: Cargo, função, role

**Troca de Perfil**:
Mudança do Perfil de um Usuário; é o que o Documento de Projeto chama de alterar cargo e permissões. Ninguém passa a ser Líder nem deixa de ser Líder por Troca de Perfil, só por Definição de Líder, e ninguém troca o próprio Perfil.
_Avoid_: Alterar cargo, alterar permissões

**Capitão/Administrador**:
Perfil com administração geral da equipe e do ERP, publica Governança e aprova compras junto ao Gestor Financeiro. Há um único Capitão ativo. A sucessão é iniciada pelo Capitão atual: ele escolhe um Gestor ou Membro ativo para assumir e um Subsistema ativo para continuar como Membro. As duas mudanças são feitas juntas. O Capitão não pertence a Subsistema enquanto ocupa o Perfil.
_Avoid_: Admin

**Sucessão do Capitão**:
Operação exclusiva do Capitão ativo que transfere esse Perfil a um Gestor ou Membro ativo e associa o Capitão anterior, como Membro, a um Subsistema ativo escolhido na mesma operação. A conta promovida deixa seu Subsistema, se tiver um; se era Gestor Financeiro, perde essa responsabilidade ao deixar o Financeiro. Não se faz sucessão por cadastro nem por Troca de Perfil.

**Gestor**:
Perfil que administra Integrantes e Subsistemas, exceto pela Desativação de Subsistema, exclusiva do Capitão; também administra Sprints e Validações. Entre os Usuários, administra só os de Perfil Líder, Membro e Orientador. Um Gestor associado ao Subsistema Financeiro passa a ser identificado como Gestor Financeiro e tem acesso à Informação financeira restrita.

**Gestor Financeiro**:
Gestor ativo associado ao Subsistema Financeiro, responsável pelo caixa, pelas compras e pela previsão financeira, e que aprova compras junto ao Capitão. Seu Perfil continua sendo Gestor e ele conserva as funções de Gestor. A responsabilidade decorre da associação ao Subsistema: associar um Gestor ativo a ele a concede; transferi-lo para fora ou desativá-lo a retira. No máximo um Gestor ativo pode estar associado ao Subsistema Financeiro por vez; a responsabilidade pode ficar vaga. O Subsistema Financeiro é permanente, nasce desativado e é ativado pela Definição de Líder normal. Quem pode ver o Gestor vê também que ele é o Gestor Financeiro. As permissões são recalculadas no servidor a cada requisição.

**Líder**:
Perfil de quem lidera um Subsistema; ter o Perfil Líder e liderar um Subsistema são a mesma coisa. Gerencia as Atividades do Subsistema e registra presença e participação dos seus Integrantes.

**Definição de Líder**:
Escolha do Líder de um Subsistema entre os Membros ativos; quem vem de outro Subsistema é transferido na mesma operação. O escolhido passa ao Perfil Líder, e o Líder anterior, se houver, volta a Membro no mesmo Subsistema. Fora a Desativação do Subsistema, um Líder só sai dele, é desativado ou troca de Perfil depois de ser substituído.
_Avoid_: Promoção

**Membro**:
Perfil do Integrante que executa Atividades, escreve seu Diário de atividades e pode abrir Solicitações de compra.

**Orientador**:
Perfil do professor que acompanha o projeto com acesso às informações não confidenciais disponibilizadas ao seu perfil. Na Equipe, vê os Subsistemas ativos e as pessoas sem Subsistema; pessoas vinculadas a Subsistemas inativos não aparecem nas listagens nem na consulta direta, mesmo que estejam ativas. Se pertencer a um Subsistema inativo, consulta o próprio perfil por `/api/auth/eu`. No módulo de Documentação, pode enviar arquivos conforme as permissões previstas.

**Subsistema**:
Divisão interna da equipe, técnica ou administrativa, coordenada por um Líder que também é seu Integrante; cada Integrante pertence a no máximo um por vez. Nasce desativado e sem Líder, já podendo receber Integrantes, e se ativa ao ganhar o primeiro Líder. Nunca é excluído: ao ser desativado, seus Integrantes, inclusive os Usuários desativados, são transferidos para Subsistemas ativos, podendo ir para destinos diferentes, e o Líder vai como Membro. Se houver Integrantes e não houver outro Subsistema ativo para recebê-los, a desativação fica bloqueada; se estiver vazio, não precisa de destino.
_Avoid_: Setor, área, módulo

**Composição**:
Lista dos Integrantes de um Subsistema, com seu Líder. Capitão e Gestor veem a composição de todos os Subsistemas; Orientador, somente a dos ativos; Líder e Membro, só a do próprio, inclusive quando ele está inativo. Nomes e Líderes dos Subsistemas ativos são visíveis a todos; os inativos, apenas ao Capitão, ao Gestor e a quem pertence a eles como Líder ou Membro. A visibilidade da Composição não concede acesso a Usuários desativados ou informações restritas.

**Desativação**:
Retirada de um Usuário ou de um Subsistema de uso, preservando seu histórico; Usuário desativado não acessa o ERP. É a única forma de retirada, porque o ERP não exclui Usuários nem Subsistemas. A Reativação a desfaz e exige a mesma permissão; ninguém desativa a si mesmo.
_Avoid_: Exclusão, remoção

**Módulo**:
Área funcional do ERP, como Equipe e Subsistemas ou Gestão Financeira. Um Módulo pode atender vários **Subsistemas**.
_Avoid_: Subsistema

**Atribuição financeira**:
Responsabilidade financeira derivada da associação de um Gestor ativo ao Subsistema permanente Financeiro. Não há vínculo entre pessoas nem operação manual separada: a transferência de um Gestor para esse Subsistema concede a responsabilidade; sua transferência para fora, mudança de Perfil ou desativação a retira. Só pode haver um Gestor ativo associado ao Financeiro por vez; uma restrição do banco protege essa regra contra concorrência.
_Avoid_: Vínculo Financeiro–Gestor entre pessoas distintas

**Transferência de integrante**:
Mudança de um Integrante de um Subsistema para outro. Em uma transferência comum, o destino pode estar inativo; na desativação do Subsistema de origem, os destinos devem estar ativos.

### Atividades e Sprints

**Sprint**:
Ciclo de trabalho da equipe PROCOBAJA. Pode ser planejada com antecedência e tem duração sugerida de 15 dias, ajustável por Capitão ou Gestor. A equipe tem uma única Sprint em andamento por vez. Capitão ou Gestor confirma o início e o encerramento.
_Avoid_: usar "sprint" para os ciclos de duas semanas do desenvolvimento do ERP (chame-os de "sprint de desenvolvimento")

**Atividade**:
Trabalho da equipe vinculado a pelo menos um Subsistema, que pode estar no Backlog ou alocado em uma Sprint. A alocação exige pelo menos um Responsável ativo. Uma Atividade sem Responsável ativo pode permanecer no Backlog ou, se perder o último Responsável após a alocação, na Sprint com indicação de que precisa de nova atribuição.
_Avoid_: Tarefa, task, card

**Backlog**:
Conjunto das Atividades sem Alocação vigente. Uma Atividade sai do Backlog ao ser alocada, inclusive em uma Sprint ainda planejada, e volta se for retirada sem outro destino.

**Responsável**:
Usuário designado para executar uma Atividade ou conduzir um Evento; pode ser de outro Subsistema.

**Estado da atividade**:
Situação de uma Atividade no Kanban. Não iniciada indica que o trabalho ainda não começou. Em andamento indica trabalho ativo, Pausada indica interrupção deliberada e Concluída indica trabalho terminado. Não concluída registra, no histórico de uma Sprint encerrada, que a Atividade continuou pendente no fechamento.

**Estimativa de esforço**:
Tamanho previsto de uma Atividade, expresso em um dos valores 1, 2, 3, 5, 8, 13 ou 21 da sequência de Fibonacci. É opcional no Backlog e obrigatório na Alocação.
_Avoid_: Story points, horas

**Alocação**:
Passagem de uma Atividade por uma Sprint; uma Atividade tem no máximo uma Alocação aberta.

**Transferência de atividade**:
Encerramento da Alocação de uma Atividade não concluída e sua abertura em uma Sprint posterior, preservando a Sprint de origem.
_Avoid_: Mover, reabrir

**Alerta de meia sprint**:
Aviso de pouco progresso exibido a partir do dia que marca a metade do período planejado da Sprint para Atividades Não iniciadas ou Pausadas. A indicação de Transferida aparece separadamente.

### Financeiro

**Informação financeira restrita**:
Preços, Orçamentos, Movimentações, saldos, gastos e Previsões, acessíveis ao Capitão e ao Gestor Financeiro. O Solicitante pode ver preços e Orçamentos das próprias Solicitações enquanto estiverem em andamento, inclusive após uma reprovação que permita corrigir e reenviar.
_Avoid_: Dado sensível (genérico)

**Solicitação de compra**:
Pedido de aquisição aberto por um Integrante. Pode ser corrigido e reenviado após reprovação e é encerrado pelo Pagamento ou pelo cancelamento.
_Avoid_: Pedido, requisição, compra (antes de aprovada)

**Solicitante**:
Usuário que abriu uma Solicitação de compra.

**Revisão**:
Rodada de uma Solicitação de compra com seus itens, Subsistemas e Orçamentos; fica imutável ao ser enviada, e uma reprovação leva a uma nova Revisão.
_Avoid_: Versão (reservada a Documentos e Governança)

**Escopo da compra**:
Indica se a compra é Geral (da equipe toda) ou de Subsistemas (um ou mais, com valor integral e sem rateio).
_Avoid_: Rateio, divisão

**Orçamento**:
Proposta de preço de um Fornecedor para uma Revisão. Cada Revisão enviada precisa de pelo menos três Orçamentos de Fornecedores distintos, cobrindo os mesmos itens e quantidades.
_Avoid_: Cotação

**Fornecedor**:
Empresa ou loja que fornece Orçamentos e vende os itens comprados.

**Status da compra**:
Situação de uma Solicitação de compra: Planejada (compra futura ainda não enviada), Aguardando aprovação, Aprovada, Reprovada, Realizada/Paga ou Cancelada.

**Aprovação conjunta**:
Exigência de que Capitão e Gestor Financeiro aprovem a mesma Revisão e o mesmo Orçamento. Qualquer reprovação exige justificativa. Se algum dos dois titulares mudar antes da conclusão, o titular atual precisa decidir. A decisão anterior permanece no histórico, e Compras já aprovadas conservam a aprovação.

**Compra**:
Execução de uma Solicitação de compra aprovada, usando um Orçamento da Revisão aprovada.

**Pagamento**:
Ato de marcar uma Compra como Realizada/Paga, que gera exatamente uma Saída ativa.

**Reembolso**:
Entrada vinculada a uma Compra que representa a devolução de dinheiro efetivamente pago. Pode ser total ou parcial e preserva a Saída original. A soma dos Reembolsos não pode exceder o valor efetivamente pago.

**Movimentação financeira**:
Entrada ou Saída de dinheiro no caixa da equipe, classificada por uma Categoria financeira; nunca é apagada, só cancelada com autor e justificativa.
_Avoid_: Lançamento, transação

**Categoria financeira**:
Classificação de Movimentações e Previsões de um único tipo, Entrada ou Saída (ex.: Inscrição, Transporte, Patrocínio, Doação).

**Previsão financeira**:
Entrada ou Saída esperada para uma data, que fica Pendente, Realizada (ligada à Movimentação efetiva) ou Cancelada.

**Previsão de caixa**:
Visão do caixa futuro formada pelas Previsões financeiras Pendentes.

### Pessoas e Participação

**Registro de presença**:
Situação de um Integrante em um turno de um dia (Presente, Ausente ou Justificada), registrada pelo Líder do Subsistema. Capitão e Gestores podem registrar a presença do Capitão em turno, sem vínculo com Subsistema. Das 18h às 22h é o horário sugerido. O registro pode usar o horário real do turno fora dessa faixa. Uma presença sem horários pode contar para a Frequência após a Validação e fica sem Carga horária registrada.
_Avoid_: Participação (reservada a Eventos)

**Ausência justificada**:
Situação que exige motivo no Registro de presença ou na Participação em Evento. Na situação Ausente, o motivo é opcional.

**Carga horária**:
Horas trabalhadas por um **Integrante**, calculadas pelos horários de início e fim dos **Registros de presença** com **Validação** vigente. Um turno pode terminar depois da meia-noite, com data de saída explícita e duração integral atribuída à data de início.

**Frequência**:
Proporção de Registros de presença validados como Presente entre os validados como Presente ou Ausente. Ausências Justificadas aparecem separadamente e ficam fora desse cálculo.

**Validação**:
Confirmação, pelo Gestor ou pelo Capitão, de um Registro de presença, de um Diário de atividades ou de uma Participação com situação final. Gestor e Capitão podem validar a própria presença ou Participação. A correção de um Registro de presença ou de uma Participação já validada exige justificativa e preserva o histórico. O registro fica fora dos indicadores até ser validado novamente.
_Avoid_: Aprovação (reservada a compras e Governança)

**Diário de atividades**:
Relato sobre um dia de trabalho no projeto, escrito e alterado apenas pelo próprio Membro. Capitão e Gestor veem a última versão enviada e seu histórico. Rascunhos e alterações em andamento ficam privados até o envio. Capitão e Gestor podem validar com comentário opcional, devolver com motivo ou reabrir um Diário validado para correção.
_Avoid_: Atividade (o item do Kanban)

**Participação**:
Situação de um Usuário em um Evento: Prevista, Presente, Ausente ou Justificada. Competições e Eventos define quem pode registrá-la no Evento. Pessoas e Participação mantém o registro, a validação e o histórico. Prevista indica planejamento e permanece até o responsável confirmar a situação, inclusive após o fim do Evento. Somente situações finais validadas entram nos indicadores de Participação.
_Avoid_: Presença, Inscrição

**Observação**:
Registro cotidiano sobre um Integrante. Capitão e Gestor podem publicá-lo para qualquer Integrante da equipe. Líder pode publicá-lo para Integrantes do próprio Subsistema. A Observação é visível ao Integrante citado, ao Líder do Subsistema de referência, ao Capitão e aos Gestores.

**Ocorrência**:
Relato confidencial de um fato sobre um Integrante. O Líder pode encaminhar uma Ocorrência de seu Subsistema. Capitão e Gestores podem consultá-la.

**Advertência**:
Medida administrativa formal, sempre motivada, que só Capitão ou Gestor pode emitir e comunicar. Pode estar vinculada a uma Ocorrência. Depois da comunicação pelo ERP, o Integrante pode consultar o texto formal e confirmar ciência. A confirmação registra conhecimento do conteúdo, sem implicar concordância. Capitão ou Gestor pode revogar a Advertência com justificativa. O texto comunicado continua consultável pelo próprio Integrante como Revogado. O vínculo com a Ocorrência e as notas internas permanecem confidenciais.

**Registro confidencial**:
Registro sobre um Integrante de nível administrativo confidencial, legível só pelo Gestor e pelo Capitão. O Líder pode encaminhar uma Ocorrência do próprio Subsistema e recebe confirmação de envio, sem acesso posterior ao relato.

### Documentação

**Documento**:
Arquivo guardado no Google Drive e cadastrado no ERP com uma Categoria de documento e um Nível de confidencialidade.
_Avoid_: Anexo

**Categoria de documento**:
Classificação temática de um Documento, independente do Nível de confidencialidade. Capitão e Gestor podem criar e renomear Categorias; os demais Perfis escolhem entre as existentes.

**Nível de confidencialidade**:
Regra de leitura de um Documento e de suas Versões. Comum de equipe é visível a todos os perfis ativos. Comum restrito a Subsistemas é visível ao Capitão, aos Gestores e aos Integrantes dos Subsistemas indicados. Administrativo confidencial é visível ao Capitão e aos Gestores. Financeiro confidencial é visível ao Capitão e ao Gestor Financeiro.

**Versão de documento**:
Estado do conteúdo de um Documento em determinado momento. O histórico reúne as Versões disponibilizadas pelo Google Drive e as já registradas no ERP, mesmo quando não for mais possível baixar uma delas. As Versões seguem o Nível de confidencialidade do Documento.
_Avoid_: Revisão (reservada a Solicitações de compra)

**Associação**:
Ligação de um Documento a um Subsistema, Atividade, Evento ou Compra para facilitar sua localização; nunca concede acesso ao Documento.

**Solicitação de exclusão**:
Pedido de um Líder para excluir um Documento, analisado e executado por um Gestor ou pelo Capitão.

### Competições e Eventos

**Evento**:
Compromisso agendado da equipe; é uma Reunião, uma Competição ou um evento geral, como palestras e apresentações.

**Reunião**:
Evento de alinhamento. Nas Reuniões semanais de Subsistemas, cada Líder registra a Participação dos Integrantes do próprio Subsistema, inclusive em Reuniões conjuntas. Nas Reuniões dos Gestores, o Gestor responsável registra a Participação. Nas Reuniões avulsas, Capitão ou Gestor designa quem registra a Participação.

**Competição**:
Evento Baja SAE do qual a equipe participa, com edição, desafio técnico, modelo do veículo, Inscrições e Resultados.

**Inscrição**:
Registro de um Integrante em uma Competição, nas situações Pendente, Confirmada ou Cancelada. A Inscrição confirmada sugere o Integrante para a chamada. A Participação efetiva é apurada no Evento.

**Resultado**:
Registro de desempenho em uma prova, categoria ou modalidade de uma **Competição**, com pelo menos um dado entre posição, pontuação e descrição.

**Logística**:
Arranjos operacionais de um Evento (inscrição, transporte, hospedagem, alimentação), sempre sem valores; os valores ficam no Financeiro.

**Auxílio**:
Apoio recebido para um Evento (por exemplo, da UTFPR), registrado na Logística sem valor e sem gerar Entrada automaticamente.

### Governança

**Documento de governança**:
Documento oficial da equipe, como regimento interno, normas e diretrizes, cujo conteúdo e versões são mantidos no próprio ERP.
_Avoid_: Documento (o arquivo do Drive)

**Versão de governança**:
Conteúdo versionado de um **Documento de governança**, em Rascunho ou Publicada. Só o Capitão pode publicar e definir a **Vigência**. O conteúdo publicado é imutável e correções exigem uma nova versão.

**Pronto para publicação**:
Marcação de que o conteúdo de um Rascunho está preparado para revisão final pelo Capitão. Uma alteração no conteúdo retira a marcação.

**Vigência**:
Período em que uma **Versão de governança** publicada vale como norma da equipe. A publicação torna o conteúdo disponível para leitura e a vigência pode começar naquele momento ou em data futura.

**Ciência e aceite**:
Confirmações do **Usuário** para uma **Versão de governança** publicada. Ciência registra que ele conhece o conteúdo. Aceite registra sua concordância. As duas confirmações podem ocorrer juntas ou em momentos diferentes.

### Auditoria

**Registro de auditoria**:
Anotação de quem fez uma operação auditável, quando e sobre qual registro, sem guardar senhas; é o único histórico das Transferências de integrante e das Trocas de Perfil.
_Avoid_: Log, histórico (genérico)

**Escopo de auditoria**:
Subsistemas de origem e destino registrados no momento de uma operação. Capitão e Gestor consultam o histórico do módulo; Líder consulta somente eventos que incluem seu Subsistema atual. Registros antigos sem escopo ficam restritos ao Capitão e ao Gestor.

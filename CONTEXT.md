# ProcoBaja ERP

Sistema interno de gestão do PROCOBAJA, equipe Baja SAE da UTFPR Câmpus Cornélio Procópio. Reúne em um só lugar a equipe, as atividades, as finanças, a participação dos integrantes, os documentos, os eventos e a governança.

## Language

### Equipe

**PROCOBAJA**:
A equipe de extensão da UTFPR-CP que projeta e constrói veículos off-road para as competições Baja SAE; é a única organização que usa o ERP.

**Usuário**:
Conta de acesso ao ERP, identificada pelo RA, com exatamente um Perfil e ativa ou desativada; nunca é excluída. O próprio Usuário só muda sua senha; Nome e RA são corrigidos pelo Capitão ou, nos Perfis que administra, pelo Gestor.
_Avoid_: Conta UTFPR, login

**RA**:
Identificador de login do Usuário, usado com uma senha própria do ERP e sem as credenciais institucionais: o Registro Acadêmico do aluno na UTFPR ou, para o Orientador, o SIAPE. Só o próprio Usuário, o Capitão e o Gestor o veem.

**Senha provisória**:
Senha gerada pelo ERP ao cadastrar um Usuário ou redefinir sua senha, mostrada uma única vez a quem fez a operação.

**Integrante**:
Pessoa que faz parte da equipe. Pertence a um Subsistema, com duas exceções: o Capitão nunca pertence a nenhum, porque atua em todos, e o Orientador pode pertencer ou não, só para fins de informação.
_Avoid_: Membro (para qualquer pessoa da equipe: Membro é um Perfil)

**Perfil**:
Papel de acesso de um Usuário, que define o que ele pode ver e fazer; são seis, cada um com permissões fixas, e cada Usuário tem um só por vez.
_Avoid_: Cargo, função, role

**Troca de Perfil**:
Mudança do Perfil de um Usuário; é o que o Documento de Projeto chama de alterar cargo e permissões. Ninguém passa a ser Líder nem deixa de ser Líder por Troca de Perfil, só por Definição de Líder, e ninguém troca o próprio Perfil.
_Avoid_: Alterar cargo, alterar permissões

**Capitão/Administrador**:
Perfil com administração geral da equipe e do ERP; único que mantém Vínculos Financeiro–Gestor, publica Governança e aprova compras junto ao Financeiro. A equipe tem sempre pelo menos um Capitão ativo e pode ter vários. Não pertence a nenhum Subsistema, porque atua em todos: quem passa a Capitão deixa o seu. Na forma curta, "Capitão".
_Avoid_: Admin

**Gestor**:
Perfil que administra Integrantes, Subsistemas, Sprints e Validações, sem nenhum acesso a Informação financeira restrita; entre os Usuários, administra só os de Perfil Financeiro, Líder, Membro e Orientador.

**Financeiro**:
Perfil responsável pelo caixa, pelas compras e pela previsão financeira, e que aprova compras junto ao Capitão; pode haver vários, cada um com Vínculo a um único Gestor. Só fica ativo com Vínculo: quando um Gestor cadastra alguém como Financeiro ou o troca para esse Perfil, a conta fica desativada até que o Capitão defina o Vínculo.
_Avoid_: Gestor Financeiro

**Líder**:
Perfil de quem lidera um Subsistema; ter o Perfil Líder e liderar um Subsistema são a mesma coisa. Gerencia as Atividades do Subsistema e registra presença e participação dos seus Integrantes.

**Definição de Líder**:
Escolha do Líder de um Subsistema entre os Membros ativos; quem vem de outro Subsistema é transferido na mesma operação. O escolhido passa ao Perfil Líder, e o Líder anterior, se houver, volta a Membro no mesmo Subsistema. Fora a Desativação do Subsistema, um Líder só sai dele, é desativado ou troca de Perfil depois de ser substituído.
_Avoid_: Promoção

**Membro**:
Perfil do Integrante que executa Atividades, escreve seu Diário de atividades e pode abrir Solicitações de compra.

**Orientador**:
Perfil do professor que acompanha o projeto com acesso às informações não confidenciais disponibilizadas ao seu perfil; no módulo de Documentação, pode enviar arquivos conforme as permissões previstas.

**Subsistema**:
Divisão interna da equipe, técnica ou administrativa, coordenada por um Líder que também é seu Integrante; cada Integrante pertence a no máximo um por vez. Nasce desativado e sem Líder, já podendo receber Integrantes, e se ativa ao ganhar o primeiro Líder. Nunca é excluído: ao ser desativado, seus Integrantes vão para outro Subsistema, e o Líder vai como Membro.
_Avoid_: Setor, área, módulo

**Composição**:
Lista dos Integrantes de um Subsistema, com seu Líder. Capitão, Gestor, Financeiro e Orientador veem a de todos os Subsistemas; Líder e Membro, só a do próprio. Já os nomes dos Subsistemas ativos e de seus Líderes são visíveis a todos.

**Desativação**:
Retirada de um Usuário ou de um Subsistema de uso, preservando seu histórico; Usuário desativado não acessa o ERP. É a única forma de retirada, porque o ERP não exclui Usuários nem Subsistemas. A Reativação a desfaz e exige a mesma permissão; ninguém desativa a si mesmo.
_Avoid_: Exclusão, remoção

**Módulo**:
Área funcional do ERP (Equipe, Atividades, Financeiro, Pessoas, Documentação, Eventos, Governança, Dashboard); um Módulo atende vários Subsistemas.
_Avoid_: Subsistema

**Vínculo Financeiro–Gestor**:
Associação organizacional de um Financeiro a um único Gestor, mantida somente pelo Capitão; não dá ao Gestor acesso financeiro algum. Deixa de existir quando o Financeiro troca de Perfil e continua se ele for desativado. Um Gestor com Vínculos só troca de Perfil ou é desativado depois que o Capitão transfere esses Vínculos a outro Gestor. Remover o Vínculo de um Financeiro ativo o desativa.

**Transferência de integrante**:
Mudança de um Integrante de um Subsistema para outro.

### Atividades e Sprints

**Sprint**:
Ciclo de trabalho da equipe PROCOBAJA, com duração prevista de 15 dias.
_Avoid_: usar "sprint" para os ciclos de duas semanas do desenvolvimento do ERP (chame-os de "sprint de desenvolvimento")

**Atividade**:
Trabalho da equipe com um ou mais Responsáveis e um ou mais Subsistemas, que está no Backlog ou alocado em uma Sprint.
_Avoid_: Tarefa, task, card

**Backlog**:
Conjunto das Atividades que não estão alocadas em nenhuma Sprint aberta.

**Responsável**:
Usuário designado para executar uma Atividade ou conduzir um Evento; pode ser de outro Subsistema.

**Estado da atividade**:
Situação de uma Atividade no quadro Kanban: Não iniciada, Não concluída, Em andamento, Concluída ou Pausada.

**Estimativa de esforço**:
Tamanho previsto de uma Atividade, expresso em um valor da sequência de Fibonacci.
_Avoid_: Story points, horas

**Alocação**:
Passagem de uma Atividade por uma Sprint; uma Atividade tem no máximo uma Alocação aberta.

**Transferência de atividade**:
Encerramento da Alocação de uma Atividade não concluída e sua abertura em uma Sprint posterior, preservando a Sprint de origem.
_Avoid_: Mover, reabrir

**Alerta de meia sprint**:
Aviso emitido quando cerca de metade da Sprint passou, destacando Atividades com pouco progresso e Atividades transferidas.

### Financeiro

**Informação financeira restrita**:
Preços, Orçamentos, Movimentações, saldos, gastos e Previsões; só o Capitão e o Financeiro a veem, e o Solicitante vê apenas os preços e Orçamentos das próprias Solicitações enquanto estão em andamento.
_Avoid_: Dado sensível (genérico)

**Solicitação de compra**:
Pedido de aquisição aberto por um Integrante, que percorre os Status da compra até ser paga, reprovada ou cancelada.
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
Proposta de preço de um Fornecedor para uma Revisão; cada Revisão enviada precisa de pelo menos três.
_Avoid_: Cotação

**Fornecedor**:
Empresa ou loja que fornece Orçamentos e vende os itens comprados.

**Status da compra**:
Situação de uma Solicitação de compra: Planejada (compra futura ainda não enviada), Aguardando aprovação, Aprovada, Reprovada, Realizada/Paga ou Cancelada.

**Aprovação conjunta**:
Exigência de que o Capitão e o Financeiro aprovem a mesma Revisão; qualquer reprovação precisa de justificativa.

**Compra**:
Execução de uma Solicitação de compra aprovada, usando um Orçamento da Revisão aprovada.

**Pagamento**:
Ato de marcar uma Compra como Realizada/Paga, que gera exatamente uma Saída ativa.

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
Situação de um Integrante em um turno de um dia (Presente, Ausente ou Justificada), registrada pelo Líder; o horário de referência é das 18h às 22h.
_Avoid_: Participação (reservada a Eventos)

**Carga horária**:
Horas trabalhadas por um Integrante, derivadas dos horários de início e fim dos Registros de presença.

**Frequência**:
Indicador de assiduidade calculado somente a partir de Registros de presença validados.

**Validação**:
Confirmação, pelo Gestor ou pelo Capitão, de um Registro de presença ou de um Diário de atividades.
_Avoid_: Aprovação (reservada a compras e Governança)

**Diário de atividades**:
Relato escrito pelo próprio Membro sobre o que fez em um dia de trabalho no projeto.
_Avoid_: Atividade (o item do Kanban)

**Participação**:
Situação de um Usuário em um Evento: Prevista, Presente, Ausente ou Justificada.
_Avoid_: Presença, Inscrição

**Observação**:
Registro cotidiano sobre um Integrante, como a justificativa de uma ausência, visível aos envolvidos.

**Ocorrência** e **Advertência**:
Registros administrativos sobre a conduta de um Integrante, em geral confidenciais.

**Registro confidencial**:
Registro sobre um Integrante de nível administrativo confidencial, legível só pelo Gestor e pelo Capitão; o Líder pode criá-lo, mas não pode consultá-lo depois.

### Documentação

**Documento**:
Arquivo guardado no Google Drive e cadastrado no ERP com uma Categoria de documento e um Nível de confidencialidade.
_Avoid_: Anexo

**Categoria de documento**:
Classificação temática de um Documento, independente do Nível de confidencialidade.

**Nível de confidencialidade**:
Regra de leitura de um Documento: Comum (todos), Administrativo confidencial (Capitão e Gestor) ou Financeiro confidencial (Capitão e Financeiro).

**Versão de documento**:
Estado anterior de um Documento, conforme o histórico do Google Drive, inclusive de arquivos anteriores ao ERP.
_Avoid_: Revisão (reservada a Solicitações de compra)

**Associação**:
Ligação de um Documento a um Subsistema, Atividade, Evento ou Compra para facilitar sua localização; nunca concede acesso ao Documento.

**Solicitação de exclusão**:
Pedido de um Líder para excluir um Documento, analisado e executado por um Gestor ou pelo Capitão.

### Competições e Eventos

**Evento**:
Compromisso agendado da equipe; é uma Reunião, uma Competição ou um evento geral, como palestras e apresentações.

**Reunião**:
Evento de alinhamento de um ou mais Subsistemas; na Reunião semanal de um Subsistema, a Participação é registrada pelo seu Líder.

**Competição**:
Evento Baja SAE do qual a equipe participa, com edição, desafio técnico, modelo do veículo, Inscrições e Resultados.

**Inscrição**:
Registro de um Integrante em uma Competição; não implica Participação efetiva.

**Resultado**:
Posição ou pontuação obtida em uma prova ou modalidade de uma Competição.

**Logística**:
Arranjos operacionais de um Evento (inscrição, transporte, hospedagem, alimentação), sempre sem valores; os valores ficam no Financeiro.

**Auxílio**:
Apoio recebido para um Evento (por exemplo, da UTFPR), registrado na Logística sem valor e sem gerar Entrada automaticamente.

### Governança

**Documento de governança**:
Documento oficial da equipe, como regimento interno, normas e diretrizes, cujo conteúdo e versões são mantidos no próprio ERP.
_Avoid_: Documento (o arquivo do Drive)

**Versão de governança**:
Conteúdo de um Documento de governança em Rascunho ou Publicada; só o Capitão publica, e a versão publicada não muda mais.

**Ciência e aceite**:
Confirmação de um Usuário de que conhece e aceita uma Versão de governança publicada.

### Auditoria

**Registro de auditoria**:
Anotação de quem fez uma operação auditável, quando e sobre qual registro, sem guardar senhas; é o único histórico das Transferências de integrante e das Trocas de Perfil.
_Avoid_: Log, histórico (genérico)

## Ambiguidades em aberto

**Não concluída × Não iniciada**:
O Documento de Projeto lista "Não concluída" como Estado da atividade, mas não diz quando uma Atividade entra nele nem como ele difere de "Não iniciada" e "Pausada".

**Documento financeiro confidencial × acesso do Gestor**:
A tabela de permissões de Documentação menciona uma possível permissão específica para acesso do Gestor, enquanto as regras financeiras gerais restringem seu acesso a informações financeiras. O PDF não define a exceção; consulte `docs/projeto/modulos/documentacao.md` e valide com a equipe antes de conceder acesso.

**Ocorrência × Advertência**:
O Documento de Projeto não define o que diferencia uma Ocorrência de uma Advertência.

**Presença do Capitão**:
O Líder registra a presença dos Integrantes do seu Subsistema, e o Capitão não pertence a nenhum; não está definido se a presença do Capitão é registrada, nem por quem.

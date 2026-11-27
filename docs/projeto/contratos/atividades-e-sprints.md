# Contrato da API · Atividades e Sprints (Módulo 02)

Contrato compartilhado entre backend e frontend para o Módulo 02 (**Atividades e Sprints**), referente à issue `#58` (`[M02-01]`) e às entregas dependentes (`#69`, `#95`, `#96`, `#140`, `#157`, `#70`, `#97`, `#98`, `#141`, `#158`, `#169` e `#175` no Dashboard).

- **Referências:** [Guia do módulo](../modulos/atividades-e-sprints.md) · [Dashboard e Indicadores](../modulos/dashboard-e-indicadores.md) · [Guia de modelagem](../modelagem.md) · [Vocabulário do domínio](../../../CONTEXT.md) · [Arquitetura do backend](../../../backend/ARCHITECTURE.md)
- **Limite de escopo de banco:** o contrato usa integralmente o esquema vigente na `develop` (`DBML v6`, migrações Flyway `V1` a `V11`), sem criar nem alterar tabelas, colunas, índices ou restrições.
- **Decisão de autorização:** como as migrações `V1` a `V11` não semeiam códigos do Módulo 02 na tabela `permissoes`, a autorização das rotas e dos comandos valida o `Perfil` do `UsuarioAutenticado` e o escopo contextual (Subsistema, exclusividade e vínculo de Responsável) diretamente no backend. O `GESTOR` com `gestorFinanceiro: true` conserva exatamente as mesmas permissões do `GESTOR` neste módulo.

---

## 1. Sessão, CSRF, formatos e convenções

- **Autenticação e sessão:** sessão no servidor via cookie `JSESSIONID` (`HttpOnly`), enviada com `credentials: "same-origin"` ([ADR 0001](../../adr/0001-sessao-no-servidor.md)).
- **Proteção CSRF:** todas as requisições que alteram estado (`POST`, `PUT`, `DELETE`) exigem o token obtido em `GET /api/auth/csrf` (cookie `XSRF-TOKEN`) reenviado no cabeçalho `X-XSRF-TOKEN`.
- **Bloqueio por Senha provisória:** qualquer rota de `/api/atividades/**` ou `/api/sprints/**` retorna `403 Forbidden` (via `TrocaDeSenhaPendenteHandler`) enquanto `trocaDeSenhaPendente` for `true`.
- **Sessão ausente ou expirada:** retorna `401 Unauthorized`.
- **Identificadores e campos:** IDs numéricos (`number` / `Long`), propriedades JSON em `camelCase`, `Content-Type: application/json`.
- **Datas e fuso horário:**
  - Datas civis (`LocalDate`): formato ISO-8601 `AAAA-MM-DD` (`inicio`, `fim`, `prazo`, `dataInicioAlertaPoucoProgresso`).
  - Instantes (`OffsetDateTime` / `timestamptz`): formato ISO-8601 com offset/UTC (ex.: `"2026-11-08T14:30:00Z"`).
  - Toda regra de calendário, comparação com "hoje" e virada do dia usa o fuso **`America/Sao_Paulo`**.
- **Referências curtas reutilizadas:**
  - `Resumo`: `{ "id": number, "nome": string }`
  - `ResponsavelResumo`: `{ "id": number, "nome": string, "ativo": boolean, "subsistema": Resumo | null }`
  - `SubsistemaAtividadeResumo`: `{ "id": number, "nome": string, "ativo": boolean }`
  - `SprintResumo`: `{ "id": number, "nome": string, "inicio": "AAAA-MM-DD", "fim": "AAAA-MM-DD", "situacao": SituacaoSprint }`

---

## 2. Domínios e enums

| Tipo | Valores aceitos / expostos | Observações |
|---|---|---|
| `EstadoAtividade` | `NAO_INICIADA`, `EM_ANDAMENTO`, `PAUSADA`, `CONCLUIDA` | Estado de trabalho atual da Atividade (`atividades.status`). **`NAO_CONCLUIDA` não é aceita** em criação, edição nem transição de trabalho. |
| `PrioridadeAtividade` | `BAIXA`, `MEDIA`, `ALTA`, `URGENTE` | Padrão na criação quando omitida: `MEDIA`. |
| `EstimativaFibonacci` | `1`, `2`, `3`, `5`, `8`, `13`, `21` (ou `null` no Backlog) | Qualquer outro número inteiro retorna `422 Unprocessable Content`. |
| `SituacaoSprint` | `PLANEJADA`, `EM_ANDAMENTO`, `ENCERRADA` | Derivada de `iniciada_em` e `encerrada_em`. |
| `OrigemAlocacao` | `INICIAL`, `TRANSFERENCIA` | `INICIAL` na alocação manual; `TRANSFERENCIA` ao mover no encerramento ou na retirada com destino `SPRINT`. |
| `DesfechoAlocacao` | `ALOCADA`, `CONCLUIDA`, `NAO_CONCLUIDA`, `RETIRADA` | Resultado da passagem na Sprint: `ALOCADA` enquanto `saida_em == null`; `RETIRADA` quando `retirada_antes_encerramento == true`; `CONCLUIDA` ou `NAO_CONCLUIDA` conforme `estado_no_encerramento` após fechamento. |
| `TipoDestinoAlocacao` | `BACKLOG`, `SPRINT` | Usado em retirada antecipada e no encerramento de Sprint. |
| `RequisitoAlocacaoPendente` | `PRAZO`, `ESTIMATIVA`, `RESPONSAVEL_ATIVO` | Lista os requisitos ausentes que impedem alocar a Atividade em uma Sprint. |
| `TipoAlertaAtividade` | `POUCO_PROGRESSO`, `ATRASADA`, `TRANSFERIDA`, `SEM_RESPONSAVEL_ATIVO` | Filtro opcional em `GET /api/atividades` e `GET /api/atividades/quadro`. |

---

## 3. Visibilidade, permissões e capacidades (`capacidades`)

O servidor filtra os dados, rejeita operações não autorizadas e devolve objetos `capacidades` para orientar a interface sem duplicar regra de negócio no cliente.

### 3.1 Matriz de acesso por Perfil

| Ação / Consulta | `CAPITAO_ADMIN` | `GESTOR` (inclui Gestor Financeiro) | `LIDER` | `MEMBRO` | `ORIENTADOR` |
|---|---|---|---|---|---|
| **Ler Atividades, Backlog, Quadro, detalhe e históricos** | Todas (inclusive Subsistemas inativos) | Todas (inclusive Subsistemas inativos) | Próprio Subsistema (ativo/inativo), outros Subsistemas ativos e Atividades em que é Responsável | Próprio Subsistema (ativo/inativo) e Atividades em que é Responsável (inclusive compartilhadas ou de outros Subsistemas) | Somente Atividades vinculadas a **ao menos um Subsistema ativo** |
| **Ler Sprints e resultado histórico** | Todas | Todas | Todas (passagens filtradas ao escopo de leitura da Atividade) | Todas (passagens filtradas ao escopo de leitura da Atividade) | Todas (passagens filtradas ao escopo de leitura da Atividade) |
| **Criar Atividade** | Qualquer Subsistema ou compartilhada | Qualquer Subsistema ou compartilhada | Exclusiva do próprio Subsistema (ativo) | Não | Não |
| **Editar planejamento** (título, descrição, prioridade, prazo, estimativa, Subsistemas, Responsáveis) | Qualquer Atividade não arquivada | Qualquer Atividade não arquivada | Apenas Atividade não arquivada **exclusiva do próprio Subsistema** | Não | Não |
| **Arquivar Atividade** | Qualquer Atividade (inclusive alocada; fecha alocação aberta na mesma transação) | Qualquer Atividade (inclusive alocada; fecha alocação aberta na mesma transação) | Apenas Atividade **exclusiva do próprio Subsistema** que esteja no **Backlog** | Não | Não |
| **Atualizar andamento** (`NAO_INICIADA` → `EM_ANDAMENTO` ↔ `PAUSADA` → `CONCLUIDA`) | Qualquer Atividade não arquivada | Qualquer Atividade não arquivada | Atividade não arquivada em que o próprio Subsistema participa **ou** em que é Responsável | Apenas Atividade não arquivada em que é **Responsável** | Não |
| **Reabrir Atividade `CONCLUIDA`** (exige motivo; volta para `EM_ANDAMENTO`) | Qualquer Atividade não arquivada | Qualquer Atividade não arquivada | Apenas Atividade não arquivada **exclusiva do próprio Subsistema** | Não | Não |
| **Planejar, editar, iniciar, alocar, retirar e encerrar Sprints** | Sim | Sim | Não | Não | Não |

**Regras adicionais de visibilidade e consistência:**

1. **Atividades arquivadas:** ficam fora das listagens ativas (`GET /api/atividades` por padrão, `GET /api/atividades/backlog` e `GET /api/atividades/quadro`). Podem ser consultadas explicitamente com `incluirArquivadas=true` ou `apenasArquivadas=true` e diretamente por `GET /api/atividades/{id}` (dentro do escopo de leitura do Perfil).
2. **Consulta direta fora do escopo:** se uma Atividade existir, mas nenhum Subsistema nem Responsável dela estiver no escopo de leitura do usuário (por exemplo, `MEMBRO` consultando Atividade de outro Subsistema sem ser Responsável, ou `ORIENTADOR` consultando Atividade apenas de Subsistema inativo), `GET /api/atividades/{id}` e `/historico` respondem `404 Not Found`. Se o usuário pode **ler** a Atividade mas não pode executar um **comando** sobre ela, o comando responde `403 Forbidden`.
3. **Múltiplos Subsistemas e Responsáveis:** toda Atividade exige pelo menos `1` Subsistema desde a criação. Pode ter `0` ou mais Responsáveis no Backlog, inclusive de outros Subsistemas; ao ser alocada em Sprint, precisa de ao menos `1` Responsável com `ativo == true`.
4. **Edição de planejamento de Atividade alocada:** se a Atividade já possui Alocação aberta (`PLANEJADA` ou `EM_ANDAMENTO`), uma edição (`PUT /api/atividades/{id}`) **não** pode remover `prazo`, `estimativaFibonacci` nem o último Responsável ativo (responde `422`).
5. **Gestor Financeiro:** usa o `Perfil` `GESTOR` com `gestorFinanceiro: true`; mantém exatamente todas as permissões de `GESTOR` deste módulo.

### 3.2 Objetos `capacidades`

- **`CapacidadesModulo`** (retornado em `GET /api/atividades/opcoes` e `GET /api/atividades/quadro`):
  - `podeCriarAtividade: boolean`
  - `podeCriarAtividadeCompartilhada: boolean`
  - `podeGerenciarSprints: boolean`
- **`CapacidadesAtividade`** (em cada item/detalhe de Atividade):
  - `podeEditarPlanejamento: boolean`
  - `podeArquivar: boolean`
  - `podeAlterarAndamento: boolean`
  - `transicoesDisponiveis: EstadoAtividade[]` (apenas os destinos válidos no estado atual quando `podeAlterarAndamento == true`, ex.: `["PAUSADA", "CONCLUIDA"]`; vazio caso contrário)
  - `podeReabrir: boolean`
  - `podeAlocar: boolean` (`true` apenas para Capitão/Gestor quando a Atividade não está arquivada, não tem Alocação aberta e `requisitosAlocacaoPendentes` está vazio)
  - `requisitosAlocacaoPendentes: RequisitoAlocacaoPendente[]`
  - `podeRetirarDaSprint: boolean` (`true` para Capitão/Gestor quando há Alocação aberta em Sprint `PLANEJADA` ou `EM_ANDAMENTO` e `status != CONCLUIDA`)
- **`CapacidadesSprint`** (em cada item/detalhe de Sprint):
  - `podeEditar: boolean` (`true` para Capitão/Gestor enquanto `situacao != ENCERRADA`)
  - `podeIniciar: boolean` (`true` para Capitão/Gestor quando `situacao == PLANEJADA` e não há outra Sprint `EM_ANDAMENTO`)
  - `motivoBloqueioInicio: string | null` (explicação quando `situacao == PLANEJADA` e já existe outra Sprint `EM_ANDAMENTO`; `null` nos demais casos)
  - `podeAlocarAtividades: boolean` (`true` para Capitão/Gestor quando `situacao != ENCERRADA`)
  - `podeEncerrar: boolean` (`true` para Capitão/Gestor quando `situacao == EM_ANDAMENTO`)

---

## 4. Regras de alertas, indicações e calendário (`America/Sao_Paulo`)

Todas as regras abaixo são calculadas no servidor usando a data civil corrente `hoje` em `America/Sao_Paulo`:

1. **Metade da Sprint:**
   - Seja $D = \text{diasInclusivos}(\text{inicio}, \text{fim}) = (\text{fim} - \text{inicio}) + 1$.
   - A data que marca o início da segunda metade é `dataInicioAlertaPoucoProgresso = inicio.plusDays(D / 2)` (divisão inteira).
   - Exemplo: Sprint de `2026-11-01` a `2026-11-15` possui $D = 15$ dias; $15 / 2 = 7$; logo `dataInicioAlertaPoucoProgresso = 2026-11-08` (dia 8 da Sprint, contando o dia central na segunda metade).
   - Exemplo: Sprint de `2026-11-01` a `2026-11-14` possui $D = 14$ dias; $14 / 2 = 7$; logo `dataInicioAlertaPoucoProgresso = 2026-11-08`.
2. **Objeto `alertas` na Sprint:**
   - `dataInicioAlertaPoucoProgresso: "AAAA-MM-DD"`
   - `segundaMetadeAtingida: boolean` — `true` se `situacao == EM_ANDAMENTO` e `hoje >= dataInicioAlertaPoucoProgresso`.
   - `dataFinalAtingida: boolean` — `true` se `situacao == EM_ANDAMENTO` e `hoje >= fim` (sinaliza na data final que o prazo chegou; a Sprint continua `EM_ANDAMENTO` até confirmação manual).
3. **Objeto `alertas` na Atividade (4 sinais independentes que podem coexistir):**
   - `poucoProgresso: boolean` — `true` se a Atividade não está arquivada, está alocada na Sprint `EM_ANDAMENTO`, seu `status` atual é `NAO_INICIADA` ou `PAUSADA`, e `hoje >= dataInicioAlertaPoucoProgresso` da Sprint atual.
   - `atrasada: boolean` — `true` se a Atividade não está arquivada, `status == EM_ANDAMENTO`, `prazo != null` e `hoje > prazo` (a partir do dia seguinte ao prazo, inclusive quando chega atrasada por transferência).
   - `transferida: boolean` — `true` se a Atividade possui ao menos uma passagem com `origem == TRANSFERENCIA` (`quantidadeTransferencias > 0`).
   - `semResponsavelAtivo: boolean` — `true` se a Atividade não está arquivada, possui Alocação aberta (`alocacaoAtual != null`) e nenhum usuário em `responsaveis` está `ativo == true`. A perda do último Responsável ativo (por desativação de usuário ou remoção equivalente) **preserva a Alocação aberta** e ativa este alerta.

---

## 5. Modelo de erros (`ProblemDetail` · RFC 9457)

Todas as respostas de erro seguem o padrão do `TratadorDeErros` e das exceções em `com.procobajaerp.backend.shared`, sempre com `status` e `detail` em português:

| Status HTTP | Quando usar | Campos extras no `ProblemDetail` |
|---|---|---|
| `400 Bad Request` | Erro de formato JSON, tipo de parâmetro inválido ou falha de `Bean Validation` (`@NotBlank`, `@NotNull`, `@Size`, `@Positive`). | `erros: { [campo]: mensagem }` |
| `401 Unauthorized` | Sessão ausente ou expirada. | — |
| `403 Forbidden` | Perfil/contexto sem permissão sobre a operação ou registro visível, ou usuário com `trocaDeSenhaPendente == true`. | — |
| `404 Not Found` | Sprint, Atividade, Subsistema ou Usuário inexistente, ou registro fora do escopo de leitura do usuário. | — |
| `409 Conflict` | Conflito de estado ou concorrência: segunda Sprint `EM_ANDAMENTO` (`ux_sprint_em_andamento`), Atividade já alocada (`ux_atividades_sprints_uma_aberta`), comando sobre Atividade arquivada, transição incompatível com o estado atual, retirada de Atividade já `CONCLUIDA`, encerramento de Sprint que não está `EM_ANDAMENTO` ou conflito concorrente no fechamento. | Opcionalmente `sprintEmAndamentoId`, `alocacaoAtualId` ou `codigo` |
| `422 Unprocessable Content` | Violação de regra de negócio ou pré-requisito: `estimativaFibonacci` fora de `{1,2,3,5,8,13,21}`, tentativa de definir `NAO_CONCLUIDA` como estado de trabalho, retirada de campo obrigatório em Atividade alocada, falta de requisitos de alocação, `fim < inicio`, `confirmacao != true`, ou destinos inválidos/incompletos no encerramento. | `erros` e, conforme o caso, `requisitosFaltantes: RequisitoAlocacaoPendente[]` ou `pendenciasInvalidas: [{ atividadeId, motivo }]` |

---

## 6. Catálogo de endpoints

### 6.1 Opções auxiliares do módulo

#### `GET /api/atividades/opcoes`
Retorna os metadados necessários para preencher filtros e formulários conforme o escopo do usuário autenticado.

- **Autorização:** qualquer usuário autenticado com senha definitiva.
- **Resposta `200 OK`:**
  - `capacidades: CapacidadesModulo`
  - `subsistemasDisponiveis: SubsistemaAtividadeResumo[]` (para criação/edição: todos para Capitão/Gestor; apenas o próprio para Líder; para filtros, todos os visíveis ao perfil)
  - `subsistemasFiltro: SubsistemaAtividadeResumo[]`
  - `responsaveisDisponiveis: ResponsavelResumo[]` (usuários ativos visíveis que podem ser atribuídos como Responsáveis)
  - `sprintsSelecionaveis: SprintResumo[]` (Sprints `EM_ANDAMENTO`, `PLANEJADA` e `ENCERRADA`)
  - `estimativasPermitidas: [1, 2, 3, 5, 8, 13, 21]`

---

### 6.2 Consultas e comandos de Atividades e Backlog (`#69`, `#95`, `#157`)

#### `GET /api/atividades`
Lista as Atividades visíveis ao usuário autenticado, com filtros combináveis via query string.

- **Query params (todos opcionais):**
  - `visao`: `TODAS` (padrão) | `BACKLOG` | `SPRINT`
  - `sprintId`: `number` (filtra Atividades com passagem na Sprint informada; quando `visao=SPRINT`, filtra pela Alocação aberta nessa Sprint)
  - `subsistemaId`: `number`
  - `responsavelId`: `number`
  - `apenasMinhas`: `boolean` (`true` retorna apenas onde o usuário autenticado é Responsável)
  - `status`: `NAO_INICIADA` | `EM_ANDAMENTO` | `PAUSADA` | `CONCLUIDA`
  - `prioridade`: `BAIXA` | `MEDIA` | `ALTA` | `URGENTE`
  - `alerta`: `POUCO_PROGRESSO` | `ATRASADA` | `TRANSFERIDA` | `SEM_RESPONSAVEL_ATIVO`
  - `busca`: `string` (busca case-insensitive em `titulo` e `descricao`)
  - `incluirArquivadas`: `boolean` (padrão `false`)
  - `apenasArquivadas`: `boolean` (padrão `false`; se `true`, sobrepõe `incluirArquivadas`)
- **Ordenação padrão:** prioridade decrescente (`URGENTE` → `ALTA` → `MEDIA` → `BAIXA`), depois prazo crescente (`null` por último), depois `id` decrescente.
- **Resposta `200 OK`:** `AtividadeResumo[]`

#### `GET /api/atividades/backlog`
Atalho semântico para Atividades não arquivadas sem Alocação aberta (`alocacaoAtual == null`), aplicando os mesmos filtros opcionais (`subsistemaId`, `responsavelId`, `apenasMinhas`, `status`, `prioridade`, `alerta`, `busca`) e ordenação de `GET /api/atividades`.

- **Resposta `200 OK`:** `AtividadeResumo[]`

#### `GET /api/atividades/quadro`
Retorna o Quadro Kanban autorizado para uma Sprint (por padrão, a Sprint `EM_ANDAMENTO`) e os dados estruturados consumíveis também pelo cartão do Dashboard (`#175` / `M08-09`).

- **Query params opcionais:** `sprintId`, `subsistemaId`, `responsavelId`, `apenasMinhas`, `prioridade`, `alerta`, `busca`.
- **Comportamento quando `sprintId` é omitido:** seleciona a Sprint `EM_ANDAMENTO`. Se não houver nenhuma Sprint em andamento, `sprint` retorna `null`, `colunas` retorna listas vazias e `sprintsSelecionaveis` traz as Sprints `PLANEJADA` e `ENCERRADA` disponíveis para seleção.
- **Comportamento quando `sprintId` aponta para uma Sprint `ENCERRADA`:** `sprint` traz a Sprint encerrada; `passagens` / cartões exibem o estado de trabalho atual acompanhado do `desfechoNaSprint` (`CONCLUIDA`, `NAO_CONCLUIDA` ou `RETIRADA`) para distinguir estado atual de resultado histórico.
- **Resposta `200 OK`:**
  - `sprint: SprintResumoDetalhado | null` (inclui `datas`, `alertas` da Sprint e `capacidades`)
  - `sprintsSelecionaveis: SprintResumo[]`
  - `capacidades: CapacidadesModulo`
  - `resumo: { total, naoIniciadas, emAndamento, pausadas, concluidas, poucoProgresso, atrasadas, transferidas, semResponsavelAtivo, concluidasNoEncerramento, naoConcluidasNoEncerramento, retiradas }`
  - `colunas`: `{ naoIniciada: AtividadeQuadroItem[], emAndamento: AtividadeQuadroItem[], pausada: AtividadeQuadroItem[], concluida: AtividadeQuadroItem[] }`

#### `GET /api/atividades/{id}`
Retorna o detalhe completo de uma Atividade visível ao usuário.

- **Resposta `200 OK`:** `AtividadeDetalhe` (contendo todos os campos de planejamento, `subsistemas`, `compartilhada`, `responsaveis`, `alocacaoAtual`, `quantidadeTransferencias`, `arquivamento`, `alertas`, `capacidades`, `criadaPor`, `criadaEm`, `atualizadaEm`, `concluidaEm`).
- **Erros:** `404` se não existir ou estiver fora do escopo de leitura.

#### `GET /api/atividades/{id}/historico`
Retorna os três históricos preservados da Atividade: mudanças de estado, mudanças de planejamento e cadeia de passagens em Sprints.

- **Resposta `200 OK`:**
  - `atividadeId: number`
  - `andamento: HistoricoAndamentoItem[]` (`id`, `statusAnterior`, `statusNovo`, `alteradoPor`, `alteradoEm`, `observacao`) — ordem cronológica decrescente.
  - `planejamento: HistoricoPlanejamentoItem[]` (`id`, `alteradoPor`, `alteradoEm`, `dadosAnteriores`, `dadosNovos`) — ordem cronológica decrescente.
  - `alocacoes: HistoricoAlocacaoItem[]` (`id`, `sprint`, `origem`, `transferidaDaAlocacaoId`, `entradaEm`, `saidaEm`, `desfecho`, `estadoNoEncerramento`, `retiradaAntesEncerramento`, `transferidaPor`, `encerradaPor`, `motivoTransferencia`) — ordem cronológica crescente da cadeia de passagens.
- **Erros:** `404` se a Atividade não existir ou estiver fora do escopo de leitura.

#### `POST /api/atividades`
Cria uma nova Atividade no Backlog (com estado inicial `NAO_INICIADA` gravado também como evento inicial em `historico_status_atividades`).

- **Autorização:** `CAPITAO_ADMIN`, `GESTOR`, ou `LIDER` (exclusivamente para `[seuSubsistemaId]` ativo).
- **Corpo (`CriarAtividadeRequisicao`):**
  - `titulo`: `string` obrigatório (`1..180` caracteres após `trim`)
  - `descricao`: `string | null` opcional
  - `prioridade`: `PrioridadeAtividade | null` opcional (padrão `MEDIA`)
  - `estimativaFibonacci`: `number | null` opcional (quando não nulo, deve estar em `{1, 2, 3, 5, 8, 13, 21}`)
  - `prazo`: `"AAAA-MM-DD" | null` opcional
  - `subsistemaIds`: `number[]` obrigatório, não vazio (sem duplicados; ao menos 1 Subsistema existente; para `LIDER`, deve conter exatamente `[subsistemaDoLider]`)
  - `responsavelIds`: `number[]` opcional (padrão `[]`; se informado, todos os IDs devem existir e ser usuários `ativo == true`)
- **Resposta `201 Created`:** `AtividadeDetalhe`
- **Erros:** `400` (campos obrigatórios/tamanho), `403` (Perfil sem permissão ou `LIDER` tentando criar para outro Subsistema / compartilhada), `404` (Subsistema ou Usuário inexistente), `422` (Fibonacci inválido, Subsistema do Líder inativo ou Responsável inativo).

#### `PUT /api/atividades/{id}`
Atualiza os dados de planejamento de uma Atividade não arquivada e grava em `historico_planejamento_atividades` quando houver mudança efetiva.

- **Autorização:** `CAPITAO_ADMIN`, `GESTOR`, ou `LIDER` (apenas se a Atividade for **exclusiva do próprio Subsistema** e não tentar torná-la compartilhada nem movê-la para outro Subsistema).
- **Corpo (`EditarAtividadeRequisicao`):** mesmos campos de `CriarAtividadeRequisicao` (`titulo`, `descricao`, `prioridade`, `estimativaFibonacci`, `prazo`, `subsistemaIds`, `responsavelIds`).
- **Regras:**
  - Se `alocacaoAtual != null`, continua exigindo `prazo != null`, `estimativaFibonacci != null` e ao menos um Responsável com `ativo == true` (caso contrário retorna `422` com `requisitosFaltantes`).
  - Se houver mudança em qualquer campo de planejamento (`titulo`, `descricao`, `prioridade`, `estimativaFibonacci`, `prazo`, `subsistemaIds`, `responsavelIds`), grava um registro em `historico_planejamento_atividades` com `dados_anteriores` e `dados_novos` em JSONB.
- **Resposta `200 OK`:** `AtividadeDetalhe`
- **Erros:** `400`, `403`, `404`, `409` (Atividade já arquivada), `422`.

#### `POST /api/atividades/{id}/arquivamento`
Arquiva uma Atividade, retirando-a das visões ativas e preservando todos os históricos.

- **Autorização:** `CAPITAO_ADMIN` ou `GESTOR` (qualquer Atividade); `LIDER` apenas para Atividade **exclusiva do próprio Subsistema** que esteja no **Backlog** (`alocacaoAtual == null`).
- **Corpo:** `{ "motivo": string }` (obrigatório, não vazio após `trim`).
- **Efeito em Atividade alocada (apenas Capitão/Gestor):** na mesma transação, encerra a Alocação aberta marcando `retirada_antes_encerramento = true`, `saida_em = now()`, `encerrada_por_usuario_id = atorId` e `motivo_transferencia = motivo` (respeitando `chk_alocacao_saida`), além de preencher `arquivada_em`, `arquivada_por_usuario_id` e `motivo_arquivamento`.
- **Resposta `200 OK`:** `AtividadeDetalhe`
- **Erros:** `400`, `403` (ex.: `LIDER` tentando arquivar Atividade alocada ou compartilhada), `404`, `409` (já arquivada).

#### `PUT /api/atividades/{id}/status`
Atualiza o estado de trabalho atual da Atividade e grava em `historico_status_atividades`.

- **Autorização:** `CAPITAO_ADMIN`, `GESTOR`, `LIDER` (se o próprio Subsistema participa da Atividade **ou** se for Responsável) e `MEMBRO` (se for Responsável).
- **Corpo:** `{ "status": EstadoAtividade, "observacao"?: string | null }`
- **Transições permitidas:**
  - `NAO_INICIADA` → `EM_ANDAMENTO` (iniciar)
  - `EM_ANDAMENTO` → `PAUSADA` (pausar)
  - `EM_ANDAMENTO` → `CONCLUIDA` (concluir; preenche `concluida_em = now()`)
  - `PAUSADA` → `EM_ANDAMENTO` (retomar)
  - `NAO_CONCLUIDA` é recusada com `422 Unprocessable Content`.
  - Transições fora do grafo acima (ex.: `NAO_INICIADA` → `CONCLUIDA`, `CONCLUIDA` → `PAUSADA`, ou repetir o estado atual) retornam `409 Conflict`.
- **Resposta `200 OK`:** `AtividadeDetalhe`
- **Erros:** `400`, `403`, `404`, `409` (transição incompatível ou Atividade arquivada), `422` (`NAO_CONCLUIDA` não é transição de trabalho).

#### `POST /api/atividades/{id}/reabertura`
Reabre uma Atividade `CONCLUIDA` para `EM_ANDAMENTO`, preservando `estado_no_encerramento` de todas as Sprints já encerradas.

- **Autorização:** `CAPITAO_ADMIN`, `GESTOR`, ou `LIDER` (exclusivamente se a Atividade for **exclusiva do próprio Subsistema**).
- **Corpo:** `{ "motivo": string }` (obrigatório, não vazio após `trim`; gravado em `historico_status_atividades.observacao`).
- **Efeito:** altera `atividades.status` para `EM_ANDAMENTO`, limpa `concluida_em` da Atividade (mantendo intactos `atividades_sprints.estado_no_encerramento` das Sprints encerradas) e registra `CONCLUIDA` → `EM_ANDAMENTO` em `historico_status_atividades`.
- **Resposta `200 OK`:** `AtividadeDetalhe`
- **Erros:** `400`, `403`, `404`, `409` (Atividade não está `CONCLUIDA` ou está arquivada).

---

### 6.3 Consultas e comandos de Sprints e Alocações (`#96`, `#140`, `#157`)

#### `GET /api/sprints`
Lista as Sprints da equipe.

- **Query params opcionais:** `situacao` (`PLANEJADA` | `EM_ANDAMENTO` | `ENCERRADA`).
- **Ordenação:** `EM_ANDAMENTO` primeiro, depois `PLANEJADA` (por `inicio` crescente), depois `ENCERRADA` (por `encerradaEm` decrescente).
- **Resposta `200 OK`:** `SprintResumoDetalhado[]` (inclui datas planejadas `inicio`/`fim`, datas efetivas `iniciadaEm`/`encerradaEm`, `situacao`, contadores de Atividades no escopo de leitura do usuário, `alertas` e `capacidades`).

#### `GET /api/sprints/{id}`
Retorna os detalhes da Sprint e suas passagens (`atividades_sprints`) visíveis ao usuário, distinguindo o `desfecho` histórico naquela Sprint do `estadoAtual` da Atividade.

- **Resposta `200 OK`:** `SprintDetalhe`
- **Erros:** `404` se a Sprint não existir.

#### `GET /api/sprints/{id}/resultado`
Retorna o resultado consolidado da Sprint separando claramente `concluidas`, `naoConcluidas` (no encerramento), `retiradas` (antes do encerramento, com motivo e destino) e `emAberto` (caso a Sprint ainda não tenha sido encerrada).

- **Resposta `200 OK`:** `ResultadoSprintResposta`
- **Erros:** `404` se a Sprint não existir.

#### `POST /api/sprints`
Cria uma Sprint planejada (`PLANEJADA`).

- **Autorização:** apenas `CAPITAO_ADMIN` ou `GESTOR`.
- **Corpo:**
  - `nome`: `string` obrigatório (`1..120` caracteres após `trim`)
  - `objetivo`: `string | null` opcional
  - `inicio`: `"AAAA-MM-DD"` obrigatório
  - `fim`: `"AAAA-MM-DD"` opcional — se omitido, o backend preenche `inicio.plusDays(14)` (15 dias inclusivos, duração padrão sugerida); se informado, exige `fim >= inicio` (`422` caso contrário).
- **Resposta `201 Created`:** `SprintResumoDetalhado`

#### `PUT /api/sprints/{id}`
Edita dados de planejamento de uma Sprint.

- **Autorização:** apenas `CAPITAO_ADMIN` ou `GESTOR`.
- **Corpo:** `{ "nome": string, "objetivo"?: string | null, "inicio": "AAAA-MM-DD", "fim": "AAAA-MM-DD" }`
- **Regras:**
  - `ENCERRADA`: retorna `409 Conflict` (não permite edição após encerramento).
  - `EM_ANDAMENTO`: permite ajustar `nome`, `objetivo` e `fim` (desde que `fim >= inicio`); `inicio` permanece imutável após o início efetivo (`422` se alterado).
  - `PLANEJADA`: permite ajustar todos os campos (`fim >= inicio`).
- **Resposta `200 OK`:** `SprintResumoDetalhado`

#### `POST /api/sprints/{id}/inicio`
Confirma o início de uma Sprint `PLANEJADA`.

- **Autorização:** apenas `CAPITAO_ADMIN` ou `GESTOR`.
- **Corpo:** `{ "confirmacao": true }`
- **Regras:**
  - `confirmacao != true`: retorna `422 Unprocessable Content`.
  - Sprint já `EM_ANDAMENTO` ou `ENCERRADA`: retorna `409 Conflict`.
  - Se já existir outra Sprint `EM_ANDAMENTO` (inclusive sob requisições concorrentes capturadas pelo índice único parcial `ux_sprint_em_andamento`): retorna `409 Conflict` informando `sprintEmAndamentoId`.
  - Preenche `iniciada_em = now()` e `iniciada_por_usuario_id = atorId`; preserva as datas planejadas `inicio` e `fim`.
- **Resposta `200 OK`:** `SprintResumoDetalhado`

#### `POST /api/sprints/{id}/alocacoes`
Aloca uma Atividade do Backlog em uma Sprint `PLANEJADA` ou `EM_ANDAMENTO`.

- **Autorização:** apenas `CAPITAO_ADMIN` ou `GESTOR`.
- **Corpo:** `{ "atividadeId": number }`
- **Pré-requisitos validados:**
  1. Sprint existe e não está `ENCERRADA` (se `ENCERRADA`, retorna `409`).
  2. Atividade existe e não está arquivada (se arquivada, retorna `409`).
  3. Atividade não possui Alocação aberta (inclusive sob concorrência garantida por `ux_atividades_sprints_uma_aberta`; se já alocada, retorna `409`).
  4. Atividade atende aos três requisitos de Alocação: `prazo != null`, `estimativaFibonacci` válido e ao menos um Responsável `ativo == true`. Se faltar algum, retorna `422 Unprocessable Content` com `requisitosFaltantes` e `erros`.
- **Efeito:** insere linha em `atividades_sprints` com `origem = 'INICIAL'` e `saida_em = null`. A Atividade sai imediatamente de `GET /api/atividades/backlog`, mesmo quando alocada em Sprint `PLANEJADA`.
- **Resposta `201 Created`:** `AlocacaoResposta` (com `atividade` e `sprint`)

#### `POST /api/sprints/{id}/alocacoes/{atividadeId}/retirada`
Retira uma Atividade com Alocação aberta na Sprint informada, registrando autor, motivo e destino (`BACKLOG` ou outra Sprint `PLANEJADA`).

- **Autorização:** apenas `CAPITAO_ADMIN` ou `GESTOR`.
- **Corpo:**
  - `motivo`: `string` obrigatório (não vazio após `trim`)
  - `destino`: `{ "tipo": "BACKLOG" }` ou `{ "tipo": "SPRINT", "sprintId": number }`
- **Regras:**
  - Sprint deve estar `PLANEJADA` ou `EM_ANDAMENTO` e a Atividade deve ter Alocação aberta nela (caso contrário, `404`/`409`).
  - Se `status == CONCLUIDA`, não é pendência retirável (`409 Conflict`).
  - Se `destino.tipo == "SPRINT"`: `sprintId` é obrigatório, deve apontar para uma Sprint diferente da atual e na situação `PLANEJADA` (caso contrário, `422`).
  - **Persistência em transação única:**
    - Fecha a Alocação atual com `saida_em = now()`, `retirada_antes_encerramento = true`, `encerrada_por_usuario_id = atorId`, `estado_no_encerramento = null`, `motivo_transferencia = motivo` (e `transferida_por_usuario_id = atorId` quando `destino.tipo == "SPRINT"`).
    - Se `destino.tipo == "SPRINT"`, abre na mesma transação uma nova linha em `atividades_sprints` com `origem = 'TRANSFERENCIA'`, `transferida_da_alocacao_id = alocacaoAnterior.id`, `transferida_por_usuario_id = atorId` e `motivo_transferencia = motivo`, preservando `status` e `prazo` da Atividade.
- **Resposta `200 OK`:** `RetiradaAlocacaoResposta`

#### `POST /api/sprints/{id}/encerramento`
Encerra a Sprint `EM_ANDAMENTO` após confirmação, gravando o resultado de todas as passagens abertas e movimentando todas as pendências em **uma única transação atômica**.

- **Autorização:** apenas `CAPITAO_ADMIN` ou `GESTOR`.
- **Corpo (`EncerramentoSprintRequisicao`):**
  - `confirmacao`: `boolean` obrigatório (`true`; se `false` ou ausente → `422`)
  - `destinosPendencias`: `Array<{ atividadeId: number, destino: { tipo: "BACKLOG" | "SPRINT", sprintId?: number | null }, novoPrazo?: "AAAA-MM-DD" | null }>`
- **Regras transacionais e de validação (tudo ou nada):**
  1. Sprint deve estar `EM_ANDAMENTO` (adquire lock pessimista na Sprint / trata concorrência → `409` se já encerrada ou ainda `PLANEJADA`).
  2. Identifica todas as Alocações abertas (`saida_em == null`) da Sprint no momento do fechamento:
     - Se `atividade.status == CONCLUIDA`: fecha a Alocação com `estado_no_encerramento = 'CONCLUIDA'`, `retirada_antes_encerramento = false`, `saida_em = agora`, `encerrada_por_usuario_id = atorId`.
     - Se `atividade.status != CONCLUIDA` (`NAO_INICIADA`, `EM_ANDAMENTO` ou `PAUSADA`): é **pendência obrigatória**.
  3. Toda pendência da Sprint precisa aparecer exatamente uma vez em `destinosPendencias`; IDs extras que não sejam pendências abertas da Sprint são rejeitados; cada `destino.tipo == "SPRINT"` precisa apontar para uma Sprint existente e **na situação `PLANEJADA`** (futura).
  4. Se qualquer pendência estiver sem destino, duplicada, ou com destino inválido, **nada é gravado** e a API responde `422 Unprocessable Content` com `pendenciasInvalidas`.
  5. Para cada pendência válida, na mesma transação:
     - Fecha a passagem na Sprint encerrada com `estado_no_encerramento = 'NAO_CONCLUIDA'`, `retirada_antes_encerramento = false`, `saida_em = agora`, `encerrada_por_usuario_id = atorId`.
     - Se `destino.tipo == "SPRINT"`: abre nova linha em `atividades_sprints` na Sprint futura com `origem = 'TRANSFERENCIA'`, `transferida_da_alocacao_id = alocacaoEncerrada.id`, `transferida_por_usuario_id = atorId`, mantendo o `status` atual de trabalho da Atividade.
     - Se `novoPrazo` foi informado explicitamente e difere do `prazo` atual, atualiza `atividades.prazo` e grava a mudança em `historico_planejamento_atividades`; caso contrário, preserva o `prazo` original (mesmo que vencido).
  6. Marca `sprints.encerrada_em = agora` e `sprints.encerrada_por_usuario_id = atorId`.
- **Resposta `200 OK`:** `ResultadoSprintResposta`

---

## 7. Rastreabilidade entre endpoints e issues

| Issue | Escopo coberto neste contrato |
|---|---|
| **`#58` (`[M02-01]`)** | Contrato completo, capacidades, erros e exemplos JSON abaixo |
| **`#69` (`[M02-02]`)** | `GET /api/atividades/opcoes`, `GET /api/atividades`, `GET /api/atividades/backlog`, `GET /api/atividades/{id}`, `GET /api/atividades/{id}/historico` (`planejamento`), `POST /api/atividades`, `PUT /api/atividades/{id}`, `POST /api/atividades/{id}/arquivamento` |
| **`#95` (`[M02-03]`)** | `PUT /api/atividades/{id}/status`, `POST /api/atividades/{id}/reabertura`, `GET /api/atividades/quadro` (estado atual e transições) e `GET /api/atividades/{id}/historico` (`andamento`) |
| **`#96` (`[M02-04]`)** | `GET /api/sprints`, `GET /api/sprints/{id}`, `POST /api/sprints`, `PUT /api/sprints/{id}`, `POST /api/sprints/{id}/inicio`, `POST /api/sprints/{id}/alocacoes` e remoção imediata do Backlog |
| **`#140` (`[M02-05]`)** | `POST /api/sprints/{id}/alocacoes/{atividadeId}/retirada`, `POST /api/sprints/{id}/encerramento`, `GET /api/sprints/{id}/resultado` e cadeia completa em `GET /api/atividades/{id}/historico` (`alocacoes`) |
| **`#157` (`[M02-06]`)** | Objeto `alertas` em Sprints e Atividades, filtro `alerta` nas consultas e contadores no `resumo` com regras no fuso `America/Sao_Paulo` |
| **`#70`, `#97`, `#98`, `#141`, `#158`, `#169`** | Mesmos contratos consumidos pelos adaptadores mock e real do frontend |
| **`#175` (`[M08-09]`)** | `GET /api/atividades/quadro`, `GET /api/sprints` e `GET /api/atividades?apenasMinhas=true` com `alertas` e `capacidades` para o cartão do Dashboard |

---

## 8. Exemplos completos para mocks e testes da API

Todos os exemplos abaixo são JSON válidos e utilizam os campos exatos do contrato.

### 8.1 Atividade compartilhada com Responsável de outro Subsistema e variação de `capacidades`

Cenário: Atividade `#101` pertence aos Subsistemas `Suspensão` (`id: 2`) e `Freios` (`id: 3`), e possui dois Responsáveis: `Lucas` (`id: 14`, de `Suspensão`) e `Marina` (`id: 19`, de `Powertrain`, `id: 4` — terceiro Subsistema). Resposta de `GET /api/atividades/101` vista pelo **Líder de `Suspensão`** (`capacidades` adaptada ao escopo):

```json
{
  "id": 101,
  "titulo": "Integrar suporte da pinça ao cubo dianteiro",
  "descricao": "Validar folga do disco e torque dos parafusos M8 antes da usinagem.",
  "status": "EM_ANDAMENTO",
  "prioridade": "ALTA",
  "estimativaFibonacci": 8,
  "prazo": "2026-11-12",
  "compartilhada": true,
  "subsistemas": [
    { "id": 2, "nome": "Suspensão", "ativo": true },
    { "id": 3, "nome": "Freios", "ativo": true }
  ],
  "responsaveis": [
    {
      "id": 14,
      "nome": "Lucas Andrade",
      "ativo": true,
      "subsistema": { "id": 2, "nome": "Suspensão" }
    },
    {
      "id": 19,
      "nome": "Marina Costa",
      "ativo": true,
      "subsistema": { "id": 4, "nome": "Powertrain" }
    }
  ],
  "alocacaoAtual": {
    "id": 305,
    "origem": "INICIAL",
    "entradaEm": "2026-11-01T13:00:00Z",
    "sprint": {
      "id": 11,
      "nome": "Sprint 2026.11-A",
      "inicio": "2026-11-01",
      "fim": "2026-11-15",
      "situacao": "EM_ANDAMENTO"
    }
  },
  "quantidadeTransferencias": 0,
  "arquivamento": null,
  "alertas": {
    "poucoProgresso": false,
    "atrasada": false,
    "transferida": false,
    "semResponsavelAtivo": false
  },
  "capacidades": {
    "podeEditarPlanejamento": false,
    "podeArquivar": false,
    "podeAlterarAndamento": true,
    "transicoesDisponiveis": ["PAUSADA", "CONCLUIDA"],
    "podeReabrir": false,
    "podeAlocar": false,
    "requisitosAlocacaoPendentes": [],
    "podeRetirarDaSprint": false
  },
  "criadaPor": { "id": 1, "nome": "Diego Corte" },
  "criadaEm": "2026-10-28T18:10:00Z",
  "atualizadaEm": "2026-11-03T15:20:00Z",
  "concluidaEm": null
}
```

Variação esperada do objeto `capacidades` para a mesma Atividade `#101` (`EM_ANDAMENTO` e alocada) em outros Perfis:

```json
{
  "capitaoOuGestor": {
    "podeEditarPlanejamento": true,
    "podeArquivar": true,
    "podeAlterarAndamento": true,
    "transicoesDisponiveis": ["PAUSADA", "CONCLUIDA"],
    "podeReabrir": false,
    "podeAlocar": false,
    "requisitosAlocacaoPendentes": [],
    "podeRetirarDaSprint": true
  },
  "membroResponsavelMarina": {
    "podeEditarPlanejamento": false,
    "podeArquivar": false,
    "podeAlterarAndamento": true,
    "transicoesDisponiveis": ["PAUSADA", "CONCLUIDA"],
    "podeReabrir": false,
    "podeAlocar": false,
    "requisitosAlocacaoPendentes": [],
    "podeRetirarDaSprint": false
  },
  "orientador": {
    "podeEditarPlanejamento": false,
    "podeArquivar": false,
    "podeAlterarAndamento": false,
    "transicoesDisponiveis": [],
    "podeReabrir": false,
    "podeAlocar": false,
    "requisitosAlocacaoPendentes": [],
    "podeRetirarDaSprint": false
  }
}
```

---

### 8.2 Alocação em Sprint futura (`PLANEJADA`) e erro por requisitos faltantes

Requisição `POST /api/sprints/12/alocacoes` (em que a Sprint `12` está `PLANEJADA`):

```json
{
  "atividadeId": 108
}
```

Resposta `201 Created` (a Atividade `#108` sai do Backlog imediatamente, mesmo com a Sprint ainda `PLANEJADA`):

```json
{
  "alocacao": {
    "id": 318,
    "origem": "INICIAL",
    "entradaEm": "2026-11-12T17:45:00Z",
    "saidaEm": null,
    "desfecho": "ALOCADA",
    "sprint": {
      "id": 12,
      "nome": "Sprint 2026.11-B",
      "inicio": "2026-11-16",
      "fim": "2026-11-30",
      "situacao": "PLANEJADA"
    }
  },
  "atividade": {
    "id": 108,
    "titulo": "Montar chicote do painel de telemetria",
    "status": "NAO_INICIADA",
    "prioridade": "MEDIA",
    "estimativaFibonacci": 5,
    "prazo": "2026-11-25",
    "compartilhada": false,
    "subsistemas": [
      { "id": 5, "nome": "Eletrônica", "ativo": true }
    ],
    "responsaveis": [
      {
        "id": 23,
        "nome": "Rafael Lima",
        "ativo": true,
        "subsistema": { "id": 5, "nome": "Eletrônica" }
      }
    ]
  }
}
```

Resposta `422 Unprocessable Content` quando uma Atividade do Backlog sem prazo e sem Responsável ativo tenta ser alocada:

```json
{
  "type": "about:blank",
  "title": "Unprocessable Content",
  "status": 422,
  "detail": "A Atividade não atende aos requisitos mínimos para alocação em Sprint.",
  "requisitosFaltantes": ["PRAZO", "RESPONSAVEL_ATIVO"],
  "erros": {
    "prazo": "Defina um prazo antes de alocar a Atividade em uma Sprint.",
    "responsavelIds": "Atribua pelo menos um Responsável ativo antes de alocar."
  }
}
```

---

### 8.3 Quadro com alertas independentes e simultâneos (`America/Sao_Paulo`)

Cenário em `2026-11-15` (último dia da Sprint `11`, de `2026-11-01` a `2026-11-15`, cuja metade começou em `2026-11-08`):
- Atividade `#102` (`PAUSADA`), transferida da Sprint `10` (`transferida: true`), cujo único Responsável foi desativado (`semResponsavelAtivo: true`), está parada na segunda metade (`poucoProgresso: true`), porém não está `EM_ANDAMENTO` (`atrasada: false`).
- Atividade `#103` (`EM_ANDAMENTO`), também transferida (`transferida: true`), com `prazo: "2026-11-10"`, está atrasada desde `2026-11-11` (`atrasada: true`), sem alerta de pouco progresso (`poucoProgresso: false`).

Resposta de `GET /api/atividades/quadro` (visto por Capitão):

```json
{
  "sprint": {
    "id": 11,
    "nome": "Sprint 2026.11-A",
    "objetivo": "Fechar conjunto dianteiro e bancada elétrica",
    "inicio": "2026-11-01",
    "fim": "2026-11-15",
    "iniciadaEm": "2026-11-01T12:00:00Z",
    "encerradaEm": null,
    "situacao": "EM_ANDAMENTO",
    "alertas": {
      "dataInicioAlertaPoucoProgresso": "2026-11-08",
      "segundaMetadeAtingida": true,
      "dataFinalAtingida": true
    },
    "capacidades": {
      "podeEditar": true,
      "podeIniciar": false,
      "motivoBloqueioInicio": null,
      "podeAlocarAtividades": true,
      "podeEncerrar": true
    }
  },
  "sprintsSelecionaveis": [
    {
      "id": 11,
      "nome": "Sprint 2026.11-A",
      "inicio": "2026-11-01",
      "fim": "2026-11-15",
      "situacao": "EM_ANDAMENTO"
    },
    {
      "id": 12,
      "nome": "Sprint 2026.11-B",
      "inicio": "2026-11-16",
      "fim": "2026-11-30",
      "situacao": "PLANEJADA"
    }
  ],
  "capacidades": {
    "podeCriarAtividade": true,
    "podeCriarAtividadeCompartilhada": true,
    "podeGerenciarSprints": true
  },
  "resumo": {
    "total": 2,
    "naoIniciadas": 0,
    "emAndamento": 1,
    "pausadas": 1,
    "concluidas": 0,
    "poucoProgresso": 1,
    "atrasadas": 1,
    "transferidas": 2,
    "semResponsavelAtivo": 1,
    "concluidasNoEncerramento": 0,
    "naoConcluidasNoEncerramento": 0,
    "retiradas": 0
  },
  "colunas": {
    "naoIniciada": [],
    "emAndamento": [
      {
        "id": 103,
        "titulo": "Calibrar sensor de rotação do eixo",
        "status": "EM_ANDAMENTO",
        "prioridade": "URGENTE",
        "estimativaFibonacci": 3,
        "prazo": "2026-11-10",
        "compartilhada": false,
        "subsistemas": [
          { "id": 5, "nome": "Eletrônica", "ativo": true }
        ],
        "responsaveis": [
          {
            "id": 23,
            "nome": "Rafael Lima",
            "ativo": true,
            "subsistema": { "id": 5, "nome": "Eletrônica" }
          }
        ],
        "origemNaSprint": "TRANSFERENCIA",
        "quantidadeTransferencias": 1,
        "desfechoNaSprint": "ALOCADA",
        "alertas": {
          "poucoProgresso": false,
          "atrasada": true,
          "transferida": true,
          "semResponsavelAtivo": false
        },
        "capacidades": {
          "podeEditarPlanejamento": true,
          "podeArquivar": true,
          "podeAlterarAndamento": true,
          "transicoesDisponiveis": ["PAUSADA", "CONCLUIDA"],
          "podeReabrir": false,
          "podeAlocar": false,
          "requisitosAlocacaoPendentes": [],
          "podeRetirarDaSprint": true
        }
      }
    ],
    "pausada": [
      {
        "id": 102,
        "titulo": "Revisar gabarito de solda do chassi",
        "status": "PAUSADA",
        "prioridade": "ALTA",
        "estimativaFibonacci": 8,
        "prazo": "2026-11-15",
        "compartilhada": false,
        "subsistemas": [
          { "id": 6, "nome": "Chassi", "ativo": true }
        ],
        "responsaveis": [
          {
            "id": 31,
            "nome": "Bruno Teixeira",
            "ativo": false,
            "subsistema": { "id": 6, "nome": "Chassi" }
          }
        ],
        "origemNaSprint": "TRANSFERENCIA",
        "quantidadeTransferencias": 1,
        "desfechoNaSprint": "ALOCADA",
        "alertas": {
          "poucoProgresso": true,
          "atrasada": false,
          "transferida": true,
          "semResponsavelAtivo": true
        },
        "capacidades": {
          "podeEditarPlanejamento": true,
          "podeArquivar": true,
          "podeAlterarAndamento": true,
          "transicoesDisponiveis": ["EM_ANDAMENTO"],
          "podeReabrir": false,
          "podeAlocar": false,
          "requisitosAlocacaoPendentes": [],
          "podeRetirarDaSprint": true
        }
      }
    ],
    "concluida": []
  }
}
```

---

### 8.4 Retirada antecipada, encerramento com destinos mistos e resultado histórico vs. estado atual

1. **Retirada antes do encerramento** (`POST /api/sprints/11/alocacoes/104/retirada`):

```json
{
  "motivo": "Aguardando entrega de rolamentos pela Gestão Financeira.",
  "destino": {
    "tipo": "BACKLOG"
  }
}
```

2. **Encerramento com destinos mistos** (`POST /api/sprints/11/encerramento`), em que `#102` (`PAUSADA`) retorna ao Backlog e `#103` (`EM_ANDAMENTO`) é transferida para a Sprint planejada `12` preservando seu `prazo` original (`2026-11-10`) e seu estado de trabalho (`EM_ANDAMENTO`):

```json
{
  "confirmacao": true,
  "destinosPendencias": [
    {
      "atividadeId": 102,
      "destino": {
        "tipo": "BACKLOG"
      }
    },
    {
      "atividadeId": 103,
      "destino": {
        "tipo": "SPRINT",
        "sprintId": 12
      }
    }
  ]
}
```

3. **Resultado da Sprint encerrada após posterior reabertura** (`GET /api/sprints/11/resultado`), onde a Atividade `#105` foi concluída dentro da Sprint `11`, mas reaberta posteriormente para ajustes (`estadoAtual: "EM_ANDAMENTO"` enquanto `desfecho: "CONCLUIDA"` continua preservado na Sprint `11`, e `#104` aparece separada em `retiradas`):

```json
{
  "sprint": {
    "id": 11,
    "nome": "Sprint 2026.11-A",
    "inicio": "2026-11-01",
    "fim": "2026-11-15",
    "iniciadaEm": "2026-11-01T12:00:00Z",
    "encerradaEm": "2026-11-15T22:10:00Z",
    "encerradaPor": { "id": 1, "nome": "Diego Corte" },
    "situacao": "ENCERRADA"
  },
  "resumo": {
    "totalPassagens": 4,
    "concluidas": 1,
    "naoConcluidas": 2,
    "retiradas": 1,
    "emAberto": 0
  },
  "concluidas": [
    {
      "alocacaoId": 309,
      "atividadeId": 105,
      "titulo": "Validar rigidez torcional no modelo CAE",
      "origem": "INICIAL",
      "desfecho": "CONCLUIDA",
      "estadoNoEncerramento": "CONCLUIDA",
      "estadoAtual": "EM_ANDAMENTO",
      "reabertaAposEncerramento": true,
      "prazoAtual": "2026-11-18",
      "entradaEm": "2026-11-01T12:15:00Z",
      "saidaEm": "2026-11-15T22:10:00Z",
      "destino": null
    }
  ],
  "naoConcluidas": [
    {
      "alocacaoId": 306,
      "atividadeId": 102,
      "titulo": "Revisar gabarito de solda do chassi",
      "origem": "TRANSFERENCIA",
      "desfecho": "NAO_CONCLUIDA",
      "estadoNoEncerramento": "PAUSADA",
      "estadoAtual": "PAUSADA",
      "reabertaAposEncerramento": false,
      "prazoAtual": "2026-11-15",
      "entradaEm": "2026-11-01T12:05:00Z",
      "saidaEm": "2026-11-15T22:10:00Z",
      "destino": {
        "tipo": "BACKLOG",
        "sprint": null
      }
    },
    {
      "alocacaoId": 307,
      "atividadeId": 103,
      "titulo": "Calibrar sensor de rotação do eixo",
      "origem": "TRANSFERENCIA",
      "desfecho": "NAO_CONCLUIDA",
      "estadoNoEncerramento": "EM_ANDAMENTO",
      "estadoAtual": "EM_ANDAMENTO",
      "reabertaAposEncerramento": false,
      "prazoAtual": "2026-11-10",
      "entradaEm": "2026-11-01T12:05:00Z",
      "saidaEm": "2026-11-15T22:10:00Z",
      "destino": {
        "tipo": "SPRINT",
        "sprint": {
          "id": 12,
          "nome": "Sprint 2026.11-B",
          "inicio": "2026-11-16",
          "fim": "2026-11-30",
          "situacao": "PLANEJADA"
        }
      }
    }
  ],
  "retiradas": [
    {
      "alocacaoId": 308,
      "atividadeId": 104,
      "titulo": "Montar cubo traseiro direito",
      "origem": "INICIAL",
      "desfecho": "RETIRADA",
      "estadoNoEncerramento": null,
      "estadoAtual": "PAUSADA",
      "reabertaAposEncerramento": false,
      "prazoAtual": "2026-11-20",
      "entradaEm": "2026-11-01T12:10:00Z",
      "saidaEm": "2026-11-09T19:00:00Z",
      "encerradaPor": { "id": 2, "nome": "Thales Kohki" },
      "motivo": "Aguardando entrega de rolamentos pela Gestão Financeira.",
      "destino": {
        "tipo": "BACKLOG",
        "sprint": null
      }
    }
  ],
  "emAberto": []
}
```

---

### 8.5 Respostas para encerramento inválido e conflito concorrente

Resposta `422 Unprocessable Content` quando uma pendência ficou sem destino e outra aponta para uma Sprint já encerrada (nenhuma movimentação parcial é persistida; a Sprint `11` e suas Alocações permanecem intactas):

```json
{
  "type": "about:blank",
  "title": "Unprocessable Content",
  "status": 422,
  "detail": "Não foi possível encerrar a Sprint porque existem pendências sem destino válido. Nenhuma alteração foi salva.",
  "pendenciasInvalidas": [
    {
      "atividadeId": 102,
      "motivo": "Informe o destino da pendência (Backlog ou Sprint planejada)."
    },
    {
      "atividadeId": 103,
      "motivo": "A Sprint de destino (#10) já está encerrada; escolha uma Sprint planejada."
    }
  ],
  "erros": {
    "destinosPendencias[102]": "Informe o destino da pendência.",
    "destinosPendencias[103].sprintId": "A Sprint de destino deve estar na situação PLANEJADA."
  }
}
```

Resposta `409 Conflict` ao tentar iniciar uma segunda Sprint quando já existe uma Sprint `EM_ANDAMENTO` (ou em encerramento concorrente):

```json
{
  "type": "about:blank",
  "title": "Conflict",
  "status": 409,
  "detail": "Já existe uma Sprint em andamento (Sprint 2026.11-A). Encerre-a antes de iniciar outra.",
  "sprintEmAndamentoId": 11
}
```

---

### 8.6 Históricos da Atividade (`GET /api/atividades/{id}/historico`)

Exemplo de resposta para a Atividade `#103`, mostrando ajuste explícito de prazo (`planejamento`), transição + reabertura motivada (`andamento`) e cadeia de passagens (`alocacoes`):

```json
{
  "atividadeId": 103,
  "andamento": [
    {
      "id": 914,
      "statusAnterior": "CONCLUIDA",
      "statusNovo": "EM_ANDAMENTO",
      "alteradoPor": { "id": 1, "nome": "Diego Corte" },
      "alteradoEm": "2026-11-05T16:40:00Z",
      "observacao": "Reaberta porque o teste em bancada apresentou ruído no sinal."
    },
    {
      "id": 910,
      "statusAnterior": "EM_ANDAMENTO",
      "statusNovo": "CONCLUIDA",
      "alteradoPor": { "id": 23, "nome": "Rafael Lima" },
      "alteradoEm": "2026-11-04T21:10:00Z",
      "observacao": null
    },
    {
      "id": 902,
      "statusAnterior": "NAO_INICIADA",
      "statusNovo": "EM_ANDAMENTO",
      "alteradoPor": { "id": 23, "nome": "Rafael Lima" },
      "alteradoEm": "2026-10-22T14:00:00Z",
      "observacao": null
    }
  ],
  "planejamento": [
    {
      "id": 412,
      "alteradoPor": { "id": 1, "nome": "Diego Corte" },
      "alteradoEm": "2026-11-16T09:15:00Z",
      "dadosAnteriores": {
        "prazo": "2026-11-10"
      },
      "dadosNovos": {
        "prazo": "2026-11-22"
      }
    }
  ],
  "alocacoes": [
    {
      "id": 280,
      "sprint": {
        "id": 10,
        "nome": "Sprint 2026.10-B",
        "inicio": "2026-10-17",
        "fim": "2026-10-31",
        "situacao": "ENCERRADA"
      },
      "origem": "INICIAL",
      "transferidaDaAlocacaoId": null,
      "entradaEm": "2026-10-17T12:00:00Z",
      "saidaEm": "2026-10-31T23:00:00Z",
      "desfecho": "NAO_CONCLUIDA",
      "estadoNoEncerramento": "EM_ANDAMENTO",
      "retiradaAntesEncerramento": false,
      "transferidaPor": null,
      "encerradaPor": { "id": 1, "nome": "Diego Corte" },
      "motivoTransferencia": null
    },
    {
      "id": 307,
      "sprint": {
        "id": 11,
        "nome": "Sprint 2026.11-A",
        "inicio": "2026-11-01",
        "fim": "2026-11-15",
        "situacao": "ENCERRADA"
      },
      "origem": "TRANSFERENCIA",
      "transferidaDaAlocacaoId": 280,
      "entradaEm": "2026-11-01T12:05:00Z",
      "saidaEm": "2026-11-15T22:10:00Z",
      "desfecho": "NAO_CONCLUIDA",
      "estadoNoEncerramento": "EM_ANDAMENTO",
      "retiradaAntesEncerramento": false,
      "transferidaPor": { "id": 1, "nome": "Diego Corte" },
      "encerradaPor": { "id": 1, "nome": "Diego Corte" },
      "motivoTransferencia": null
    },
    {
      "id": 325,
      "sprint": {
        "id": 12,
        "nome": "Sprint 2026.11-B",
        "inicio": "2026-11-16",
        "fim": "2026-11-30",
        "situacao": "PLANEJADA"
      },
      "origem": "TRANSFERENCIA",
      "transferidaDaAlocacaoId": 307,
      "entradaEm": "2026-11-15T22:10:00Z",
      "saidaEm": null,
      "desfecho": "ALOCADA",
      "estadoNoEncerramento": null,
      "retiradaAntesEncerramento": false,
      "transferidaPor": { "id": 1, "nome": "Diego Corte" },
      "encerradaPor": null,
      "motivoTransferencia": null
    }
  ]
}
```

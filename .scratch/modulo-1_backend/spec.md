# Módulo 1: Equipe e Subsistemas

> **Revisão necessária:** as implementações originais das issues 01–04 foram incorporadas à `develop`; decisões posteriores alteraram as regras de Gestor Financeiro, RA, senha provisória e subsistemas. Consulte [CONTEXT.md](../../CONTEXT.md), o [ADR 0002](../../docs/adr/0002-gestor-financeiro-derivado-do-subsistema.md) e as issues de acompanhamento [06](issues/06-correcao-gestor-financeiro-banco.md), [07](issues/07-identificacao-e-senha-provisoria.md) e [08](issues/08-ajustar-desativacao-e-visibilidade-subsistemas.md).

Especificação de RF01–RF05 e RF32, fechada em entrevista com o responsável pelo projeto em 2026-11-04 e atualizada por decisões posteriores. Complementa o [resumo do módulo](../../docs/projeto/modulos/equipe-e-subsistemas.md), o glossário em [CONTEXT.md](../../CONTEXT.md), os [ADRs 0001–0003](../../docs/adr/) e as issues de acompanhamento. O esquema foi adotado na migration V4 e evoluiu pelas migrations subsequentes; a V8 corrige o modelo efetivo do Gestor Financeiro.

## Perfis e permissões

- Os cinco Perfis e suas permissões são fixos. O catálogo (`permissoes`) e a matriz (`perfil_permissoes`) são semeados por migration, e não há tela para editá-los. "Alterar cargo e permissões" é a Troca de Perfil.
- O Capitão administra Usuários de qualquer Perfil. O Gestor administra apenas Líder, Membro e Orientador: não cadastra nem altera Gestores ou Capitães, nem troca alguém para esses Perfis.
- Há um único Capitão ativo. Ele não pode ser cadastrado, desativado nem ter o Perfil alterado por operações genéricas; o Capitão atual transfere o Perfil somente pela sucessão atômica para um Gestor ou Membro ativo, e escolhe um Subsistema ativo para continuar como Membro.
- O primeiro Capitão é criado na inicialização do backend, a partir de variáveis de ambiente, quando não existe nenhum Capitão ativo.
- Ninguém troca o próprio Perfil, desativa a si mesmo, corrige o próprio Nome ou RA nem redefine a própria senha (para isso há a troca de senha).

## Usuários

- **Login:** RA do aluno ou SIAPE do Orientador, na coluna `ra`. É normalizado sem espaços nas pontas e em minúsculas, e só aceita letras e dígitos, com até 20 caracteres.
- **Cadastro:** Nome, RA, Perfil e Subsistema.
  - O Perfil Líder não pode ser escolhido: só se chega a ele pela Definição de Líder.
  - O Subsistema é proibido para o Capitão, opcional para o Orientador e obrigatório para os demais. Pode ser um Subsistema ainda sem Líder.
  - Um Gestor cadastrado ou transferido para o Subsistema Financeiro ativo recebe automaticamente a responsabilidade financeira.
  - RA já usado por um Usuário ativo é recusado. Se o RA pertence a um Usuário desativado, o cadastro também é recusado, mas a resposta indica esse Usuário para que ele seja reativado.
  - A resposta traz a Senha provisória uma única vez.
- **Senha:**
  - A Senha provisória tem 12 caracteres aleatórios e é gerada no cadastro e na redefinição. A redefinição é feita pelo Capitão ou pelo Gestor, dentro dos Perfis que administram.
  - O próprio Usuário troca a senha informando a atual. A senha tem de 8 a 64 caracteres, e não há troca obrigatória no primeiro acesso.
  - A senha também precisa caber nos 72 bytes do hash BCrypt. Como uma letra acentuada ocupa 2 bytes, uma senha com muitos acentos pode ser recusada antes dos 64 caracteres. A mesma regra vale para a senha do Capitão inicial.
  - Só o hash da senha é guardado (RNF05).
- **Edição:** Nome e RA são corrigidos pelo Capitão ou pelo Gestor, dentro dos Perfis que administram. O RA continua único.
- **Troca de Perfil:**
  - Não pode ser feita para Líder nem a partir de Líder.
  - Gestor que troca para outro Perfil deixa de exercer a responsabilidade financeira, caso esteja associado ao Subsistema Financeiro.
  - O Perfil de Capitão só muda pela sucessão. O sucessor sai do Subsistema na mesma operação; o Capitão anterior passa a Membro e escolhe seu Subsistema ativo de destino.
  - Quem não tem Subsistema e passa a um Perfil que exige um informa o Subsistema na mesma operação.
- **Desativação e Reativação:** nada é excluído.
  - Usuário desativado não faz login e perde a sessão na requisição seguinte.
  - Não podem ser desativados: um Líder, antes de ser substituído; o Capitão ativo. Um Capitão inativo também não pode ser reativado por operação genérica; use a sucessão para transferir o Perfil.
  - Desativar um Gestor associado ao Financeiro retira automaticamente sua responsabilidade financeira; a reativação a valida novamente.
  - Reativar exige a mesma permissão que desativar.

## Subsistemas e Líderes

- **Ciclo de vida:**
  - O Subsistema nasce desativado e sem Líder, mas já pode receber Integrantes. Ele se ativa ao ganhar o primeiro Líder.
  - Desativar exige um Subsistema de destino ativo sempre que houver Usuários nele. Todos, inclusive os desativados, vão para o destino, e o Líder vai como Membro.
  - Reativar é definir um novo Líder.
- **Definição de Líder:**
  - O escolhido é um Membro ativo. Se ele vier de outro Subsistema, é transferido na mesma operação.
  - O escolhido passa a Líder, e o Líder anterior volta a Membro no mesmo Subsistema.
- **Transferência de integrante:**
  - Move um Usuário para outro Subsistema.
  - Não se aplica ao Capitão, que não tem Subsistema, nem ao Líder, que precisa ser substituído antes.
  - O Orientador pode ficar sem Subsistema.
  - Segue a mesma hierarquia de Perfis da administração de Usuários.
- **Nome:** é único sem diferenciar maiúsculas de minúsculas. Capitão e Gestor criam e editam Nome e descrição.

## Gestor Financeiro

- O Subsistema Financeiro canônico é permanente e nasce desativado; pode ser ativado pela Definição de Líder normal.
- O Gestor ativo associado a ele é automaticamente o Gestor Financeiro. O Perfil permanece Gestor e a conta conserva todas as permissões de Gestor.
- Não existe vínculo entre pessoas nem endpoint para atribuir, remover ou transferir a responsabilidade. O endpoint `GET /api/atribuicao-financeira` é somente leitura e retorna `{ "gestor": { "id", "nome" } | null }`.
- No máximo um Gestor ativo pode estar associado ao Financeiro. Serviços serializam operações que alteram essa associação e o banco impõe índice único parcial; transferências em lote validam todos os destinos antes de efetuar mudanças.
- A responsabilidade fica vaga quando não há Gestor ativo associado. Desativar, trocar o Perfil ou transferir o Gestor para fora do Financeiro a retira; reativar ou transferir alguém para lá executa novamente a validação.
- O Subsistema Financeiro não pode ser renomeado nem desativado. O nome e a associação do Gestor são a origem de verdade usada para identificar a responsabilidade.

## Visibilidade (RF32, RNF04)

| Informação | Quem vê |
| --- | --- |
| Nome dos Subsistemas ativos e de seus Líderes | Todos |
| Composição de um Subsistema | Capitão, Gestor e Orientador: todos. Líder e Membro: só o próprio Subsistema |
| Usuários e Subsistemas desativados | Capitão e Gestor |
| RA | O próprio Usuário, o Capitão e o Gestor |

O Capitão não aparece em nenhuma Composição.

## Sessão e login

- A sessão fica no servidor, com cookie HttpOnly, SameSite=Lax e proteção CSRF para a SPA ([ADR 0001](../../docs/adr/0001-sessao-no-servidor.md)). O frontend chama a API pela mesma origem.
- Em produção, os cookies de sessão e `XSRF-TOKEN` são `Secure`, então o ERP só funciona por HTTPS. O `compose.prod.yaml` liga essa opção, e o guia de produção pede um proxy com TLS na frente dos containers.
- O Capitão inicial só é criado com credenciais definidas no `.env` real. O `.env.example` deixa essas variáveis vazias.
- O token CSRF fica no cookie `XSRF-TOKEN`, legível pelo frontend. Em toda requisição que altera dados, inclusive o login, o frontend lê o cookie e reenvia o valor no cabeçalho `X-XSRF-TOKEN`. `GET /api/auth/csrf` responde 204 e só garante que o cookie exista. O login e o logout trocam o token, então o frontend lê o cookie de novo a cada requisição, em vez de guardar o valor.
- Cada requisição recarrega o Usuário do banco, para que a Troca de Perfil e a Desativação valham na hora.
- Login com RA ou senha errados, ou de Usuário desativado, recebe sempre a mesma mensagem: "RA ou senha inválidos".
- Depois de 5 erros em 15 minutos para o mesmo RA, novas tentativas são recusadas até a janela passar. A contagem fica em memória e zera quando o backend reinicia.
- A sessão expira após 8 horas sem uso.

## Auditoria (RNF08)

Cada operação abaixo grava um Registro de auditoria em `logs_auditoria`, na mesma transação da alteração, com ator, entidade, registro, ação e detalhes internos em JSON. Senhas nunca são gravadas. A migration V10 adiciona os escopos históricos de Subsistema de origem e destino.

- Usuário: cadastro, edição de Nome e RA (com os valores antigo e novo), Troca de Perfil, desativação, reativação, redefinição de senha e Transferência de integrante.
- Subsistema: criação, edição, Definição de Líder, ativação e desativação.
- Associação de integrante ao Financeiro: registrada como Transferência de integrante; a responsabilidade não tem entidade de auditoria separada.
- Sucessão do Capitão: registra a troca de Perfil do sucessor, a troca de Perfil e a associação a Subsistema do Capitão anterior.

Login, logout e a troca da própria senha não são registrados.

Capitão e Gestor podem consultar todo o histórico do módulo. Líder consulta somente eventos com seu Subsistema atual no escopo de origem ou de destino; Membro e Orientador não consultam auditoria. Eventos antigos sem escopo continuam visíveis apenas à administração. `GET /api/equipe/auditoria` pagina e filtra por entidade e ação no servidor. A resposta contém ator, data, ação, descrição e nomes dos Subsistemas envolvidos, nunca o JSON bruto, RA, SIAPE, hash ou senha.

## Fora do escopo

- O registro de presença do Capitão está em aberto no glossário e fica para o módulo 4.
- O frontend e sua integração posterior são planejados na [especificação própria](../modulo-1_frontend/spec.md).

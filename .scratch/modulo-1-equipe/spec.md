# Módulo 1: Equipe e Subsistemas

Especificação de RF01–RF05 e RF32, fechada em entrevista com o responsável pelo projeto em 2026-11-04. Complementa o [resumo do módulo](../../docs/projeto/modulos/equipe-e-subsistemas.md), o glossário em [CONTEXT.md](../../CONTEXT.md) e o [ADR 0001](../../docs/adr/0001-sessao-no-servidor.md). Os termos seguem o glossário. As tabelas são as do esquema v4, já aplicado pela migration `V4__adopt_schema_v4.sql`.

## Perfis e permissões

- Os seis Perfis e suas permissões são fixos. O catálogo (`permissoes`) e a matriz (`perfil_permissoes`) são semeados por migration, e não há tela para editá-los. "Alterar cargo e permissões" é a Troca de Perfil.
- O Capitão administra Usuários de qualquer Perfil. O Gestor administra apenas Financeiro, Líder, Membro e Orientador: não cadastra nem altera Gestores ou Capitães, nem troca alguém para esses Perfis.
- Sempre existe pelo menos um Capitão ativo. O último não pode ser rebaixado nem desativado.
- O primeiro Capitão é criado na inicialização do backend, a partir de variáveis de ambiente, quando não existe nenhum Capitão ativo.
- Ninguém troca o próprio Perfil, desativa a si mesmo, corrige o próprio Nome ou RA nem redefine a própria senha (para isso há a troca de senha).

## Usuários

- **Login:** RA do aluno ou SIAPE do Orientador, na coluna `ra`. É normalizado sem espaços nas pontas e em minúsculas, e só aceita letras e dígitos, com até 20 caracteres.
- **Cadastro:** Nome, RA, Perfil e Subsistema.
  - O Perfil Líder não pode ser escolhido: só se chega a ele pela Definição de Líder.
  - O Subsistema é proibido para o Capitão, opcional para o Orientador e obrigatório para os demais. Pode ser um Subsistema ainda sem Líder.
  - Financeiro cadastrado pelo Capitão: o Capitão informa o Gestor, o Vínculo é criado e a conta nasce ativa.
  - Financeiro cadastrado pelo Gestor: a conta nasce desativada, aguardando o Vínculo.
  - RA já usado por um Usuário ativo é recusado. Se o RA pertence a um Usuário desativado, o cadastro também é recusado, mas a resposta indica esse Usuário para que ele seja reativado.
  - A resposta traz a Senha provisória uma única vez.
- **Senha:**
  - A Senha provisória tem 12 caracteres aleatórios e é gerada no cadastro e na redefinição. A redefinição é feita pelo Capitão ou pelo Gestor, dentro dos Perfis que administram.
  - O próprio Usuário troca a senha informando a atual. A senha tem de 8 a 64 caracteres, e não há troca obrigatória no primeiro acesso.
  - Só o hash da senha é guardado (RNF05).
- **Edição:** Nome e RA são corrigidos pelo Capitão ou pelo Gestor, dentro dos Perfis que administram. O RA continua único.
- **Troca de Perfil:**
  - Não pode ser feita para Líder nem a partir de Líder.
  - Financeiro que troca de Perfil perde o Vínculo.
  - Gestor com Vínculos não troca de Perfil até o Capitão transferir esses Vínculos. A recusa lista os Financeiros.
  - Quem passa a Capitão sai do Subsistema.
  - Quem não tem Subsistema e passa a um Perfil que exige um informa o Subsistema na mesma operação.
  - Para Financeiro: o Capitão informa o Gestor. Se quem troca é o Gestor, a conta fica desativada até o Vínculo.
- **Desativação e Reativação:** nada é excluído.
  - Usuário desativado não faz login e perde a sessão na requisição seguinte.
  - Não podem ser desativados: um Líder, antes de ser substituído; um Gestor com Vínculos; o último Capitão ativo.
  - Desativar um Financeiro mantém o Vínculo. Um Financeiro sem Vínculo não pode ser reativado.
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

## Vínculo Financeiro–Gestor

- Só o Capitão define, altera, transfere e remove Vínculos. O Gestor do Vínculo precisa estar ativo.
- Definir o Vínculo de um Financeiro que não tinha Vínculo ativa a conta. Alterar o Vínculo troca o Gestor e não muda a situação da conta.
- Remover o Vínculo de um Financeiro ativo o desativa.
- O Capitão pode transferir de uma vez todos os Vínculos de um Gestor para outro.
- O Vínculo não dá ao Gestor acesso a Informação financeira restrita.

## Visibilidade (RF32, RNF04)

| Informação | Quem vê |
| --- | --- |
| Nome dos Subsistemas ativos e de seus Líderes | Todos |
| Composição de um Subsistema | Capitão, Gestor, Financeiro e Orientador: todos. Líder e Membro: só o próprio Subsistema |
| Usuários e Subsistemas desativados | Capitão e Gestor |
| RA | O próprio Usuário, o Capitão e o Gestor |
| Vínculos | Capitão: todos. Gestor: os seus. Financeiro: o próprio |

O Capitão não aparece em nenhuma Composição.

## Sessão e login

- A sessão fica no servidor, com cookie HttpOnly, SameSite=Lax e proteção CSRF para a SPA ([ADR 0001](../../docs/adr/0001-sessao-no-servidor.md)). O frontend chama a API pela mesma origem.
- O token CSRF fica no cookie `XSRF-TOKEN`, legível pelo frontend. Em toda requisição que altera dados, inclusive o login, o frontend lê o cookie e reenvia o valor no cabeçalho `X-XSRF-TOKEN`. `GET /api/auth/csrf` responde 204 e só garante que o cookie exista. O login e o logout trocam o token, então o frontend lê o cookie de novo a cada requisição, em vez de guardar o valor.
- Cada requisição recarrega o Usuário do banco, para que a Troca de Perfil e a Desativação valham na hora.
- Login com RA ou senha errados, ou de Usuário desativado, recebe sempre a mesma mensagem: "RA ou senha inválidos".
- Depois de 5 erros em 15 minutos para o mesmo RA, novas tentativas são recusadas até a janela passar. A contagem fica em memória e zera quando o backend reinicia.
- A sessão expira após 8 horas sem uso.

## Auditoria (RNF08)

Cada operação abaixo grava um Registro de auditoria em `logs_auditoria`, com o ator, a entidade, o registro, a ação e os detalhes em JSON. Senhas nunca são gravadas.

- Usuário: cadastro, edição de Nome e RA (com os valores antigo e novo), Troca de Perfil, desativação, reativação, redefinição de senha e Transferência de integrante.
- Subsistema: criação, edição, Definição de Líder, ativação e desativação.
- Vínculo: definição, alteração, transferência e remoção.

Login, logout e a troca da própria senha não são registrados.

## Fora do escopo

- O registro de presença do Capitão está em aberto no glossário e fica para o módulo 4.
- A integração do frontend (login real e telas de Equipe) tem issue própria.

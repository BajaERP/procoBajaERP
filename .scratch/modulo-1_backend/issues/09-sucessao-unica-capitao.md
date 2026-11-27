# Backend: sucessão única do Capitão

Status: ready-for-agent

## Contexto

O glossário e o [ADR 0003](../../../docs/adr/0003-sucessao-unica-do-capitao.md) definem um único Capitão ativo. A implementação precisa manter o Perfil e a composição consistentes ao transferir essa responsabilidade.

## O que fazer

- Impedir cadastro ou Troca de Perfil genérica para ou a partir do Capitão.
- Impedir a desativação do único Capitão ativo e garantir no banco que não haja dois Capitães ativos.
- Criar opções autorizadas de sucessão, mostrando somente Gestores e Membros ativos e Subsistemas ativos, sem RA/SIAPE de candidatos.
- Criar operação transacional exclusiva do Capitão: escolher sucessor ativo e Subsistema ativo para o Capitão anterior, que se torna Membro; o sucessor vira Capitão e deixa seu Subsistema.
- Registrar as mudanças na auditoria e garantir a retirada automática da responsabilidade financeira se o Gestor associado ao Financeiro assumir como Capitão.

## Pronto quando

- O índice de banco impede mais de um Capitão ativo e a migration interrompe com mensagem acionável se o estado existente tiver duplicidade.
- Só o Capitão ativo pode consultar as opções e confirmar a sucessão. Gestor recebe `403`.
- Candidatos inativos, Líderes, Orientadores e o próprio Capitão são rejeitados; não é possível concluir sem um Subsistema ativo de destino.
- A operação atualiza os dois Usuários e grava a auditoria numa única transação, sem estado parcial em caso de erro.
- Cadastro e Troca de Perfil não conseguem criar nem retirar o Perfil de Capitão; a proteção de último Capitão continua válida.
- Testes cobrem opções, permissões, Gestor Financeiro, login/sessão após a troca, unicidade no banco e rollback.

## Contrato para o frontend

- `GET /api/equipe/sucessao-capitao/opcoes` retorna `{ "sucessores": [{ "id", "nome", "perfil", "gestorFinanceiro", "subsistema" }], "subsistemasDestino": [{ "id", "nome" }] }`. Só o Capitão ativo pode consultar. A resposta não inclui RA nem SIAPE.
- `POST /api/equipe/sucessao-capitao` recebe `{ "sucessorId": 12, "subsistemaDestinoId": 4 }` e retorna `{ "capitaoAnterior": <UsuarioResposta>, "capitaoAtual": <UsuarioResposta> }`.
- Destino ou candidato inexistente retorna `404`; candidato inelegível ou destino inativo retorna `422`; apenas Capitão pode executar. O servidor garante a atomicidade.

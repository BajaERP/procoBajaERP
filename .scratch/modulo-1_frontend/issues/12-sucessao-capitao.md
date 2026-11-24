# Frontend: sucessão demonstrativa do Capitão

Status: ready-for-agent

**Depends on:** [09 — sucessão única do Capitão, backend](../../modulo-1_backend/issues/09-sucessao-unica-capitao.md)

## O que construir

- Oferecer ao Capitão ativo um fluxo único para escolher Gestor ou Membro ativo como sucessor e Subsistema ativo onde continuará como Membro.
- Confirmar claramente os dois efeitos antes de salvar; ocultar a ação para outros perfis.
- Aplicar a mudança em uma única operação no mock, sem permitir cadastro ou administração genérica de Capitão.
- Após sucesso, manter a sessão demonstrativa com o antigo Capitão, agora como Membro, e refletir a transferência da responsabilidade financeira se o sucessor era Gestor Financeiro.

## Pronto quando

- As opções exibem apenas candidatos e Subsistemas ativos e não mostram RA/SIAPE.
- O sucessor passa a Capitão sem Subsistema; o Capitão anterior passa a Membro do destino escolhido.
- A persistência falha sem alterar qualquer um dos dois registros ou gravar auditoria parcial.
- A sessão e a interface passam a refletir o Perfil Membro do Capitão anterior após sucesso.
- Os estados sem candidato, sem destino, carregamento, erro, sucesso e falha de persistência são claros e acessíveis.
- Testes cobrem regra, permissão, persistência, identidade e retirada da responsabilidade Financeira.

## Dependências

O fluxo usa o serviço demonstrativo do frontend nesta etapa. A rota da API e o contrato definitivo estão na issue de backend vinculada; conectar à API real permanece na [issue 11](11-integracao-backend.md), que será executada por último.

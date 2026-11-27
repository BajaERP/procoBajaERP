# ADR 0003 — Sucessão única do Capitão

**Status:** Aceito

**Data:** 2026-11-24

## Contexto

O Capitão é a identidade administrativa geral do ERP. Permitir várias contas ativas com esse Perfil torna ambíguo quem pode transferir a responsabilidade e enfraquece os fluxos que pressupõem um único responsável. Cadastro e troca de Perfil genéricos também não representam corretamente a saída do Capitão atual para a composição de um Subsistema.

## Decisão

- O banco garante no máximo um Usuário ativo com Perfil `CAPITAO_ADMIN`. Depois da criação do Capitão inicial, a sucessão mantém esse Perfil ocupado.
- Somente o Capitão ativo pode iniciar a sucessão. Ele escolhe um Gestor ou Membro ativo como sucessor e um Subsistema ativo para sua própria permanência como Membro.
- A operação promove o sucessor a Capitão, remove-o de seu Subsistema, rebaixa o Capitão anterior a Membro e associa-o ao destino, tudo na mesma transação.
- A criação do Capitão inicial e a sucessão são os caminhos para assumir `CAPITAO_ADMIN`. A API real e a demonstração oferecem o mesmo fluxo de sucessão.
- A sucessão é auditada junto com suas alterações. Se o sucessor era o Gestor associado ao Financeiro, a responsabilidade financeira fica vaga quando ele deixa esse Subsistema.

## Consequências

- A [migração V9](../../backend/src/main/resources/db/migration/V9__capitao_ativo_unico.sql) cria o índice único parcial e interrompe a migração caso encontre duplicidade preexistente.
- A API lista candidatos e destinos autorizados com os dados necessários para a seleção. A confirmação exige pelo menos um Subsistema ativo e salva sucessor e destino na mesma transação.
- Consulte o [ADR 0004](0004-auditoria-com-escopo-historico.md) para a visibilidade dos eventos gerados pela sucessão.

## Alternativas consideradas

- Permitir vários Capitães ativos deixaria ambígua a responsabilidade administrativa.
- Rebaixar o Capitão e promover seu sucessor em operações separadas permitiria estados intermediários e registros parciais.

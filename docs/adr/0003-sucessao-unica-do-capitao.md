# ADR 0003: sucessão única do Capitão

**Status:** Aceito  
**Data:** 2026-11-24

## Contexto

O Capitão é a identidade administrativa geral do ERP. Permitir várias contas ativas com esse Perfil torna ambíguo quem pode transferir a responsabilidade e enfraquece os fluxos que pressupõem um único responsável. Cadastro e troca de Perfil genéricos também não representam corretamente a saída do Capitão atual para a composição de um Subsistema.

## Decisão

- O banco garante no máximo um Usuário ativo com Perfil `CAPITAO_ADMIN`; a aplicação mantém um Capitão ativo e impede sua desativação ou rebaixamento por operações comuns.
- Somente o Capitão ativo pode iniciar a sucessão. Ele escolhe um Gestor ou Membro ativo como sucessor e um Subsistema ativo para sua própria permanência como Membro.
- A operação promove o sucessor a Capitão, remove-o de seu Subsistema, rebaixa o Capitão anterior a Membro e associa-o ao destino, tudo na mesma transação.
- Cadastro e Troca de Perfil não podem atribuir o Perfil `CAPITAO_ADMIN`. A interface demonstrativa oferece a mesma operação como um fluxo único.
- A sucessão é auditada junto com suas alterações. Se o sucessor era o Gestor associado ao Financeiro, a responsabilidade financeira fica vaga quando ele deixa esse Subsistema.

## Consequências

- Uma migration cria um índice único parcial para impedir dois Capitães ativos e falha com orientação explícita se encontrar duplicidade preexistente.
- A API expõe opções autorizadas sem RA ou SIAPE de terceiros e um endpoint transacional para a sucessão.
- É necessário que exista ao menos um Subsistema ativo para completar a sucessão. O Capitão não pode abandonar o cargo sem que o sucessor e o destino sejam salvos juntos.
- Registros históricos anteriores ao escopo de auditoria podem não ter vínculo de Subsistema.

## Alternativas consideradas

- Permitir vários Capitães ativos: rejeitada, pois deixa a responsabilidade administrativa ambígua.
- Rebaixar o Capitão e promover seu sucessor por duas operações: rejeitada, pois permite estados intermediários sem Capitão ou com dois Capitães e registros parciais.

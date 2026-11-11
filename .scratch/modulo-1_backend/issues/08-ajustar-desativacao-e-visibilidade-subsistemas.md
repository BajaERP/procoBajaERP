# Backend: ajustar desativação e visibilidade de Subsistemas

Status: ready-for-human
Blocked by: 03

## Contexto

O PR #33 implementou os fluxos originais de Subsistemas, incorporados à `develop` pelo PR #36. As decisões posteriores alteram a desativação com um único destino e a visibilidade de Subsistemas inativos.

## O que fazer

- Adaptar desativação, contratos de entrada e auditoria para escolher destinos ativos individualmente para todos os Usuários associados, inclusive os desativados; transferir o Líder como Membro na mesma operação.
- Bloquear a desativação com Usuários associados quando não houver destino ativo; permitir a desativação de Subsistema vazio sem destino.
- Permitir transferência comum para Subsistema inativo, sem aplicar essa exceção à desativação da origem.
- Garantir que Usuário ativo possa acessar o ERP e que Líder ou Membro possa consultar seu próprio Subsistema e sua Composição quando o Subsistema estiver inativo, sem acesso a Usuários desativados nem dados restritos.
- Manter as alterações transacionais e os Registros de auditoria; atualizar os testes e informar o contrato ao responsável pelo frontend.

## Pronto quando

- Uma desativação pode distribuir Usuários, inclusive desativados, entre Subsistemas ativos diferentes; o Líder deixa a liderança e vai como Membro.
- A ausência de destino ativo bloqueia a desativação com Usuários e devolve motivo claro; Subsistema vazio não exige destino.
- A transferência comum para Subsistema inativo funciona conforme as demais permissões e regras.
- A conta ativa e a consulta do próprio Subsistema inativo funcionam sem revelar Usuários desativados ou dados restritos.
- Testes de API e persistência cobrem sucesso, autorização, falhas e atomicidade.

## Comments

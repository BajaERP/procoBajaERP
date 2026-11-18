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

### Contrato para o frontend (2026-11-17)

`POST /api/subsistemas/{id}/desativacao` (Capitão e Gestor), corpo:

```json
{ "destinos": [ { "usuarioId": 12, "subsistemaId": 3 }, { "usuarioId": 15, "subsistemaId": 4 } ] }
```

- Um item por Usuário associado ao Subsistema, inclusive os desativados e o Líder (que vai como Membro). A lista de Usuários vem de `GET /api/subsistemas/{id}/integrantes` com uma sessão de Capitão ou Gestor, que vê os desativados.
- Cada destino precisa ser outro Subsistema ativo; os destinos podem ser diferentes entre si.
- Respostas: `200` com o `SubsistemaResposta` já desativado; `422` com `detail` quando o Subsistema já está desativado, não há outro Subsistema ativo, um destino está inativo ou é a própria origem, ou um Usuário aparece duas vezes; `422` com `semDestino: [{id, nome}]` quando falta destino para alguém; `404` para destino inexistente ou Usuário que não pertence ao Subsistema; `400` para item sem `usuarioId` ou `subsistemaId`; `403` para os demais Perfis. Em qualquer erro nada é alterado.
- Corpo vazio ou sem `destinos` só serve para Subsistema sem Usuários. Pelo esquema, um Subsistema ativo sempre tem ao menos o Líder como Integrante, então na prática a lista sempre é exigida.
- Transferência comum (`POST /api/subsistemas/{id}/integrantes`) aceita Subsistema inativo como destino.
- Líder e Membro que pertencem a um Subsistema inativo continuam entrando no ERP e passam a vê-lo em `GET /api/subsistemas`, `GET /api/subsistemas/{id}` e na Composição, sem os Usuários desativados nem RA alheio. O Orientador continua entrando no ERP, mas só vê Subsistemas ativos, mesmo quando pertence a um inativo (404 no detalhe e na Composição). Os demais Perfis que não administram a equipe continuam sem ver Subsistemas inativos.

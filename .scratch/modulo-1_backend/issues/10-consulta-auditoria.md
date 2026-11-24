# Backend: consulta escopada do histórico de auditoria

Status: ready-for-human

## Contexto

O Módulo 1 já grava eventos de usuários e subsistemas em `logs_auditoria`, mas ainda não oferece consulta protegida nem um escopo histórico para Líderes. O histórico precisa preservar os eventos antigos e limitar o que cada perfil recebe.

## O que fazer

- Criar uma permissão específica de consulta de auditoria para Capitão, Gestor e Líder.
- Registrar em cada evento os subsistemas de origem e destino relevantes no instante da operação. Transferências devem ser visíveis aos escopos da origem e do destino; eventos sem escopo ficam restritos a Capitão e Gestor.
- Expor uma consulta paginada, filtrável por entidade e ação, sem devolver `detalhes_json` bruto nem RA, SIAPE, hash ou senha.
- Retornar descrição legível, ator e resumos dos subsistemas envolvidos, sem depender de interpretar JSON arbitrário no frontend.
- Preservar a gravação do evento na mesma transação da alteração auditada.

## Pronto quando

- Capitão e Gestor consultam o histórico completo do módulo; Líder recebe apenas eventos cujo escopo registrado inclui seu subsistema atual; demais perfis recebem `403`.
- Eventos antigos sem escopo continuam acessíveis a Capitão e Gestor e não aparecem na consulta de Líder.
- Listagem, paginação e filtros aplicam o escopo no servidor antes de contar e retornar resultados.
- Transferências aparecem nos subsistemas de origem e destino, sem que mudanças posteriores de associação alterem o escopo já registrado.
- A resposta não inclui JSON bruto, RA/SIAPE, hash, senha nem IDs de registros fora do necessário ao contrato.
- Testes cobrem permissões, escopo, filtros, paginação, eventos antigos, transferência e privacidade.

## Contrato para o frontend

- `GET /api/equipe/auditoria?page=0&size=25&entidade=USUARIO&acao=TRANSFERIDO` retorna `content`, `page`, `size`, `totalElements` e `totalPages`.
- Cada evento contém `id`, `registradoEm`, `atorNome`, `entidade`, `acao`, `descricao`, `subsistemaOrigem` e `subsistemaDestino`. Os dois últimos são `{ "id", "nome" }` ou `null`.
- `size` fica entre 1 e 100. `page` começa em 0. `entidade` e `acao` são opcionais.
- A autorização de Líder usa as colunas de escopo persistidas, nunca o JSON de detalhes.

# Equipe e Subsistemas

**Requisitos:** RF01–RF05 e RF32. **Fonte:** [documento de projeto](../documento-de-projeto.pdf#page=19), seção 4.1.1, páginas 19–20. Regras planejadas; não indicam implementação. A responsabilidade financeira foi redefinida depois do PDF: deixou de ser um Perfil vinculado a um Gestor e passou a ser uma atribuição do próprio Gestor (veja [CONTEXT.md](../../../CONTEXT.md)).

## Funcionamento

- Acesso com RA e senha própria do ERP, sem autenticação institucional. Cada usuário possui um perfil ativo por vez: Capitão/Administrador, Gestor, Líder, Membro ou Orientador.
- Cada integrante pertence a um subsistema por vez; o requisito afirma que cada subsistema deve ter um Líder que também seja seu integrante. O dicionário e o DBML permitem Líder ausente para subsistema inativo e exigem Líder para ativá-lo; o Orientador pode não ter subsistema. A obrigatoriedade depende das regras de negócio, mesmo quando a coluna admite nulo.
- O Gestor pode alterar perfis apenas entre Líder, Membro e Orientador; não pode promover a Gestor ou Capitão nem modificar usuários que já tenham esses perfis.
- No máximo um Gestor ativo tem a responsabilidade financeira e passa a ser identificado como Gestor Financeiro, mantendo o Perfil e as funções de Gestor. A posição pode ficar vaga. Só o Capitão/Administrador atribui, transfere ou retira essa responsabilidade, e a mudança vale na hora, inclusive nas sessões abertas.
- Antes de desativar o Gestor Financeiro ou trocar seu Perfil, o Capitão/Administrador retira ou transfere a responsabilidade financeira.

## Permissões resumidas

| Perfil | Acesso previsto |
|---|---|
| Capitão/Administrador | Gerencia todos os perfis, subsistemas, lideranças, transferências e a atribuição financeira. |
| Gestor | Gerencia subsistemas e usuários Líder, Membro e Orientador; não gerencia usuários Gestor ou Capitão, nem altera a atribuição financeira. O Gestor Financeiro tem também as funções financeiras. |
| Líder | Consulta seu subsistema e informações não confidenciais de seus integrantes. |
| Membro | Consulta suas informações e a composição não confidencial do próprio subsistema. |
| Orientador | Consulta a composição geral e informações não confidenciais; não gerencia a estrutura. |

As permissões administrativas não concedem automaticamente acesso a informações restritas de outros módulos. Consulte a tabela 3 do PDF para a matriz integral.

## Rastreabilidade

[Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-01%20-%20Equipe%20e%20Subsistemas.drawio.png), [modelo relacional principal](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_26_Equipe_e_Subsistemas.png). Consulte também os [requisitos funcionais](../requisitos/funcionais.md), o [DBML](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v5.dbml) e a matriz integral no PDF.

No modelo proposto, as tabelas relacionadas incluem `usuarios`, `perfis`, `permissoes`, `perfil_permissoes`, `subsistemas`, `atribuicao_financeira`. A lista orienta a leitura e não substitui o dicionário de dados ou as migrações efetivas.

Diagramas de classes: [diagrama de classes 1](../../diagramas/Diagramas%20de%20Classe/01%20Equipe%20e%20Subsistemas.drawio.png). São artefatos de análise e não necessariamente classes já implementadas.

## Cenários para orientar a validação

- Tentar atribuir a responsabilidade financeira por um Gestor, a um Gestor desativado ou a dois Gestores ao mesmo tempo; conferir a rejeição no backend.
- Tentar desativar ou trocar o perfil do Gestor Financeiro antes de retirar ou transferir a responsabilidade e conferir o fluxo exigido.
- Comparar consulta de equipe entre Capitão, Líder e Membro; garantir que acesso administrativo não exponha dados financeiros.

Estes cenários derivam das regras do PDF e não comprovam que os fluxos já existam ou estejam testados.

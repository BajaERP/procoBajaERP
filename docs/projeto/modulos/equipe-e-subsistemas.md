# Equipe e Subsistemas

**Requisitos:** RF01–RF05 e RF32. **Fonte:** [documento de projeto](../documento-de-projeto.pdf#page=19), seção 4.1.1, páginas 19–20. Regras planejadas; não indicam implementação.

## Funcionamento

- Acesso com RA e senha própria do ERP, sem autenticação institucional. Cada usuário possui um perfil ativo por vez: Capitão/Administrador, Gestor, Financeiro, Líder, Membro ou Orientador.
- Cada integrante pertence a um subsistema por vez; o requisito afirma que cada subsistema deve ter um Líder que também seja seu integrante. O dicionário e o DBML permitem Líder ausente para subsistema inativo e exigem Líder para ativá-lo; o Orientador pode não ter subsistema. A obrigatoriedade depende das regras de negócio, mesmo quando a coluna admite nulo.
- O Gestor pode alterar perfis apenas entre Financeiro, Líder, Membro e Orientador; não pode promover a Gestor ou Capitão nem modificar usuários que já tenham esses perfis.
- Cada Financeiro deve estar vinculado a um único Gestor para ativação do perfil. Só o Capitão/Administrador define, altera ou remove o vínculo, que é organizacional e não concede acesso financeiro ao Gestor.
- Se um Financeiro mudar de perfil, o vínculo deixa de se aplicar. Antes de um Gestor com Financeiros vinculados deixar o perfil, o Capitão/Administrador transfere os vínculos para outro Gestor.

## Permissões resumidas

| Perfil | Acesso previsto |
|---|---|
| Capitão/Administrador | Gerencia todos os perfis, subsistemas, lideranças, transferências e vínculos Financeiro–Gestor. |
| Gestor | Gerencia subsistemas e usuários Financeiro, Líder, Membro e Orientador; não gerencia usuários Gestor ou Capitão, nem altera vínculos Financeiro–Gestor. |
| Financeiro | Consulta composição geral, informações não confidenciais e seu Gestor; não administra usuários ou vínculos. |
| Líder | Consulta seu subsistema e informações não confidenciais de seus integrantes. |
| Membro | Consulta suas informações e a composição não confidencial do próprio subsistema. |
| Orientador | Consulta a composição geral e informações não confidenciais; não gerencia a estrutura. |

As permissões administrativas não concedem automaticamente acesso a informações restritas de outros módulos. Consulte a tabela 3 do PDF para a matriz integral.

## Rastreabilidade

[Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-01%20-%20Equipe%20e%20Subsistemas.drawio.png), [modelo relacional principal](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_26_Equipe_e_Subsistemas.png). Consulte também os [requisitos funcionais](../requisitos/funcionais.md), o [DBML](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v4.dbml) e a matriz integral no PDF.

No modelo proposto, as tabelas relacionadas incluem `usuarios`, `perfis`, `permissoes`, `perfil_permissoes`, `subsistemas`, `vinculos_financeiro_gestor`. A lista orienta a leitura e não substitui o dicionário de dados ou as migrações efetivas.

Diagramas de classes: [diagrama de classes 1](../../diagramas/Diagramas%20de%20Classe/01%20Equipe%20e%20Subsistemas.drawio.png). São artefatos de análise e não necessariamente classes já implementadas.

## Cenários para orientar a validação

- Tentar ativar Financeiro sem vínculo e alterar o vínculo por Gestor; conferir a rejeição no backend.
- Tentar alterar o perfil de Gestor com Financeiros vinculados antes da transferência e conferir o fluxo exigido.
- Comparar consulta de equipe entre Capitão, Líder e Membro; garantir que acesso administrativo não exponha dados financeiros.

Estes cenários derivam das regras do PDF e não comprovam que os fluxos já existam ou estejam testados.

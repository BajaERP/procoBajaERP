# Documentação

**Requisitos:** RF23–RF25 e RF32. **Fonte:** [documento de projeto](../documento-de-projeto.pdf#page=27), seção 4.1.5, páginas 27–29. Regras planejadas; não indicam implementação.

## Funcionamento

- O Google Drive é o armazenamento previsto; o ERP mantém metadados e relações. O histórico e as versões disponibilizados pelo Drive incluem arquivos anteriores à implantação, sem duplicar seu conteúdo no banco.
- Todos os perfis podem enviar documentos respeitando suas permissões, com categoria e confidencialidade no cadastro. Alterações posteriores dessas classificações ficam restritas ao Capitão/Administrador e aos Gestores.
- Documentos comuns são acessíveis conforme permissões; os administrativos confidenciais são destinados a Capitão/Administrador e Gestores, e os financeiros confidenciais a Capitão/Administrador e Financeiro, observadas as permissões específicas.
- Relações com subsistemas, atividades, reuniões, eventos e competições não alteram a permissão de acesso ao documento ou ao seu histórico.
- Exclusão é restrita ao Capitão/Administrador e aos Gestores conforme suas permissões. Líderes podem solicitar a exclusão de arquivos de seu contexto para análise autorizada.
- O modelo diferencia documentos comuns, administrativos confidenciais e financeiros confidenciais, além do estado da solicitação de exclusão. O histórico de versões também segue o nível de acesso.
- Falhas na integração devem ser informadas ao usuário sem comprometer a consistência das informações do ERP.

## Permissões resumidas

| Perfil | Acesso previsto |
|---|---|
| Capitão/Administrador | Gerencia documentos de todas as categorias, classificações, exclusões e solicitações de exclusão. |
| Gestor | Gerencia documentos comuns e administrativos confidenciais conforme permissões; não acessa documentos financeiros confidenciais salvo outra permissão específica prevista no documento. |
| Financeiro | Envia e consulta documentos comuns e financeiros autorizados; não altera classificações após envio nem exclui. |
| Líder | Envia, consulta e organiza documentos autorizados de seu contexto e pode solicitar exclusão; não exclui diretamente. |
| Membro e Orientador | Enviam e consultam documentos disponíveis a seus perfis; não excluem nem alteram a classificação após envio. |

Consulte a tabela 7 do PDF para a matriz integral e as regras de associação e histórico.

**Ponto a esclarecer:** a tabela 7 admite acesso do Gestor a documento financeiro confidencial “salvo quando houver outra permissão específica”, enquanto as regras financeiras gerais vedam ao Gestor informações financeiras restritas mesmo quando vinculado a um Financeiro. O PDF não define qual permissão específica autorizaria essa exceção. Não presuma acesso: registre e valide a regra com a equipe antes de implementar.

## Rastreabilidade

[Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-05%20-%20Documenta%C3%A7%C3%A3o.drawio.png), [modelo relacional principal](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_34_Documentacao_Arquivos_e_Versoes.png). Consulte também os [requisitos funcionais](../requisitos/funcionais.md), o [DBML](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v4.dbml) e a matriz integral no PDF.

No modelo proposto, as tabelas relacionadas incluem `documentos`, `categorias_documentos`, `versoes_documentos`, `documentos_subsistemas`, `documentos_atividades`, `documentos_eventos`, `documentos_compras`, `solicitacoes_exclusao_documentos`. A lista orienta a leitura e não substitui o dicionário de dados ou as migrações efetivas.

Diagramas de classes: [diagrama de classes 1](../../diagramas/Diagramas%20de%20Classe/05%20Documenta%C3%A7%C3%A3o.drawio.png). São artefatos de análise e não necessariamente classes já implementadas.

## Cenários para orientar a validação

- Testar envio, classificação inicial e acesso ao histórico segundo o perfil e a confidencialidade.
- Associar documento restrito a outro módulo e confirmar que isso não amplia o acesso; testar solicitação de exclusão por Líder.
- Simular indisponibilidade do Drive e conferir mensagem e consistência dos metadados.

Estes cenários derivam das regras do PDF e não comprovam que os fluxos já existam ou estejam testados.

# Competições e Eventos

**Requisitos:** RF26–RF27, integrados a RF20 e RF24. **Fonte:** [documento de projeto](../documento-de-projeto.pdf#page=29), seção 4.1.6, páginas 29–32. Regras planejadas; não indicam implementação.

## Funcionamento

- Cadastrar e manter histórico de competições, eventos e reuniões, com responsáveis, participantes e documentos relacionados.
- Uma competição pode reunir edição, local, cidade, inscrições, participantes, transporte e seu compartilhamento, hospedagem, alimentação, desafio técnico, veículo e resultados.
- Registros de participação se relacionam ao módulo de Pessoas; atas, regulamentos e demais arquivos, ao módulo de Documentação; valores e despesas, ao Financeiro.
- A associação entre módulos não amplia permissões: dados financeiros, documentos confidenciais e registros de participação continuam protegidos pelas regras de origem.

## Permissões resumidas

| Perfil | Acesso previsto |
|---|---|
| Capitão/Administrador | Gerencia eventos, competições e reuniões e consulta informações integradas conforme suas permissões. |
| Gestor | Gerencia informações operacionais e participação sob sua responsabilidade, sem acessar valores financeiros restritos. |
| Financeiro | Consulta informações gerais não confidenciais e gerencia informações financeiras pelo módulo Financeiro; não gerencia dados operacionais. |
| Líder | Consulta eventos e atualiza informações operacionais sob sua responsabilidade; registra reuniões semanais do próprio subsistema. |
| Membro e Orientador | Consultam informações e documentos não confidenciais disponibilizados ao perfil; não gerenciam eventos ou participação. |

Consulte a tabela 8 do PDF para a matriz integral.

## Rastreabilidade

[Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-06%20-%20Competi%C3%A7%C3%B5es%20e%20Eventos.drawio.png), [modelo relacional principal](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_37_Competicoes_e_Eventos_Organizacao.png). Consulte também os [requisitos funcionais](../requisitos/funcionais.md), o [DBML](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v4.dbml) e a matriz integral no PDF.

No modelo proposto, as tabelas relacionadas incluem `eventos`, `evento_responsaveis`, `reunioes`, `reunioes_subsistemas`, `competicoes`, `logistica_eventos`, `inscricoes_competicao`, `resultados_competicao`. A lista orienta a leitura e não substitui o dicionário de dados ou as migrações efetivas.

Diagramas de classes: [diagrama de classes 1](../../diagramas/Diagramas%20de%20Classe/06%20Competi%C3%A7%C3%B5es%20e%20Eventos.drawio.png). São artefatos de análise e não necessariamente classes já implementadas.

## Cenários para orientar a validação

- Cadastrar evento ou competição com informações operacionais e consultar dados por perfil.
- Verificar responsabilidade pelo registro de presença e acesso a documentos associados.
- Confirmar que o Gestor não recebe valores financeiros restritos mesmo quando administra o evento.

Estes cenários derivam das regras do PDF e não comprovam que os fluxos já existam ou estejam testados.

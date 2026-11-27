# Equipe e Subsistemas

O Módulo 01 implementa os requisitos RF01 a RF05 e aplica RF32 aos dados de equipe. As telas usam a API do ERP no ambiente integrado. O modo demonstrativo está disponível em desenvolvimento. [Matriz acadêmica, seção 4.1.1](../documento-de-projeto.pdf#page=19) · [Arquitetura do frontend](../../../frontend/ARCHITECTURE.md)

## Contas e sessão

- O acesso usa RA do estudante ou SIAPE do Orientador, ambos numéricos, com senha própria do ERP. O servidor mantém a sessão e aplica proteção CSRF nas operações que alteram dados. O cadastro e a redefinição geram uma senha provisória exibida uma única vez. O Usuário deve trocá-la antes de acessar os módulos. [ADR da sessão](../../adr/0001-sessao-no-servidor.md)
- Cada Usuário tem um Perfil e pode ter um único Subsistema. O Capitão fica sem Subsistema e o vínculo é opcional para o Orientador. O Gestor, Líder e Membro precisam de Subsistema. O próprio Usuário altera a senha. As alterações de Nome, RA ou SIAPE, Perfil e status passam pela administração de contas.
- A troca de Capitão ocorre pelo fluxo de sucessão. O Capitão ativo escolhe um Gestor ou Membro ativo como sucessor e um Subsistema ativo para seu próprio retorno como Membro. O ERP promove o sucessor, remove-o de seu Subsistema, registra o novo vínculo do antecessor e audita a operação na mesma transação. [ADR da sucessão](../../adr/0003-sucessao-unica-do-capitao.md)

## Subsistemas, liderança e responsabilidade financeira

- Um Subsistema nasce desativado, pode receber integrantes e é ativado pela primeira definição de Líder. O Líder escolhido é um Membro ativo do próprio Subsistema. Em uma substituição, o Líder anterior volta a Membro.
- O Capitão pode desativar um Subsistema. Se houver integrantes, a operação exige um destino ativo para cada um, inclusive para contas desativadas. O Líder volta a Membro e as transferências são gravadas juntas. A estrutura e o histórico são preservados.
- O Subsistema Financeiro é permanente. Sua associação a um Gestor ativo concede automaticamente a responsabilidade financeira, mesmo quando o Subsistema ainda está desativado. Mudanças de vínculo, Perfil ou situação da conta recalculam a responsabilidade. A posição fica vaga sem Gestor ativo associado. O banco garante no máximo um Gestor ativo no Financeiro. [ADR do Gestor Financeiro](../../adr/0002-gestor-financeiro-derivado-do-subsistema.md)

## Permissões e auditoria

| Perfil | Acesso |
|---|---|
| Capitão | Consulta a equipe, os Subsistemas e a auditoria geral. Administra contas, liderança e transferências e pode desativar Subsistemas ou iniciar a sucessão. |
| Gestor | Consulta a equipe, os Subsistemas e a auditoria geral. Administra Subsistemas e contas de Líder, Membro e Orientador. A promoção ou substituição de Líder ocorre pela definição de liderança. |
| Líder | Consulta sua composição, inclusive em Subsistema inativo, e os eventos de auditoria ligados ao próprio Subsistema. |
| Membro | Consulta sua composição, inclusive em Subsistema inativo. |
| Orientador | Consulta a composição ativa com o recorte de Subsistemas ativos e Usuários ativos sem Subsistema. |

Todos os Perfis consultam o catálogo de Subsistemas ativos. Apenas Capitão, Gestor e o próprio Usuário veem o RA ou SIAPE de uma conta, dentro do respectivo escopo de consulta. Contas desativadas ficam no escopo administrativo.

A auditoria registra os Subsistemas de origem e destino no momento de cada operação. Uma transferência pode aparecer para Líderes dos dois Subsistemas. Eventos antigos sem escopo são exclusivos da consulta geral. A API de auditoria pagina e filtra no servidor, com campos de apresentação. [ADR do escopo histórico](../../adr/0004-auditoria-com-escopo-historico.md)

## Referências

- [Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-01%20-%20Equipe%20e%20Subsistemas.drawio.png) · [Diagrama de classes](../../diagramas/Diagramas%20de%20Classe/01%20Equipe%20e%20Subsistemas.drawio.png) · [Modelo relacional acadêmico](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_26_Equipe_e_Subsistemas.png)
- [Guia de modelagem](../modelagem.md) · [Requisitos funcionais](../requisitos/funcionais.md) · [Equipe e Subsistemas no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=52-400)

## Cenários para validar

- Cadastrar um Usuário, acessar com a senha provisória e testar que a API exige a troca antes de liberar os módulos.
- Comparar a composição e a visibilidade de RA, SIAPE e contas desativadas entre Perfis, inclusive pelo acesso direto à API.
- Definir ou substituir um Líder e desativar um Subsistema com destinos individuais. Conferir a transferência de todos os integrantes e o retorno do Líder ao Perfil Membro.
- Transferir um Gestor para o Financeiro e para fora dele, testar a unicidade em operações concorrentes e conferir a mudança de permissões.
- Concluir uma sucessão com um novo Capitão e consultar a auditoria com os Perfis autorizados, incluindo as duas pontas de uma transferência.

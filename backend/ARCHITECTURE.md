# Feature-Oriented Layered Architecture

## Direção geral

O backend do Proco Baja ERP seguirá o padrão **Feature-Oriented Layered
Architecture**, ou arquitetura em camadas organizada por funcionalidade
(*package by feature*).

Essa abordagem mantém as regras de cada módulo próximas umas das outras,
facilita a manutenção e permite que cada funcionalidade evolua sem criar um
pacote global de controllers, services e repositories difíceis de navegar.

A arquitetura deve permanecer simples. Não será adotada uma arquitetura
hexagonal, CQRS ou qualquer outra abordagem que não seja necessária para o
escopo atual do projeto.

## Estrutura de funcionalidades

O pacote raiz atual é `com.procobajaerp.backend`. As funcionalidades serão
criadas conforme forem implementadas:

```text
com.procobajaerp.backend
├── config
├── shared
├── seguranca
├── equipe
├── atividades
├── financeiro
├── participacao
├── documentacao
├── competicoes
├── governanca
└── dashboard
```

`config` concentra configurações da aplicação, como OpenAPI, CORS e beans
gerais. `seguranca` concentra autenticação e autorização. `shared` deve conter
somente recursos realmente transversais, como tratamento global de exceções e
objetos de paginação.

Não é necessário criar todos os pacotes antecipadamente. Cada funcionalidade
deve ser adicionada quando entrar no ciclo de desenvolvimento correspondente.

## Camadas dentro de uma funcionalidade

Exemplo para a funcionalidade `equipe`:

```text
equipe
├── controller
├── dto
├── domain
├── repository
└── service
```

### `controller`

Responsável pelos endpoints HTTP, recebimento das requisições, validação de
entrada e retorno das respostas. Controllers não devem concentrar regras de
negócio.

### `dto`

Define os objetos de entrada e saída da API. Os DTOs protegem o contrato HTTP
e evitam que entidades JPA sejam expostas diretamente aos consumidores.

### `service`

Implementa os casos de uso e coordena as regras de negócio da funcionalidade.
As transações devem ser definidas nessa camada, normalmente com
`@Transactional`.

### `domain`

Contém as entidades, enums e regras próprias da funcionalidade. As entidades
podem ser entidades JPA diretamente nesta etapa; não é necessário criar uma
segunda representação das mesmas classes.

### `repository`

Responsável pelo acesso e persistência dos dados, normalmente usando Spring
Data JPA. O repository de uma funcionalidade não deve ser usado diretamente
por outra funcionalidade.

## Regras simples de dependência

- `controller` chama `service`.
- `service` usa `domain` e `repository` da própria funcionalidade.
- `repository` cuida somente da persistência.
- Funcionalidades não devem acessar diretamente o repository umas das outras.
- Quando uma funcionalidade precisar de outra, deve depender de um serviço ou
  caso de uso bem definido.
- Entidades JPA não devem ser retornadas diretamente pelos controllers.
- Validações simples de entrada ficam nos DTOs; regras de negócio ficam nos
  services ou no domínio.

## Como evitar overengineering

- Não criar `BaseService`, `BaseController` ou repositories genéricos sem uma
  necessidade concreta.
- Não transformar `shared` em um depósito de classes sem dono.
- Não criar mappers ou abstrações extras antes de existir duplicação real.
- Não criar módulos vazios apenas para completar a árvore de diretórios.
- Preferir uma solução direta e fácil de testar.
- Extrair uma abstração somente quando ela resolver uma necessidade repetida e
  comprovada.

## Ordem recomendada de implementação

A implementação pode seguir os incrementos definidos no projeto:

1. `seguranca` e `equipe`, incluindo usuários, cargos, permissões e
   subsistemas;
2. `atividades`, incluindo backlog, sprints, responsáveis e Kanban;
3. `financeiro`, incluindo entradas, saídas, compras e planejamento;
4. `participacao`, incluindo presença, carga horária e diário de atividades;
5. `documentacao`, `competicoes` e `governanca`;
6. `dashboard`, consumindo os serviços das funcionalidades já implementadas.

O `dashboard` não deve duplicar regras de negócio. Ele deve consultar os
serviços dos módulos responsáveis pelos dados e apenas organizar as
informações para apresentação.

## Testes

Os testes devem acompanhar a mesma organização das funcionalidades:

```text
src/test/java/com/procobajaerp/backend
├── equipe
│   ├── controller
│   └── service
├── atividades
└── financeiro
```

Prioridades de teste:

- testes unitários para regras dos services;
- testes de controller para contratos HTTP e validações;
- testes de repository quando houver consultas ou regras de persistência
  específicas;
- testes de integração para os fluxos principais de cada módulo.

O objetivo é manter cada funcionalidade compreensível, testável e independente
o suficiente para evoluir sem criar dependências desnecessárias entre os
módulos.

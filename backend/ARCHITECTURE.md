# Arquitetura do backend

O backend usa Java 21, Spring Boot, Spring Security, Spring Data JPA, Flyway e PostgreSQL 16. A aplicação organiza suas camadas por funcionalidade no pacote `com.procobajaerp.backend`.

## O que está implementado

| Pacote | Responsabilidade |
| --- | --- |
| `seguranca` | Login com RA ou SIAPE, sessão no servidor, proteção CSRF, logout e troca de senha. |
| `equipe` | Contas, Perfis, Permissões, Subsistemas, vínculos, liderança, atribuição de Gestor Financeiro e sucessão do Capitão. |
| `auditoria` | Gravação e consulta paginada do histórico de alterações do Módulo 1. |
| `shared` | Exceções e tratamento HTTP usados por mais de uma funcionalidade. |

Em um banco sem Capitão ativo, `CapitaoInicial` tenta criar a conta inicial com as variáveis documentadas no [guia de desenvolvimento](../docs/infraestrutura/docker/docker-dev.md#configurar-o-ambiente). O [Módulo 1](../docs/projeto/modulos/equipe-e-subsistemas.md) descreve o escopo de Equipe e Subsistemas.

### API HTTP

| Rotas | Operações |
| --- | --- |
| `/api/auth` | `GET /csrf`, `POST /login`, `GET /eu`, `PUT /senha` e `POST /logout`. |
| `/api/usuarios` | Listagem, consulta individual, cadastro, edição, alteração de Perfil, desativação, reativação e redefinição de senha provisória. |
| `/api/subsistemas` | Listagem, consulta individual, cadastro, edição, mudança de liderança, desativação, listagem e gestão de integrantes. |
| `GET /api/atribuicao-financeira` | Consulta da atribuição obtida pelo vínculo do Gestor ativo com o Subsistema Financeiro. |
| `GET /api/equipe/sucessao-capitao/opcoes` e `POST /api/equipe/sucessao-capitao` | Consulta de candidatos e execução da sucessão. |
| `GET /api/equipe/auditoria` | Consulta com `page`, `size`, `entidade` e `acao`. A primeira página é `0` e o tamanho máximo é `100`. |

O backend publica a especificação OpenAPI em `/v3/api-docs` e a interface Swagger em `/swagger-ui.html`. Controllers recebem DTOs e retornam DTOs. O `TratadorDeErros` formata falhas de validação e regras de negócio como `ProblemDetail`. Na validação do corpo, o mapa `erros` identifica os campos com problema.

### Autenticação e escopo

- O login abre uma sessão no servidor com cookie `HttpOnly`. O cliente obtém o cookie `XSRF-TOKEN` em `GET /api/auth/csrf` e envia seu valor no cabeçalho `X-XSRF-TOKEN` nas requisições de escrita, inclusive no login e no logout. O login renova o identificador da sessão e o token CSRF.
- O backend recarrega os dados de acesso a cada requisição autenticada. Mudanças de Perfil valem na requisição seguinte. Desativação ou redefinição de senha invalida a sessão. A troca da própria senha atualiza a sessão em uso e invalida as demais.
- Uma conta com senha provisória pode consultar a própria sessão, trocar a senha e sair. O acesso aos módulos exige a troca.
- `@PreAuthorize` exige as permissões do Perfil. Os serviços validam hierarquia, escopo dos dados e regras de cada operação. Na auditoria, Capitão e Gestor têm consulta geral. O Líder vê apenas eventos que registraram seu Subsistema atual como origem ou destino. A resposta expõe campos de apresentação.
- O frontend usa a API real na mesma origem quando a demonstração está desabilitada. O proxy do Vite atende esse fluxo no desenvolvimento. Em produção, o frontend sempre usa a API real e o proxy HTTPS encaminha `/api` ao backend.

Consulte os ADRs sobre [sessão](../docs/adr/0001-sessao-no-servidor.md), [Gestor Financeiro](../docs/adr/0002-gestor-financeiro-derivado-do-subsistema.md), [sucessão](../docs/adr/0003-sucessao-unica-do-capitao.md) e [auditoria](../docs/adr/0004-auditoria-com-escopo-historico.md).

## Camadas e dependências

| Camada | Responsabilidade |
| --- | --- |
| `controller` | Recebe requisições, aciona a validação dos DTOs, aplica a autorização por permissão e chama os serviços. |
| `dto` | Define o contrato de entrada e saída e os campos expostos pela API. |
| `service` | Coordena os casos de uso, verifica escopo, aplica regras de negócio e delimita as transações. |
| `domain` | Concentra entidades JPA, objetos de valor, enums e regras do domínio. |
| `repository` | Encapsula consultas e operações de persistência com Spring Data JPA. |

Para novos casos de uso, mantenha cada operação perto do seu domínio e use serviços para a comunicação entre funcionalidades. Já existe um acesso direto de `ConsultaAuditoriaService` a `UsuarioRepository` para buscar o Perfil e o Subsistema do ator. O pacote `seguranca` obtém os dados da conta por `ContaService`. Use `shared` para código transversal e crie abstrações quando houver uma necessidade concreta.

## Persistência e próximos módulos

O [arquivo de configuração](src/main/resources/application.properties) recebe a conexão pelas variáveis `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` e `SPRING_DATASOURCE_PASSWORD`. O Flyway aplica as [migrações versionadas](src/main/resources/db/migration/) e o Hibernate valida o mapeamento com `ddl-auto=validate`. Preserve migrações aplicadas e acrescente uma versão para cada mudança de esquema.

A V4 introduziu tabelas para os Módulos 2 a 7. A [V11](src/main/resources/db/migration/V11__alinhar_modelo_modulos_2_a_8.sql) atualizou esse esquema com restrições e históricos para atividades, compras, participação, eventos, documentação e governança. Essas tabelas são fontes planejadas para o Dashboard do Módulo 8. O código de aplicação atual cobre o Módulo 1. As APIs, permissões e regras transacionais dos outros módulos seguem o [planejamento do projeto](../docs/projeto/visao-geral.md).

Compare o [modelo relacional de referência](../docs/projeto/modelagem.md) com as migrações antes de usar tabelas ou assumir restrições. Implemente as regras dependentes de identidade e de transições nos serviços. O Dashboard deve buscar os dados nos módulos responsáveis e organizá-los para apresentação.

## Testes

Na raiz do repositório, execute com JDK 21:

```bash
cd backend
./mvnw test
```

Os testes de integração usam PostgreSQL 16 embutido, aplicam as migrações Flyway e exercitam a API com MockMvc. Esse ambiente dispensa Docker e as variáveis do PostgreSQL da aplicação. Mantenha os testes nos pacotes das respectivas funcionalidades e cubra validação, autorização, regras de negócio e persistência conforme o fluxo afetado.

Ao trocar de branch, se a suíte carregar classes de entidades ou testes que já saíram do código, execute `./mvnw clean test` para recompilar a partir dos fontes atuais.

Para executar a aplicação completa, consulte os guias de [desenvolvimento](../docs/infraestrutura/docker/docker-dev.md) e [produção](../docs/infraestrutura/docker/docker-prod.md).

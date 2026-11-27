# Docker no desenvolvimento

O ambiente local combina o [Compose base](../../../compose.yaml) com o [Compose de desenvolvimento](../../../compose.dev.yaml). Ele sobe PostgreSQL, backend Spring Boot, frontend Vite e pgAdmin com o código-fonte montado nos containers da aplicação.

## Pré-requisitos

Instale Docker Desktop ou Docker Engine com Docker Compose v2 ou compatível. Execute os comandos deste guia a partir da raiz do repositório.

```bash
docker --version
docker compose version
```

## Configurar o ambiente

Se ainda não houver um `.env` local, copie o [arquivo de exemplo](../../../.env.example).

```bash
cp .env.example .env
```

Defina `POSTGRES_PASSWORD`, `PGADMIN_DEFAULT_EMAIL` e `PGADMIN_DEFAULT_PASSWORD`. Mantenha as credenciais no `.env` local, que é ignorado pelo Git.

Escolha o modo do frontend:

| Valor no `.env` | Comportamento |
| --- | --- |
| `VITE_DEMO_MODE=true` | Usa identidades e dados demonstrativos. É o padrão do Compose local. |
| `VITE_DEMO_MODE=false` | Usa a sessão e os dados reais do backend. O Vite encaminha `/api` para `http://backend:8080` pela rede do Compose. |

Para testar com conta real em um banco novo, preencha `PROCOBAJA_CAPITAO_INICIAL_RA`, `PROCOBAJA_CAPITAO_INICIAL_NOME` e `PROCOBAJA_CAPITAO_INICIAL_SENHA`. Use de 1 a 20 dígitos no identificador e de 8 a 64 caracteres na senha, com limite de 72 bytes em UTF-8. Quando o banco está sem Capitão ativo, o backend usa os três valores para criar a primeira conta. Se algum estiver em branco, ele registra um aviso. Após o primeiro login, troque a senha provisória para liberar os módulos e retire essa senha do `.env`.

Mantenha `PROCOBAJA_COOKIE_SEGURO` ausente ou com valor `false` para o HTTP local.

## Iniciar e verificar

Valide a configuração e suba os serviços em segundo plano:

```bash
docker compose -f compose.yaml -f compose.dev.yaml config --quiet
docker compose -f compose.yaml -f compose.dev.yaml up --build -d
docker compose -f compose.yaml -f compose.dev.yaml ps
```

O backend aguarda o PostgreSQL ficar saudável e aplica as migrações Flyway na inicialização. A primeira construção baixa dependências Maven e npm. Para acompanhar a inicialização e investigar falhas, use:

```bash
docker compose -f compose.yaml -f compose.dev.yaml logs -f backend frontend
```

| Serviço | Endereço padrão no host | Variável de porta |
| --- | --- | --- |
| Frontend | <http://localhost:5173> | `FRONTEND_DEV_PORT` |
| Backend | <http://localhost:8080> | `BACKEND_PORT` |
| pgAdmin | <http://localhost:5050> | `PGADMIN_PORT` |
| PostgreSQL | `localhost:5432` | `POSTGRES_PORT` |

Em caso de conflito, altere a respectiva variável no `.env` e execute `up -d` novamente. A publicação no host muda e as portas internas continuam sendo `5173`, `8080`, `80` e `5432`, respectivamente.

Para verificar o proxy em modo real, acesse o frontend, entre com uma conta ativa e abra **Equipe**. A primeira autenticação do Capitão inicial deve pedir a troca da senha. A especificação OpenAPI e a interface Swagger estão disponíveis pela porta do backend, em `/v3/api-docs` e `/swagger-ui.html`.

### Conectar o pgAdmin ao PostgreSQL

Entre com `PGADMIN_DEFAULT_EMAIL` e `PGADMIN_DEFAULT_PASSWORD`. Ao registrar o servidor, preencha:

| Campo do pgAdmin | Valor |
| --- | --- |
| Host name/address | `postgres`, nome do serviço na rede do Compose |
| Port | `5432`, porta interna do banco |
| Maintenance database | `POSTGRES_DB` |
| Username | `POSTGRES_USER` |
| Password | `POSTGRES_PASSWORD` |

## Alterar o código e as dependências

O Vite acompanha os arquivos em `frontend/`. Para aplicar alterações Java em `backend/`, reinicie o serviço. O comando do container recompila e sobe o Spring Boot.

```bash
docker compose -f compose.yaml -f compose.dev.yaml restart backend
```

Os volumes `frontend_node_modules` e `backend_maven_cache` mantêm dependências entre recriações. Após alterar `package.json` ou `package-lock.json`, reinstale as dependências do frontend no volume e reinicie o Vite:

```bash
docker compose -f compose.yaml -f compose.dev.yaml exec frontend npm ci
docker compose -f compose.yaml -f compose.dev.yaml restart frontend
```

Se o `npm ci` falhar, confira se os dois manifestos são compatíveis e se o container tem acesso ao registro npm. Use `up --build -d` depois de alterar um Dockerfile. Para aplicar variáveis do `.env` aos containers, execute `up -d`.

## Executar o frontend diretamente

Com uma versão do Node aceita pelo [`package.json`](../../../frontend/package.json), execute:

```bash
cd frontend
npm ci
npm run dev
```

Para testar a API real, use `VITE_DEMO_MODE=false npm run dev` com o backend em execução. O [proxy do Vite](../../../frontend/vite.config.ts) usa `http://localhost:8080` como destino padrão. Se a porta do backend no host for outra, informe o endereço em `VITE_API_PROXY_TARGET`.

## Parar o ambiente

O comando abaixo para e remove os containers, preservando os volumes nomeados:

```bash
docker compose -f compose.yaml -f compose.dev.yaml down
```

Acrescente `-v` somente para descartar os dados do PostgreSQL e os volumes de dependências desse projeto Compose. A próxima inicialização recria os volumes.

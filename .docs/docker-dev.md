# Docker no desenvolvimento

Este guia explica como executar o projeto localmente usando Docker Compose.

Os arquivos usados neste ambiente são:

- [`compose.yaml`](../compose.yaml): configurações comuns dos serviços;
- [`compose.dev.yaml`](../compose.dev.yaml): volumes, portas e comandos de desenvolvimento;
- [`.env.example`](../.env.example): exemplo das variáveis de ambiente.

## Pré-requisitos

Instale o Docker Desktop ou o Docker Engine com Docker Compose v2. Confirme a
instalação com:

```bash
docker --version
docker compose version
```

Execute os comandos a partir da raiz do projeto, onde estão os arquivos
`compose.yaml` e `compose.dev.yaml`.

## Frontend

O frontend usa React `19.3.0`, TypeScript `7.0.2` e Vite `8.3.0`. Os arquivos
de dependência ficam em [`frontend/package.json`](../frontend/package.json) e
[`frontend/package-lock.json`](../frontend/package-lock.json).

Para executar o frontend diretamente na máquina, sem Compose:

```bash
cd frontend
npm ci
npm run dev
```

O Docker executa esse mesmo fluxo no target de desenvolvimento e mantém
`node_modules` em um volume separado.

## Configurar o ambiente

Crie o arquivo local de variáveis a partir do exemplo:

```bash
cp .env.example .env
```

Altere pelo menos `POSTGRES_PASSWORD` e
`PGADMIN_DEFAULT_PASSWORD` no arquivo `.env`. O arquivo `.env` é ignorado pelo
Git e não deve ser commitado.

As principais portas podem ser alteradas caso já estejam ocupadas:

```dotenv
POSTGRES_PORT=5432
BACKEND_PORT=8080
FRONTEND_DEV_PORT=5173
PGADMIN_PORT=5050
```

## Subir os serviços

Para construir as imagens e iniciar o ambiente em primeiro plano:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up --build
```

Para iniciar em segundo plano, acrescente `-d`:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up --build -d
```

O backend aguarda o PostgreSQL ficar saudável antes de iniciar. Na primeira
execução, o download das dependências Maven e npm pode levar mais tempo.

## Acessar os serviços

| Serviço | Endereço local | Observação |
| --- | --- | --- |
| Frontend | <http://localhost:5173> | Servido pelo Vite |
| Backend | <http://localhost:8080> | Porta HTTP da aplicação Spring Boot |
| pgAdmin | <http://localhost:5050> | Login definido por `PGADMIN_DEFAULT_EMAIL` e `PGADMIN_DEFAULT_PASSWORD` |
| PostgreSQL | `localhost:5432` | Porta publicada apenas no desenvolvimento |

As portas do host podem mudar conforme o `.env`. Por exemplo, se
`FRONTEND_DEV_PORT=5174`, acesse o frontend em
`http://localhost:5174`.

### Conectar o pgAdmin ao PostgreSQL

Ao cadastrar o servidor no pgAdmin, use os dados definidos no `.env`:

- **Host name/address:** `postgres`
- **Port:** `5432`
- **Maintenance database:** valor de `POSTGRES_DB`
- **Username:** valor de `POSTGRES_USER`
- **Password:** valor de `POSTGRES_PASSWORD`

Dentro da rede do Compose, o hostname é `postgres`, que corresponde ao nome
do serviço. Não use `localhost` no campo de host do pgAdmin.

## Volumes e atualização do código

No desenvolvimento, o código local é montado dentro dos containers:

- `./backend` é montado em `/app`;
- `./frontend` é montado em `/app`;
- `node_modules` do frontend fica em um volume separado;
- o cache Maven fica em um volume separado.

Assim, alterações no código-fonte são refletidas sem reconstruir a imagem. Se
alterar `package.json`, `package-lock.json`, o `Dockerfile` ou alguma
dependência da imagem, reconstrua os serviços com `up --build`.

## Comandos úteis

Ver o estado dos serviços:

```bash
docker compose -f compose.yaml -f compose.dev.yaml ps
```

Acompanhar os logs de todos os serviços:

```bash
docker compose -f compose.yaml -f compose.dev.yaml logs -f
```

Acompanhar apenas o backend:

```bash
docker compose -f compose.yaml -f compose.dev.yaml logs -f backend
```

Parar e remover os containers, preservando os volumes nomeados:

```bash
docker compose -f compose.yaml -f compose.dev.yaml down
```

Use `down -v` somente quando quiser apagar também o banco local, o cache Maven
e o volume de `node_modules`:

```bash
docker compose -f compose.yaml -f compose.dev.yaml down -v
```

Essa última opção remove os dados persistidos do PostgreSQL e exige uma nova
instalação das dependências na próxima inicialização.

## Problemas comuns

### Porta já está em uso

Altere a porta do host no `.env` e suba novamente. Por exemplo:

```dotenv
POSTGRES_PORT=5433
BACKEND_PORT=8081
FRONTEND_DEV_PORT=5174
PGADMIN_PORT=5051
```

As portas internas dos containers continuam sendo `5432`, `8080`, `5173` e
`80`, conforme a configuração dos serviços.

### Erro relacionado a `package.json` ou `package-lock.json`

Confirme que a aplicação frontend foi adicionada em `frontend/` e que contém
os dois arquivos de manifesto. O ambiente de produção usa `npm ci`, que exige
um `package-lock.json` compatível com o `package.json`.

### O frontend não atualizou

Confirme que o serviço foi iniciado com `compose.dev.yaml` e que o arquivo foi
salvo dentro da pasta local `frontend/`. O Compose monta essa pasta no
container; mudanças em Dockerfile ou dependências exigem `--build`.

# Docker em produção

Este guia explica como construir e executar o projeto em um servidor usando
Docker Compose. A produção é construída no próprio servidor e não monta o
código-fonte como volume.

Os arquivos usados neste ambiente são:

- [`compose.yaml`](../compose.yaml): configurações comuns dos serviços;
- [`compose.prod.yaml`](../compose.prod.yaml): targets de produção, portas e política de reinício;
- [`.env.example`](../.env.example): exemplo das variáveis de ambiente;
- [`scripts/backup-postgres.sh`](../scripts/backup-postgres.sh): backup do PostgreSQL.

## Pré-requisitos

No servidor, instale o Docker Engine com Docker Compose v2 e confirme:

```bash
docker --version
docker compose version
```

O usuário que executará os comandos precisa ter permissão para usar o Docker.
Reserve também um diretório fora do volume do PostgreSQL para os backups.

## Frontend

O frontend usa React `19.3.0`, TypeScript `7.0.2` e Vite `8.3.0`. Durante o
build da imagem, o Docker executa `npm ci`, gera o diretório `dist/` com
`npm run build` e entrega os arquivos estáticos por Nginx.

O `package-lock.json` deve acompanhar o `package.json` no deploy. Não monte o
código-fonte nem `node_modules` como volume em produção.

## Preparar o ambiente

Execute os comandos a partir da raiz do projeto e crie o arquivo `.env` no
servidor:

```bash
cp .env.example .env
chmod 600 .env
```

Edite o `.env` e substitua os valores de exemplo, principalmente:

```dotenv
POSTGRES_DB=procobaja
POSTGRES_USER=procobaja
POSTGRES_PASSWORD=uma-senha-forte
BACKEND_PORT=8080
FRONTEND_PROD_PORT=80
```

O `.env` real contém credenciais e nunca deve ser commitado ou publicado. As
variáveis `PGADMIN_*` existem para o desenvolvimento; o pgAdmin não é iniciado
pela configuração de produção.

## Construir e iniciar

Construa as imagens no próprio servidor:

```bash
docker compose -f compose.yaml -f compose.prod.yaml build
```

Depois, inicie os serviços em segundo plano:

```bash
docker compose -f compose.yaml -f compose.prod.yaml up -d
```

O frontend é compilado e servido por Nginx. O backend executa o JAR com Java
21. Os serviços usam `restart: unless-stopped` e serão reiniciados após falhas
ou reinicializações do servidor.

## Acessar e verificar os serviços

Com as portas padrão:

- frontend: `http://IP_OU_DOMINIO_DO_SERVIDOR:80`;
- backend: `http://IP_OU_DOMINIO_DO_SERVIDOR:8080`;
- PostgreSQL: acessível internamente apenas pelo hostname `postgres` na porta
  `5432`.

A porta do PostgreSQL não é publicada no host e o pgAdmin não faz parte da
produção.

Verifique o estado dos containers:

```bash
docker compose -f compose.yaml -f compose.prod.yaml ps
```

Acompanhe os logs:

```bash
docker compose -f compose.yaml -f compose.prod.yaml logs -f
```

Para investigar um serviço específico:

```bash
docker compose -f compose.yaml -f compose.prod.yaml logs -f backend
docker compose -f compose.yaml -f compose.prod.yaml logs -f frontend
```

Reinicie um serviço após verificar os logs:

```bash
docker compose -f compose.yaml -f compose.prod.yaml restart backend
```

## Atualizar a aplicação

Depois de atualizar os arquivos do projeto no servidor, reconstrua as imagens e
recrie os containers:

```bash
docker compose -f compose.yaml -f compose.prod.yaml build
docker compose -f compose.yaml -f compose.prod.yaml up -d
```

Antes de atualizar, confirme que o `.env` local do servidor foi preservado.
Não é necessário nem recomendado montar o código-fonte como volume em
produção.

## Persistência e encerramento

O PostgreSQL usa o volume nomeado `postgres_data`, montado em
`/var/lib/postgresql/data`. Esse volume sobrevive à recriação dos containers.

Para parar os serviços sem remover o volume:

```bash
docker compose -f compose.yaml -f compose.prod.yaml down
```

Nunca use `docker compose down -v` em produção. A opção `-v` remove o volume
nomeado do PostgreSQL e pode apagar todos os dados persistidos.

O volume não protege contra falha do disco, perda do servidor ou corrupção dos
dados. Backups externos são obrigatórios.

## Backup do PostgreSQL

O script [`scripts/backup-postgres.sh`](../scripts/backup-postgres.sh) executa
`pg_dump` dentro do container do PostgreSQL e grava dumps no diretório definido
por `BACKUP_DIR`. Use um caminho fora do volume principal:

```bash
BACKUP_DIR=/var/backups/procobaja \
BACKUP_RETENTION_DAYS=7 \
BACKUP_RETENTION_WEEKS=4 \
./scripts/backup-postgres.sh
```

O script:

- cria um dump diário no formato custom do PostgreSQL;
- cria uma cópia semanal aos domingos;
- remove dumps diários e semanais conforme as retenções configuradas;
- exige que o container `postgres` esteja em execução.

O diretório de backup deve ser copiado regularmente para outro disco ou storage
externo. A existência dos arquivos no mesmo servidor não é suficiente para
proteger contra a perda desse servidor.

### Agendar com cron

O exemplo abaixo executa o backup todos os dias às 2h:

```cron
0 2 * * * cd /opt/procobaja && BACKUP_DIR=/var/backups/procobaja BACKUP_RETENTION_DAYS=7 BACKUP_RETENTION_WEEKS=4 ./scripts/backup-postgres.sh >> /var/log/procobaja-backup.log 2>&1
```

Ajuste `/opt/procobaja` e `/var/backups/procobaja` para os caminhos reais do
servidor. Garanta que o usuário do cron tenha acesso ao Docker e ao diretório
de backup. Teste o script manualmente antes de confiar no agendamento.

### Restaurar um backup

Com os serviços em execução, restaure um dump usando `pg_restore` dentro do
container:

```bash
cat /var/backups/procobaja/postgres_daily_YYYYMMDDTHHMMSSZ.dump | \
  docker compose -f compose.yaml -f compose.prod.yaml exec -T postgres \
  sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" pg_restore \
    --clean \
    --if-exists \
    --no-owner \
    --host=127.0.0.1 \
    --username="$POSTGRES_USER" \
    --dbname="$POSTGRES_DB"'
```

Esse comando usa `--clean` e pode remover objetos existentes no banco de
destino. Prefira validar a restauração primeiro em uma base separada ou em um
ambiente de recuperação. Faça uma confirmação explícita antes de restaurar
sobre a base de produção.

## Fora do escopo desta configuração

TLS, domínio, proxy reverso, firewall e publicação segura do backend não são
configurados por estes arquivos. Em um ambiente público, configure esses
componentes antes de expor a aplicação à Internet.

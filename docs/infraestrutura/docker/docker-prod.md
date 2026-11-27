# Docker em produção

O ambiente de produção combina o [Compose base](../../../compose.yaml) com o [Compose de produção](../../../compose.prod.yaml). O servidor constrói as imagens a partir do checkout. O frontend é compilado com `npm ci` e `npm run build` e servido por Nginx. O backend executa o JAR em Java 21. O código fica nas imagens e o PostgreSQL usa um volume persistente.

## Pré-requisitos

Instale Docker Engine com Docker Compose v2 ou compatível. Execute os comandos a partir da raiz do repositório com um usuário que tenha acesso ao Docker. Prepare um domínio, um proxy reverso com TLS e um diretório de backup fora do volume do banco.

```bash
docker --version
docker compose version
```

## Preparar o ambiente

Em uma instalação nova, copie o [arquivo de exemplo](../../../.env.example). Preserve o `.env` existente nas atualizações.

```bash
umask 077
cp .env.example .env
chmod 600 .env
```

Defina `POSTGRES_DB`, `POSTGRES_USER` e uma senha exclusiva em `POSTGRES_PASSWORD`. As variáveis inicializam um volume novo de PostgreSQL. Se o volume já contém um banco, faça alterações de credenciais no próprio banco e sincronize o `.env` com elas. Mantenha o arquivo local com acesso restrito. As variáveis `PGADMIN_*` são usadas pelo [ambiente de desenvolvimento](docker-dev.md).

No banco inicial, configure as três variáveis `PROCOBAJA_CAPITAO_INICIAL_RA`, `PROCOBAJA_CAPITAO_INICIAL_NOME` e `PROCOBAJA_CAPITAO_INICIAL_SENHA`. Use um identificador de 1 a 20 dígitos e uma senha de 8 a 64 caracteres, com limite de 72 bytes em UTF-8. O backend cria a conta se o banco estiver sem Capitão ativo e as variáveis estiverem preenchidas. Após o primeiro login, troque a senha provisória, remova `PROCOBAJA_CAPITAO_INICIAL_SENHA` do `.env` e execute `up -d` para aplicar a alteração ao container.

## HTTPS obrigatório

O frontend de produção usa a API real. Sirva a interface e a API no mesmo domínio. O Compose de produção usa `PROCOBAJA_COOKIE_SEGURO=true` por padrão. Preserve esse valor para que o cookie de sessão e o cookie `XSRF-TOKEN` sejam marcados como `Secure`.

O Compose publica por padrão o frontend na porta `80` e o backend na `8080` do host. Se o proxy roda no próprio host, publique os containers em loopback e deixe o proxy ocupar as portas públicas `80` e `443`. Configure o `.env` assim:

```dotenv
FRONTEND_PROD_PORT=127.0.0.1:8081
BACKEND_PORT=127.0.0.1:8080
PROCOBAJA_COOKIE_SEGURO=true
```

Configure seu proxy para redirecionar HTTP para HTTPS e encaminhar as rotas conforme a tabela. Preserve o prefixo `/api` ao repassar as chamadas.

| Caminho público | Destino no exemplo |
| --- | --- |
| `/api` e seus subcaminhos | `http://127.0.0.1:8080` |
| Demais caminhos | `http://127.0.0.1:8081` |

Em outra topologia, ajuste os endereços e restrinja no firewall as portas dos containers ao proxy. O domínio, o certificado, o proxy e as regras de firewall são configurados no servidor. O PostgreSQL permanece acessível pela rede do Compose em `postgres:5432`.

## Construir, iniciar e verificar

```bash
docker compose -f compose.yaml -f compose.prod.yaml config --quiet
docker compose -f compose.yaml -f compose.prod.yaml up --build -d
docker compose -f compose.yaml -f compose.prod.yaml ps
docker compose -f compose.yaml -f compose.prod.yaml logs -f backend
```

O backend inicia depois que o PostgreSQL fica saudável e aplica as migrações Flyway. Os serviços usam a política de reinício `unless-stopped`.

Com o proxy ativo, abra o domínio pelo navegador, faça login e verifique a tela **Equipe**. Para verificar o encaminhamento da API, substitua o domínio de exemplo pelo domínio real. O endpoint CSRF deve responder com o status `204`.

```bash
curl -fsS -o /dev/null -w '%{http_code}\n' https://erp.exemplo.org/api/auth/csrf
```

## Atualizar a aplicação

Antes de atualizar, faça um [backup do PostgreSQL](#backup-do-postgresql) e preserve o `.env`. Depois de atualizar o checkout, reconstrua os serviços e inspecione os logs das migrações:

```bash
docker compose -f compose.yaml -f compose.prod.yaml up --build -d
docker compose -f compose.yaml -f compose.prod.yaml logs -f backend
```

Verifique novamente o acesso pelo domínio HTTPS e o login. Para encerrar o ambiente preservando o volume `postgres_data`, use:

```bash
docker compose -f compose.yaml -f compose.prod.yaml down
```

A opção `down -v` remove o volume e seus dados.

## Backup do PostgreSQL

O [script de backup](../../../scripts/backup-postgres.sh) executa `pg_dump` no serviço `postgres` e grava um arquivo no formato customizado. Ele usa a data em UTC nos nomes, cria uma cópia semanal aos domingos em UTC e remove arquivos conforme a retenção diária e semanal. O container do PostgreSQL precisa estar em execução.

A partir da raiz do repositório, use um diretório com acesso restrito e fora do volume do banco:

```bash
umask 077
BACKUP_DIR=/var/backups/procobaja \
BACKUP_RETENTION_DAYS=7 \
BACKUP_RETENTION_WEEKS=4 \
./scripts/backup-postgres.sh
```

O script lê as opções de backup do ambiente do processo. Defina-as na chamada ou exporte-as antes de executar. Mantenha uma cópia dos arquivos em armazenamento externo e teste a restauração periodicamente.

### Agendar com cron

Este exemplo roda o backup às 2h no horário configurado no cron:

```cron
0 2 * * * cd /opt/procobaja && umask 077 && BACKUP_DIR=/var/backups/procobaja BACKUP_RETENTION_DAYS=7 BACKUP_RETENTION_WEEKS=4 ./scripts/backup-postgres.sh >> /var/log/procobaja-backup.log 2>&1
```

Ajuste os caminhos para o servidor. O usuário do cron precisa de acesso ao Docker, ao repositório, ao diretório de backup e ao arquivo de log. Teste a chamada manual antes de agendar.

### Testar a restauração

Use um projeto Compose novo para iniciar apenas um PostgreSQL com volume próprio. No exemplo, substitua o arquivo de entrada pelo dump que deseja validar.

```bash
docker compose -p procobaja-restauracao -f compose.yaml -f compose.prod.yaml up -d --wait postgres
docker compose -p procobaja-restauracao -f compose.yaml -f compose.prod.yaml exec -T postgres \
  sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" pg_restore \
    --single-transaction \
    --no-owner \
    --host=127.0.0.1 \
    --username="$POSTGRES_USER" \
    --dbname="$POSTGRES_DB"' < /var/backups/procobaja/postgres_daily_YYYYMMDDTHHMMSSZ.dump
```

Confira se os dados esperados estão na base restaurada. Para recuperar produção, valide o dump em isolamento, interrompa as escritas e mantenha uma cópia do estado anterior antes de direcionar a aplicação para a base recuperada.

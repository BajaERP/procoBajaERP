# Sessão no servidor em vez de JWT

O login do ERP usa uma sessão guardada no servidor pelo Spring Security, com cookie HttpOnly e proteção CSRF, e não JWT. Uma Troca de Perfil ou uma Desativação precisa valer na hora: um Gestor rebaixado ou um Usuário desativado não pode continuar agindo até um token expirar. Além disso, o ERP tem um único backend e nenhum outro consumidor da API, então a principal vantagem do JWT, a autenticação sem estado entre serviços, não se aplica.

## Consequências

- O navegador não guarda nada de autenticação no `localStorage`. O frontend chama a API pela mesma origem, pelo proxy do Vite no desenvolvimento, e, nas requisições que alteram dados, lê o cookie `XSRF-TOKEN` e reenvia o valor no cabeçalho `X-XSRF-TOKEN`.
- Em produção o ERP precisa de HTTPS: os cookies de sessão e `XSRF-TOKEN` são `Secure`, e um proxy com TLS serve o frontend e a API no mesmo domínio.
- Para rodar mais de uma instância do backend, as sessões precisam ir para um armazenamento compartilhado, como o Spring Session JDBC no próprio PostgreSQL.

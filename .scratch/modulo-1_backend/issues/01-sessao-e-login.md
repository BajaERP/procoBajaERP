# Sessão, login e Capitão inicial

Status: resolved

Parte de [spec.md](../spec.md), seções "Sessão e login" e "Perfis e permissões".

## O que fazer

- Montar a configuração de segurança do backend: sessão no servidor, CSRF para a SPA e autorização pelas permissões do Perfil.
- Semear por migration o catálogo de permissões do módulo 1 e a matriz por Perfil.
- Criar os endpoints de login, logout, Usuário atual e troca da própria senha.
- Limitar as tentativas de login: 5 erros em 15 minutos por RA.
- Criar o primeiro Capitão a partir de variáveis de ambiente quando não houver Capitão ativo.
- Fazer os testes rodarem num PostgreSQL embutido, sem Docker.

## Pronto quando

- Login com credenciais certas abre uma sessão. Credenciais erradas ou Usuário desativado recebem a mesma resposta.
- A sexta tentativa errada em 15 minutos é recusada mesmo com a senha certa.
- Um Usuário desativado ou com o Perfil trocado sente a mudança na requisição seguinte.
- `./mvnw test` passa sem variáveis de ambiente de banco.

## Comments

Implementado nos pacotes `seguranca` e `equipe` (V5 semeia as permissões). Verificado por `AutenticacaoControllerTest`, `FluxoDoNavegadorTest` (HTTP real: cookies, cabeçalho XSRF e troca do token no login e no logout), `LimiteDeTentativasTest`, `CapitaoInicialTest` e `SenhaTest`.

Ajuste durante a implementação: `GET /api/auth/csrf` responde 204 e só emite o cookie. O token do corpo da resposta, que vinha mascarado, não servia no cabeçalho com `csrf().spa()`. O contrato ficou na spec, seção "Sessão e login".

Ajuste na revisão: o BCrypt recusa senhas acima de 72 bytes, e uma senha de 64 caracteres acentuados passa disso, o que dava erro 500 na troca de senha. A regra `Senha` confere os 8 a 64 caracteres e os 72 bytes, na troca de senha e no Capitão inicial, e a spec registra o limite.

Ajustes da revisão do PR (comentários sobre produção):
- O `.env.example` deixa vazias as variáveis do Capitão inicial, para que nenhuma conta administrativa nasça com credenciais publicadas no repositório. Os guias de desenvolvimento e de produção pedem essas variáveis no `.env` real.
- O `compose.prod.yaml` liga o cookie `Secure`, e o `XSRF-TOKEN` segue a mesma configuração (`SegurancaConfigTest`). O guia de produção exige HTTPS por um proxy com TLS na frente dos containers.

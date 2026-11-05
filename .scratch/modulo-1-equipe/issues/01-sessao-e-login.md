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

Implementado nos pacotes `seguranca` e `equipe` (V5 semeia as permissões). Verificado por `AutenticacaoControllerTest`, `FluxoDoNavegadorTest` (HTTP real: cookies, cabeçalho XSRF e troca do token no login), `LimiteDeTentativasTest` e `CapitaoInicialTest`.

Ajuste durante a implementação: `GET /api/auth/csrf` responde 204 e só emite o cookie. O token do corpo da resposta, que vinha mascarado, não servia no cabeçalho com `csrf().spa()`. O contrato ficou na spec, seção "Sessão e login".

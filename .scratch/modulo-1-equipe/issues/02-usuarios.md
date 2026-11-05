# Cadastro e administração de Usuários

Status: resolved
Blocked by: 01

Parte de [spec.md](../spec.md), seções "Usuários", "Visibilidade" e "Auditoria".

## O que fazer

- Endpoints de cadastro, edição de Nome e RA, Troca de Perfil, desativação, reativação e redefinição de senha.
- Consulta de Usuários respeitando a visibilidade de cada Perfil, incluindo o RA.
- Registro de auditoria de cada operação.

## Pronto quando

- O Gestor não consegue cadastrar nem alterar Gestor ou Capitão.
- Financeiro cadastrado pelo Gestor nasce desativado. Cadastrado pelo Capitão, nasce com Vínculo e ativo.
- O último Capitão ativo, um Gestor com Vínculos e um Líder não podem ser desativados nem trocar de Perfil.
- Líder e Membro só veem Usuários do próprio Subsistema, e ninguém além do próprio Usuário, do Capitão e do Gestor vê o RA.

## Comments

Implementado em `UsuarioService` e `UsuarioController`. Verificado por `UsuarioControllerTest`.

A regra do último Capitão ativo não é alcançável pela API: ninguém desativa nem troca o próprio Perfil, e só um Capitão ativo age sobre outro Capitão, então sempre resta ao menos um. A checagem fica no service como defesa.

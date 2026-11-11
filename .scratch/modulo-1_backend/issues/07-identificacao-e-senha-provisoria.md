# Backend: padronizar identificação e exigir troca de senha provisória

Status: ready-for-human
Blocked by: 01, 02

## Contexto

O responsável definiu que RA e SIAPE aceitam somente números e que toda Senha provisória deve ser substituída no próximo acesso, antes de acessar os módulos. O backend atual aceita letras no RA e já permite a troca da própria senha, mas não exige essa troca.

## O que fazer

- Validar RA e SIAPE como identificadores numéricos em todos os fluxos pertinentes. O responsável informou que o sistema ainda não foi usado e não há dados antigos de RA a migrar.
- Gerar senha provisória no cadastro e na redefinição, exibindo-a uma única vez na resposta autorizada. Não registrar senhas em texto puro.
- Tratar como provisória a senha de configuração do primeiro Capitão.
- Marcar a troca como pendente após cadastro ou redefinição e impedir o acesso aos módulos até que o próprio Usuário a conclua.
- Encerrar as sessões ativas ao redefinir a senha; a senha provisória não expira por prazo.
- Adaptar as respostas de autenticação e os contratos necessários ao frontend. Preservar as migrações existentes e usar nova migração quando necessário.

## Pronto quando

- Letras e símbolos são recusados em RA e SIAPE, e os fluxos de login e cadastro usam a mesma regra.
- Usuários recém-cadastrados, contas redefinidas e o primeiro Capitão precisam trocar a senha provisória antes de acessar os módulos.
- Redefinir a senha invalida as sessões existentes, e a senha anterior não autentica mais.
- A senha provisória não expira por tempo; deixa de valer após troca ou nova redefinição.
- Testes cobrem as restrições no servidor e não expõem senhas em logs ou auditoria.

## Comments

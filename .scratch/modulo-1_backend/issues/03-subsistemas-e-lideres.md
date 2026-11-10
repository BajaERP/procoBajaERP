# Subsistemas, Definição de Líder e Transferência de integrante

Status: ready-for-agent
Blocked by: 02

Parte de [spec.md](../spec.md), seções "Subsistemas e Líderes", "Visibilidade" e "Auditoria".

## O que fazer

- Criar e editar Subsistemas, que nascem desativados e sem Líder.
- Definição de Líder: só um Membro ativo pode ser escolhido. Ele é transferido se for de outro Subsistema, o Líder anterior volta a Membro e o Subsistema se ativa.
- Transferência de integrante.
- Desativação do Subsistema com destino para os Usuários.
- Consulta de Subsistemas e da Composição conforme o Perfil.

## Pronto quando

- O primeiro Subsistema da equipe pode ser montado do zero: criar, cadastrar Membros nele e definir o Líder.
- Um Líder não pode ser transferido sem antes ser substituído.
- Desativar um Subsistema move todos os seus Usuários para o destino e deixa o antigo Líder como Membro.

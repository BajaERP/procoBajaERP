# Frontend integrado e protótipo de referência

Este documento compara o app em `src/` com o protótipo empacotado em
`prototipacao_erp_procobaja/Prototipação ERP ProcoBaja.zip`.

## Frontend integrado

- O shell tem navegação responsiva, barra superior e páginas Welcome/Login.
- A tela Gestão apresenta dados fictícios em memória e abas de membros,
  presenças, reuniões e subsistemas.
- Configurações permite escolher tema claro, escuro ou acompanhar o sistema.
- Dashboard, Equipe, Atividades, Financeiro, Competições e Documentação
  continuam como páginas “Em construção”.
- O login aceita RA e senha não vazios apenas para demonstração local. Não há
  API conectada, autenticação real nem controle de acesso no backend.

## Protótipo de referência

O ZIP contém uma exploração visual mais ampla, com páginas por perfil e módulos
de negócio. Essas telas ajudam a entender possibilidades de navegação e
conteúdo, mas não estão ligadas ao router nem ao backend do app integrado. O
guia `AGENTS.md` marca o protótipo como somente leitura.

## Como usar a referência

- Prefira os componentes e tokens de `src/` ao implementar correções no app.
- Consulte o protótipo para contexto visual, sem assumir que seus dados ou
  fluxos já funcionam no app principal.
- Não copie controles de perfil como se fossem segurança; autorização real
  depende de implementação no backend.

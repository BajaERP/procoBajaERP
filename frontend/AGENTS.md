# ProcoBaja ERP — Frontend

## Comandos e verificação

O frontend usa React, TypeScript, Vite e Tailwind CSS v4. Consulte `package.json` para versões e requisitos de Node. Execute os comandos em `frontend/`:

```bash
npm run dev           # servidor de desenvolvimento
npm run build         # verificação TypeScript e build
npm run format        # aplicar Prettier
npm run format:check  # verificar formatação sem alterar arquivos
npm run preview       # visualizar o build
```

Após alterar código, execute `npm run format:check` e `npm run build`. Não há script de testes configurado; verifique as interações afetadas no navegador quando apropriado. O Prettier usa tabs com largura de quatro colunas.

## Organização

- `src/app/`: rotas, proteção demonstrativa e shell.
- `src/pages/`: composição e navegação de cada rota.
- `src/components/pages/<pagina>/`: componentes específicos de uma página.
- `src/components/layout/`: estrutura compartilhada, como sidebar e header.
- `src/components/shared/`: componentes reutilizados entre páginas.
- `src/contexts/`: sessão demonstrativa e preferência de tema.
- `src/styles.css`: tokens, temas e estilos globais.

Mantenha componentes próximos da página até haver reutilização real. As rotas usam hash e ficam sob `/app/*`; o destino padrão após o login é Dashboard. Preserve a restauração de links protegidos e a transição entre introdução e login.

## Dados e sessão

A maioria dos módulos ainda é placeholder. O frontend não está conectado a endpoints de aplicação ou autenticação: `AuthContext` cria uma sessão local demonstrativa com RA numérico e senha não vazia. Não trate o estado local como autenticação, autorização ou proteção de dados reais; não apresente dados indisponíveis como reais.

## Interface e acessibilidade

- Preserve os assets da marca, a paleta vermelha, DM Sans e JetBrains Mono; use `lucide-react` nos ícones de interface.
- Suporte larguras desde 320 px e telas baixas. No drawer mobile, preserve foco contido, fechamento por Escape e restauração do foco.
- Mantenha alvos interativos com pelo menos 44 px de altura e botões apenas com ícone com pelo menos 44 px de largura; tabelas densas rolam em região própria.
- Em indicadores futuros, use uma coluna no mobile, duas no tablet e quatro no desktop.
- Use os tokens semânticos e verifique temas claro e escuro, estados e movimento reduzido.
- Prefira `rounded-md`, `rounded-lg` e `rounded-full`; reserve `rounded-2xl` a cartões de login quando usados. Evite raios arbitrários e sombras em cards.
- Use português brasileiro nos textos da interface.

## Referências

Para implementar ou comparar interfaces, consulte o [Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=0-1&t=baEGJUvpkYT1JrQA-1) e `DESIGN.md`; preserve desvios solicitados pelo usuário. Para fluxo de navegação, sessão, desenvolvimento e Docker, consulte `ARCHITECTURE.md`.

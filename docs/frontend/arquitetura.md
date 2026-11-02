# Arquitetura do frontend

## Stack

O frontend é uma aplicação React com TypeScript e Vite:

- React `19.3.0` e React DOM `19.3.0`;
- TypeScript `7.0.2`;
- Vite `8.3.0`;
- `@vitejs/plugin-react` para JSX/TSX e atualização rápida durante o desenvolvimento.

As versões são fixadas no `package.json` e reproduzidas pelo
`package-lock.json`.

## Estrutura inicial

```text
frontend/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── styles.css
    └── vite-env.d.ts
```

`main.tsx` cria a raiz React e importa os estilos globais. `App.tsx` contém a
tela inicial de verificação do ambiente. A organização de domínios,
componentes, rotas e integração com a API será definida quando essas
funcionalidades forem implementadas.

## Desenvolvimento

Execute diretamente na máquina:

```bash
cd frontend
npm ci
npm run dev
```

Ou use o Compose na raiz do projeto:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up --build
```

O Vite inicia na porta `5173`. No Compose, o código-fonte é montado em
`/app`, permitindo atualização automática durante a edição.

## Produção

O build de produção é feito com:

```bash
npm run build
```

O comando executa a verificação TypeScript e depois `vite build`, produzindo
`dist/`. No Docker, esse diretório é copiado para uma imagem Nginx e servido
na porta `80`.

Ainda não há router, cliente HTTP ou variável de ambiente de API. Quando o
frontend começar a consumir o backend, variáveis públicas deverão usar o
prefixo `VITE_`; segredos nunca devem ser incluídos nelas.

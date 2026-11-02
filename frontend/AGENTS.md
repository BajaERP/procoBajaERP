# ProcoBaja ERP — Frontend

Siga também o `AGENTS.md` da raiz. Para fluxos, estado atual e Docker, consulte [`ARCHITECTURE.md`](ARCHITECTURE.md); para identidade visual, componentes, responsividade e acessibilidade, consulte [`DESIGN.md`](DESIGN.md) e o [Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=0-1&t=baEGJUvpkYT1JrQA-1). Preserve as decisões do projeto que diferem do Figma.

## Organização e implementação

- `src/app/`: roteador, proteção demonstrativa e shell compartilhado.
- `src/pages/`: composição das páginas e coordenação de seus fluxos.
- `src/components/pages/<pagina>/`: componentes usados apenas pela página correspondente.
- `src/components/layout/`: estrutura compartilhada, como sidebar e header.
- `src/components/shared/`: componentes reutilizados por diferentes páginas.
- `src/contexts/`: estado compartilhado de sessão demonstrativa e tema.
- `src/styles.css`: tokens, temas e estilos globais.

Mantenha componentes específicos junto à respectiva página; mova-os para uma área compartilhada quando houver reutilização real. Use `lucide-react` nos ícones e os tokens semânticos do CSS para cores. O Prettier usa tabs com largura de quatro colunas; consulte sua configuração e `package.json` para as demais opções, versões e requisitos de Node.

## Navegação, dados e interface

O roteador usa hash: introdução e login ficam em `/` e `/login`, e as rotas do shell em `/app/*`. Ao alterar esses fluxos, preserve a transição automática entre introdução e login, o Dashboard como destino padrão e a restauração de uma rota protegida solicitada antes do login.

A maioria dos módulos ainda está em construção. O `AuthContext` cria uma sessão local demonstrativa com RA numérico e senha não vazia; o frontend não está conectado à autenticação nem a uma API de aplicação. Não trate a sessão como proteção de dados ou autorização e não apresente dados indisponíveis como reais. Na integração, valide identidade e permissões no backend; variáveis `VITE_` são públicas e não devem conter segredos.

Em mudanças visuais, preserve a identidade da marca e os ajustes solicitados para o projeto. Dê suporte a temas claro e escuro, telas a partir de 320 px e alturas reduzidas, navegação por teclado, foco visível e movimento reduzido. No drawer mobile, preserve contenção e restauração do foco e fechamento por Escape. Consulte `DESIGN.md` para os demais padrões e para a validação visual.

## Comandos e verificação

Execute em `frontend/`. Consulte `package.json` para a lista completa de scripts.

```bash
npm run dev           # servidor de desenvolvimento
npm run format:check  # verifica formatação sem alterar arquivos
npm run build         # verifica TypeScript e gera o build
```

Após alterar código, execute `npm run format:check` e `npm run build`. Não há script de testes configurado. Quando layout ou interação mudar, verifique no navegador os estados e tamanhos afetados; para mudanças na navegação, confira também a seleção da sidebar e os fluxos de login e retorno relevantes. Informe o que foi verificado e qualquer limitação.

`npm run format` reescreve os arquivos cobertos pelo script; revise o resultado para preservar alterações existentes. Para instalação e detalhes de execução, consulte `ARCHITECTURE.md`.

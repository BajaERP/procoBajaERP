-- Gestor Financeiro (issue 06 do backend do módulo 1): a responsabilidade financeira deixa de ser um Perfil
-- próprio, vinculado a outro Gestor, e passa a ser uma atribuição dada pelo Capitão a um único Gestor ativo.
-- Nenhum Usuário recebe a responsabilidade automaticamente.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM usuarios u JOIN perfis p ON p.id = u.perfil_id WHERE p.nome = 'FINANCEIRO') THEN
        RAISE EXCEPTION USING
            MESSAGE = 'V6 aborted: there are usuarios with the FINANCEIRO perfil, which no longer exists.',
            HINT = 'Change their perfil (for example to GESTOR or MEMBRO) before migrating; the Capitão assigns '
                || 'the financial responsibility to a Gestor afterwards.';
    END IF;
END;
$$;

DROP TABLE vinculos_financeiro_gestor;

DELETE FROM perfil_permissoes
WHERE perfil_id = (SELECT id FROM perfis WHERE nome = 'FINANCEIRO');

DELETE FROM perfis WHERE nome = 'FINANCEIRO';

UPDATE perfis
SET descricao = 'Gestor: organização administrativa da equipe. Só acessa informações financeiras restritas quando tem a atribuição financeira.'
WHERE nome = 'GESTOR';

UPDATE permissoes
SET codigo = 'ATRIBUICAO_FINANCEIRA_GERENCIAR',
    recurso = 'ATRIBUICAO_FINANCEIRA',
    descricao = 'Atribuir, transferir e retirar a responsabilidade financeira de um Gestor.'
WHERE codigo = 'VINCULOS_GERENCIAR';

UPDATE permissoes
SET descricao = 'Consultar Usuários, Subsistemas, Composições e o Gestor Financeiro conforme o que o Perfil pode ver.'
WHERE codigo = 'EQUIPE_CONSULTAR';

-- No máximo uma linha: a chave fixa em 1 impede um segundo responsável, e a tabela vazia é a posição vaga.
-- Transferir troca o Gestor desta linha numa só operação. Que o Gestor tenha o Perfil Gestor e esteja ativo
-- é conferido no backend.
CREATE TABLE "atribuicao_financeira" (
  "id" smallint PRIMARY KEY DEFAULT 1,
  "gestor_usuario_id" bigint UNIQUE NOT NULL,
  "atribuida_por_usuario_id" bigint NOT NULL,
  "atribuida_em" timestamptz NOT NULL DEFAULT (now()),
  CONSTRAINT "chk_atribuicao_financeira_unica" CHECK (id = 1)
);

ALTER TABLE "atribuicao_financeira" ADD FOREIGN KEY ("gestor_usuario_id") REFERENCES "usuarios" ("id") ON DELETE RESTRICT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "atribuicao_financeira" ADD FOREIGN KEY ("atribuida_por_usuario_id") REFERENCES "usuarios" ("id") ON DELETE RESTRICT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TYPE "papel_aprovador" RENAME VALUE 'FINANCEIRO' TO 'GESTOR_FINANCEIRO';

COMMENT ON TABLE "atribuicao_financeira" IS 'Gestor Financeiro: no maximo um Gestor ativo com a responsabilidade financeira; tabela vazia e posicao vaga. Somente o Capitao atribui, transfere ou retira. O Gestor Financeiro nao e desativado nem troca de Perfil antes de a responsabilidade ser retirada ou transferida.';

COMMENT ON TABLE "perfis" IS 'Cinco papeis oficiais. A responsabilidade financeira e uma atribuicao do Gestor, nao um Perfil. O catalogo e as permissoes nao anulam regras obrigatorias de negocio e contexto.';

COMMENT ON TABLE "perfil_permissoes" IS 'Relacao N:N. O acesso financeiro vem da atribuicao financeira, nunca do Perfil Gestor.';

COMMENT ON TABLE "aprovacoes_compra" IS 'Uma decisao por papel e por revisao. Apenas duas aprovacoes positivas (Capitao e Gestor Financeiro) liberam a compra.';

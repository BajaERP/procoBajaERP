-- RA numérico e troca obrigatória da Senha provisória (issue 07 do backend do módulo 1).
-- RA e SIAPE passam a aceitar só dígitos. Quem recebe uma Senha provisória (cadastro, redefinição ou Capitão
-- inicial) precisa trocá-la antes de usar os módulos, e a redefinição encerra as sessões abertas.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM usuarios WHERE ra !~ '^[0-9]{1,20}$') THEN
        RAISE EXCEPTION USING
            MESSAGE = 'V7 aborted: there are usuarios whose RA is not numeric.',
            HINT = 'Correct those RAs to the numeric RA or SIAPE before migrating.';
    END IF;
END;
$$;

ALTER TABLE usuarios
    ADD CONSTRAINT chk_usuario_ra_numerico CHECK (ra ~ '^[0-9]{1,20}$'),
    ADD COLUMN troca_de_senha_pendente boolean NOT NULL DEFAULT false,
    ADD COLUMN versao_da_senha integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN usuarios.ra IS 'RA do aluno ou SIAPE do Orientador: de 1 a 20 digitos';
COMMENT ON COLUMN usuarios.troca_de_senha_pendente IS
    'Verdadeiro enquanto a senha atual for provisoria: o Usuario so acessa a troca da propria senha';
COMMENT ON COLUMN usuarios.versao_da_senha IS
    'Incrementada a cada redefinicao pelo Capitao ou Gestor; sessoes abertas com versao anterior sao encerradas';

ALTER TABLE usuarios
    DROP CONSTRAINT ck_usuarios_vinculo_financeiro,
    DROP CONSTRAINT ck_usuarios_gestor_nao_proprio,
    DROP CONSTRAINT fk_usuarios_gestor,
    DROP CONSTRAINT ck_usuarios_perfil;

DROP INDEX idx_usuarios_gestor_id;

UPDATE usuarios
SET perfil = 'GESTOR_FINANCEIRO'
WHERE perfil = 'FINANCEIRO';

ALTER TABLE usuarios
    DROP COLUMN gestor_id;

ALTER TABLE usuarios
    ADD CONSTRAINT ck_usuarios_perfil CHECK (
        perfil IN ('CAPITAO_ADMIN', 'GESTOR', 'GESTOR_FINANCEIRO', 'LIDER', 'MEMBRO', 'ORIENTADOR')
    );

CREATE UNIQUE INDEX uk_usuarios_gestor_financeiro_ativo
    ON usuarios (perfil)
    WHERE perfil = 'GESTOR_FINANCEIRO' AND ativo = TRUE;

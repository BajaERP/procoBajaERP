CREATE TABLE usuarios (
    id UUID NOT NULL,
    nome VARCHAR(120) NOT NULL,
    ra VARCHAR(20) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    gestor_id UUID,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_usuarios PRIMARY KEY (id),
    CONSTRAINT uk_usuarios_ra UNIQUE (ra),
    CONSTRAINT fk_usuarios_gestor FOREIGN KEY (gestor_id) REFERENCES usuarios (id),
    CONSTRAINT ck_usuarios_nome_nao_vazio CHECK (length(trim(nome)) > 0),
    CONSTRAINT ck_usuarios_ra_nao_vazio CHECK (length(trim(ra)) > 0),
    CONSTRAINT ck_usuarios_perfil CHECK (
        perfil IN ('CAPITAO_ADMIN', 'GESTOR', 'FINANCEIRO', 'LIDER', 'MEMBRO', 'ORIENTADOR')
    ),
    CONSTRAINT ck_usuarios_vinculo_financeiro CHECK (
        (perfil = 'FINANCEIRO' AND gestor_id IS NOT NULL)
        OR (perfil <> 'FINANCEIRO' AND gestor_id IS NULL)
    ),
    CONSTRAINT ck_usuarios_gestor_nao_proprio CHECK (
        gestor_id IS NULL OR gestor_id <> id
    )
);

CREATE INDEX idx_usuarios_gestor_id ON usuarios (gestor_id);

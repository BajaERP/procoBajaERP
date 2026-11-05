package com.procobajaerp.backend.equipe.service;

import static com.procobajaerp.backend.auditoria.service.AuditoriaService.detalhes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.auditoria.service.AuditoriaService;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Ra;
import com.procobajaerp.backend.equipe.domain.Senha;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.repository.PerfilRepository;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.shared.RegraDeNegocioException;

/**
 * Cria o primeiro Capitão na inicialização, a partir das variáveis {@code PROCOBAJA_CAPITAO_INICIAL_*}, quando
 * não existe nenhum Capitão ativo. Sem ele, ninguém conseguiria cadastrar os demais Usuários.
 */
@Component
@EnableConfigurationProperties(CapitaoInicial.Propriedades.class)
public class CapitaoInicial implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(CapitaoInicial.class);

    private final Propriedades propriedades;
    private final UsuarioRepository usuarios;
    private final PerfilRepository perfis;
    private final PasswordEncoder codificador;
    private final AuditoriaService auditoria;

    public CapitaoInicial(Propriedades propriedades, UsuarioRepository usuarios, PerfilRepository perfis,
            PasswordEncoder codificador, AuditoriaService auditoria) {
        this.propriedades = propriedades;
        this.usuarios = usuarios;
        this.perfis = perfis;
        this.codificador = codificador;
        this.auditoria = auditoria;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        criarSeNecessario();
    }

    @Transactional
    public void criarSeNecessario() {
        if (usuarios.countByPerfilNomeAndAtivoTrue(Perfil.CAPITAO_ADMIN) > 0) {
            return;
        }
        if (!propriedades.configurado()) {
            log.warn("Não há Capitão ativo e o Capitão inicial não foi configurado: defina PROCOBAJA_CAPITAO_INICIAL_RA, "
                    + "PROCOBAJA_CAPITAO_INICIAL_NOME e PROCOBAJA_CAPITAO_INICIAL_SENHA para administrar o ERP.");
            return;
        }
        String ra;
        try {
            ra = Ra.validar(propriedades.ra());
        } catch (RegraDeNegocioException e) {
            log.error("Capitão inicial não criado: PROCOBAJA_CAPITAO_INICIAL_RA é inválido. {}", e.getMessage());
            return;
        }
        try {
            Senha.validar(propriedades.senha());
        } catch (RegraDeNegocioException e) {
            log.error("Capitão inicial não criado: PROCOBAJA_CAPITAO_INICIAL_SENHA é inválida. {}", e.getMessage());
            return;
        }
        if (usuarios.existsByRa(ra)) {
            log.error("Capitão inicial não criado: o RA {} já pertence a outro Usuário.", ra);
            return;
        }
        Usuario capitao = usuarios.save(new Usuario(ra, propriedades.nome().strip(),
                codificador.encode(propriedades.senha()), perfis.findByNome(Perfil.CAPITAO_ADMIN).orElseThrow(), null, true));
        auditoria.registrar(null, Entidades.USUARIO, capitao.getId(), "CADASTRADO",
                detalhes("perfil", Perfil.CAPITAO_ADMIN, "origem", "CAPITAO_INICIAL", "ativo", true));
        log.info("Capitão inicial criado com o RA {}.", ra);
    }

    @ConfigurationProperties("procobaja.capitao-inicial")
    public record Propriedades(String ra, String nome, String senha) {

        boolean configurado() {
            return ra != null && !ra.isBlank() && nome != null && !nome.isBlank() && senha != null && !senha.isBlank();
        }
    }
}

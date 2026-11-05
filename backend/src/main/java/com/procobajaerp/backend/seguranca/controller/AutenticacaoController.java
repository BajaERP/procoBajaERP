package com.procobajaerp.backend.seguranca.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.procobajaerp.backend.equipe.domain.Ra;
import com.procobajaerp.backend.equipe.service.ContaService;
import com.procobajaerp.backend.seguranca.CredenciaisInvalidasException;
import com.procobajaerp.backend.seguranca.LimiteDeTentativas;
import com.procobajaerp.backend.seguranca.UsuarioAutenticado;
import com.procobajaerp.backend.seguranca.dto.LoginRequisicao;
import com.procobajaerp.backend.seguranca.dto.TrocaDeSenhaRequisicao;
import com.procobajaerp.backend.seguranca.dto.UsuarioAtualResposta;

/** Login, Usuário atual e troca da própria senha. O logout é {@code POST /api/auth/logout}, tratado pelo Spring Security. */
@RestController
@RequestMapping("/api/auth")
public class AutenticacaoController {

    private final AuthenticationManager autenticador;
    private final LimiteDeTentativas limite;
    private final ContaService contas;
    private final CsrfTokenRepository repositorioDeCsrf;
    private final SecurityContextRepository repositorioDeContexto = new HttpSessionSecurityContextRepository();

    public AutenticacaoController(AuthenticationManager autenticador, LimiteDeTentativas limite, ContaService contas,
            CsrfTokenRepository repositorioDeCsrf) {
        this.autenticador = autenticador;
        this.limite = limite;
        this.contas = contas;
        this.repositorioDeCsrf = repositorioDeCsrf;
    }

    /**
     * O frontend chama antes do primeiro POST só para receber o cookie XSRF-TOKEN; depois lê o cookie e reenvia o
     * valor no cabeçalho X-XSRF-TOKEN de cada requisição que altera dados.
     */
    @GetMapping("/csrf")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void csrf() {
    }

    @PostMapping("/login")
    public UsuarioAtualResposta login(@Valid @RequestBody LoginRequisicao dados, HttpServletRequest requisicao,
            HttpServletResponse resposta) {
        String ra = Ra.normalizar(dados.ra());
        limite.exigirTentativaLiberada(ra);
        Authentication autenticacao;
        try {
            autenticacao = autenticador.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(ra, dados.senha()));
        } catch (AuthenticationException e) {
            limite.registrarErro(ra);
            throw new CredenciaisInvalidasException();
        }
        limite.registrarAcerto(ra);

        // Troca o id da sessão no login para evitar fixação de sessão.
        requisicao.getSession();
        requisicao.changeSessionId();
        SecurityContext contexto = SecurityContextHolder.createEmptyContext();
        contexto.setAuthentication(autenticacao);
        SecurityContextHolder.setContext(contexto);
        repositorioDeContexto.saveContext(contexto, requisicao, resposta);
        // Token CSRF novo a cada login, para que um token obtido antes não sirva na sessão autenticada.
        repositorioDeCsrf.saveToken(repositorioDeCsrf.generateToken(requisicao), requisicao, resposta);
        return UsuarioAtualResposta.de((UsuarioAutenticado) autenticacao.getPrincipal());
    }

    @GetMapping("/eu")
    public UsuarioAtualResposta eu(@AuthenticationPrincipal UsuarioAutenticado eu) {
        return UsuarioAtualResposta.de(eu);
    }

    @PutMapping("/senha")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void trocarSenha(@AuthenticationPrincipal UsuarioAutenticado eu, @Valid @RequestBody TrocaDeSenhaRequisicao dados) {
        contas.alterarPropriaSenha(eu.getId(), dados.senhaAtual(), dados.novaSenha());
    }
}

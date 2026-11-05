package com.procobajaerp.backend.seguranca;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.procobajaerp.backend.equipe.service.ContaService;

/** Procura o Usuário do login pelo RA. Desativados são recusados pela verificação de conta habilitada. */
class CarregadorDeUsuarios implements UserDetailsService {

    private final ContaService contas;

    CarregadorDeUsuarios(ContaService contas) {
        this.contas = contas;
    }

    @Override
    public UserDetails loadUserByUsername(String ra) {
        return contas.buscarPorRa(ra)
                .map(UsuarioAutenticado::new)
                .orElseThrow(() -> new UsernameNotFoundException("RA não cadastrado."));
    }
}

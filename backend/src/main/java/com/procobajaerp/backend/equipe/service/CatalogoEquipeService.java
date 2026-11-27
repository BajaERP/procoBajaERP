package com.procobajaerp.backend.equipe.service;

import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.repository.SubsistemaRepository;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.shared.NaoEncontradoException;

/**
 * Consulta somente leitura de Usuários e Subsistemas para outros módulos, sem expor os repositories de {@code equipe}.
 */
@Service
@Transactional(readOnly = true)
public class CatalogoEquipeService {

    private final UsuarioRepository usuarios;
    private final SubsistemaRepository subsistemas;

    public CatalogoEquipeService(UsuarioRepository usuarios, SubsistemaRepository subsistemas) {
        this.usuarios = usuarios;
        this.subsistemas = subsistemas;
    }

    public Usuario buscarUsuarioCompleto(Long id) {
        return usuarios.buscarCompleto(id)
                .orElseThrow(() -> new NaoEncontradoException("Usuário não encontrado."));
    }

    public List<Usuario> listarUsuariosCompletos() {
        return usuarios.listarCompletos();
    }

    public List<Usuario> buscarUsuariosCompletos(Collection<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return usuarios.buscarCompletosPorIds(ids);
    }

    public List<Subsistema> listarSubsistemas() {
        return subsistemas.listarComLider();
    }

    public List<Subsistema> buscarSubsistemas(Collection<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return subsistemas.findAllById(ids);
    }
}

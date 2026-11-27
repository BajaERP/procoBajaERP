package com.procobajaerp.backend.atividades.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.procobajaerp.backend.atividades.domain.Sprint;

public interface SprintRepository extends JpaRepository<Sprint, Long> {

    List<Sprint> findAllByOrderByInicioAscIdAsc();
}

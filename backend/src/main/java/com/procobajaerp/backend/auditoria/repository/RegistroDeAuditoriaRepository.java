package com.procobajaerp.backend.auditoria.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.procobajaerp.backend.auditoria.domain.RegistroDeAuditoria;

public interface RegistroDeAuditoriaRepository extends JpaRepository<RegistroDeAuditoria, Long> {
}

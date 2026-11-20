package com.clinica.sangabriel.repository;

import com.clinica.sangabriel.model.Medico;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MedicoRepository extends JpaRepository<Medico, Integer> {
    List<Medico> findByEspecialidadIdEspecialidad(Integer idEspecialidad);
    boolean existsByDniAndIdMedicoNot(String dni, Integer idMedico);
    boolean existsByCmpAndIdMedicoNot(String cmp, Integer idMedico);
    boolean existsByEspecialidad_IdEspecialidad(Integer idEspecialidad);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from Medico m where m.idMedico = :id")
    Optional<Medico> bloquearPorId(@Param("id") Integer id);
}

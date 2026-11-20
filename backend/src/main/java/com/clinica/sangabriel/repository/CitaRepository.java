package com.clinica.sangabriel.repository;

import com.clinica.sangabriel.model.Cita;
import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CitaRepository extends JpaRepository<Cita, Integer> {
    List<Cita> findByFechaCita(LocalDate fechaCita);
    boolean existsByPaciente_IdPaciente(Integer idPaciente);
    boolean existsByMedico_IdMedico(Integer idMedico);
    boolean existsByMedico_IdMedicoAndFechaCitaAndHoraCitaAndEstadoNotAndIdCitaNot(
        Integer idMedico, LocalDate fecha, LocalTime hora, Cita.EstadoCita estado, Integer idCita);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Cita c where c.idCita = :id")
    Optional<Cita> bloquearPorId(@Param("id") Integer id);
}

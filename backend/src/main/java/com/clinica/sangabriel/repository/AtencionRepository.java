package com.clinica.sangabriel.repository;
import com.clinica.sangabriel.model.Atencion;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AtencionRepository extends JpaRepository<Atencion, Integer> {
    boolean existsByCita_IdCita(Integer idCita);
}

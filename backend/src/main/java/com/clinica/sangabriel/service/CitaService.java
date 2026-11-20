package com.clinica.sangabriel.service;
import com.clinica.sangabriel.dto.CitaRequest;
import com.clinica.sangabriel.dto.CitaResponse;
import com.clinica.sangabriel.model.*;
import com.clinica.sangabriel.repository.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(isolation = Isolation.READ_COMMITTED)
public class CitaService {
    private final CitaRepository citas;
    private final PacienteRepository pacientes;
    private final MedicoRepository medicos;
    public CitaService(CitaRepository citas, PacienteRepository pacientes, MedicoRepository medicos) {
        this.citas = citas; this.pacientes = pacientes; this.medicos = medicos;
    }
    @Transactional(readOnly = true)
    public List<CitaResponse> listarTodas() { return citas.findAll().stream().map(CitaResponse::desde).toList(); }
    @Transactional(readOnly = true)
    public List<CitaResponse> listarPorFecha(LocalDate fecha) {
        return citas.findByFechaCita(fecha).stream().map(CitaResponse::desde).toList();
    }
    public CitaResponse registrar(CitaRequest datos) { return guardar(new Cita(), datos); }
    public CitaResponse actualizar(Integer id, CitaRequest datos) {
        Cita c = citas.bloquearPorId(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "La cita no existe"));
        if (c.getEstado() == Cita.EstadoCita.ATENDIDA || c.getEstado() == Cita.EstadoCita.CANCELADA)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Solo se editan citas pendientes o confirmadas");
        return guardar(c, datos);
    }
    private CitaResponse guardar(Cita c, CitaRequest d) {
        if (d == null || d.idPaciente() == null || d.idMedico() == null || d.fechaCita() == null || d.horaCita() == null
                || d.idPaciente() <= 0 || d.idMedico() <= 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Faltan paciente, médico, fecha u hora válidos");
        if (d.fechaCita().atTime(d.horaCita()).isBefore(LocalDateTime.now()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se pueden reservar citas en el pasado");
        if (d.motivoConsulta() != null && d.motivoConsulta().trim().length() > 255)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El motivo no debe exceder 255 caracteres");
        Paciente p = pacientes.findById(d.idPaciente()).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "El paciente no existe"));
        // Serializa las reservas del mismo médico para evitar dobles turnos simultáneos.
        Medico m = medicos.bloquearPorId(d.idMedico()).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "El médico no existe"));
        if (!Boolean.TRUE.equals(m.getEstado()) || !Boolean.TRUE.equals(m.getEspecialidad().getEstado()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El médico o su especialidad están inactivos");
        int propio = c.getIdCita() == null ? -1 : c.getIdCita();
        if (citas.existsByMedico_IdMedicoAndFechaCitaAndHoraCitaAndEstadoNotAndIdCitaNot(
                d.idMedico(), d.fechaCita(), d.horaCita(), Cita.EstadoCita.CANCELADA, propio))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El médico ya tiene una cita a esa hora");
        c.setPaciente(p); c.setMedico(m); c.setFechaCita(d.fechaCita()); c.setHoraCita(d.horaCita());
        c.setMotivoConsulta(d.motivoConsulta() == null ? null : d.motivoConsulta().trim());
        return CitaResponse.desde(citas.saveAndFlush(c));
    }
    public Optional<CitaResponse> actualizarEstado(Integer id, Cita.EstadoCita estado) {
        if (estado == null || estado == Cita.EstadoCita.ATENDIDA)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Para marcar ATENDIDA debes registrar una atención");
        return citas.bloquearPorId(id).map(c -> {
            if (c.getEstado() == Cita.EstadoCita.ATENDIDA || c.getEstado() == Cita.EstadoCita.CANCELADA)
                throw new ResponseStatusException(HttpStatus.CONFLICT, "La cita está cerrada; registra otra si necesitas un nuevo turno");
            c.setEstado(estado); return CitaResponse.desde(citas.saveAndFlush(c));
        });
    }
}

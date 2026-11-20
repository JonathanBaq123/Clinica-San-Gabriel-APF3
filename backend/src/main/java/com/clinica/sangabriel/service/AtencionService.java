package com.clinica.sangabriel.service;
import com.clinica.sangabriel.model.Atencion;
import com.clinica.sangabriel.model.Cita;
import com.clinica.sangabriel.repository.AtencionRepository;
import com.clinica.sangabriel.repository.CitaRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class AtencionService {
    private final AtencionRepository atenciones;
    private final CitaRepository citas;
    public AtencionService(AtencionRepository atenciones, CitaRepository citas) {
        this.atenciones = atenciones; this.citas = citas;
    }
    @Transactional(readOnly = true)
    public List<Atencion> listarTodas() { return atenciones.findAll(); }
    public Atencion registrar(Atencion a) {
        if (a.getCita() == null || a.getCita().getIdCita() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Indica cita.idCita");
        Cita c = citas.bloquearPorId(a.getCita().getIdCita()).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "La cita no existe"));
        if (c.getEstado() == Cita.EstadoCita.CANCELADA || c.getEstado() == Cita.EstadoCita.ATENDIDA)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La cita está cancelada o ya fue atendida");
        if (atenciones.existsByCita_IdCita(c.getIdCita()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La cita ya tiene una atención");
        a.setIdAtencion(null); a.setCita(c); a.setDiagnostico(a.getDiagnostico().trim());
        Atencion guardada = atenciones.saveAndFlush(a);
        c.setEstado(Cita.EstadoCita.ATENDIDA);
        citas.saveAndFlush(c); // Ambos cambios están dentro de la misma transacción.
        return guardada;
    }
    public Atencion actualizar(Integer id, Atencion a) {
        Atencion actual = atenciones.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "La atención no existe"));
        if (a.getCita() == null || !actual.getCita().getIdCita().equals(a.getCita().getIdCita()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede cambiar la cita de una atención");
        actual.setDiagnostico(a.getDiagnostico().trim()); actual.setSignosVitales(a.getSignosVitales());
        actual.setTratamientoReceta(a.getTratamientoReceta()); actual.setObservaciones(a.getObservaciones());
        return atenciones.saveAndFlush(actual);
    }
}

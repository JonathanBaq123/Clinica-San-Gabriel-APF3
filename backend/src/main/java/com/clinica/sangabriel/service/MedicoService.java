package com.clinica.sangabriel.service;
import com.clinica.sangabriel.model.Especialidad;
import com.clinica.sangabriel.model.Medico;
import com.clinica.sangabriel.repository.*;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class MedicoService {
    private final MedicoRepository medicos;
    private final EspecialidadRepository especialidades;
    private final CitaRepository citas;
    public MedicoService(MedicoRepository medicos, EspecialidadRepository especialidades, CitaRepository citas) {
        this.medicos = medicos; this.especialidades = especialidades; this.citas = citas;
    }
    @Transactional(readOnly = true)
    public List<Medico> listarTodos() { return medicos.findAll(); }
    @Transactional(readOnly = true)
    public List<Medico> listarPorEspecialidad(Integer id) { return medicos.findByEspecialidadIdEspecialidad(id); }
    public Medico registrar(Medico m) { m.setIdMedico(null); return guardar(m, null); }
    public Medico actualizar(Integer id, Medico m) {
        Medico actual = medicos.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "El médico no existe"));
        m.setIdMedico(id); return guardar(m, actual.getEspecialidad().getIdEspecialidad());
    }
    private Medico guardar(Medico m, Integer especialidadAnterior) {
        if (m.getEspecialidad() == null || m.getEspecialidad().getIdEspecialidad() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Indica especialidad.idEspecialidad");
        Especialidad e = especialidades.findById(m.getEspecialidad().getIdEspecialidad()).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "La especialidad no existe"));
        if (!Boolean.TRUE.equals(e.getEstado()) && !e.getIdEspecialidad().equals(especialidadAnterior))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La especialidad está inactiva");
        int propio = m.getIdMedico() == null ? -1 : m.getIdMedico();
        m.setDni(m.getDni().trim()); m.setCmp(m.getCmp().trim());
        if (medicos.existsByDniAndIdMedicoNot(m.getDni(), propio))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un médico con ese DNI");
        if (medicos.existsByCmpAndIdMedicoNot(m.getCmp(), propio))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un médico con ese CMP");
        m.setNombres(m.getNombres().trim()); m.setApellidos(m.getApellidos().trim()); m.setEspecialidad(e);
        return medicos.saveAndFlush(m);
    }
    public void eliminar(Integer id) {
        Medico m = medicos.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "El médico no existe"));
        if (citas.existsByMedico_IdMedico(id)) throw new ResponseStatusException(
            HttpStatus.CONFLICT, "El médico tiene citas; puedes desactivarlo al editar");
        medicos.delete(m); medicos.flush();
    }
}

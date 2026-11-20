package com.clinica.sangabriel.service;
import com.clinica.sangabriel.model.Especialidad;
import com.clinica.sangabriel.repository.EspecialidadRepository;
import com.clinica.sangabriel.repository.MedicoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class EspecialidadService {
    private final EspecialidadRepository especialidades;
    private final MedicoRepository medicos;
    public EspecialidadService(EspecialidadRepository especialidades, MedicoRepository medicos) {
        this.especialidades = especialidades; this.medicos = medicos;
    }
    @Transactional(readOnly = true)
    public List<Especialidad> listarTodas() { return especialidades.findAll(); }
    public Especialidad registrar(Especialidad e) { e.setIdEspecialidad(null); return guardar(e); }
    public Especialidad actualizar(Integer id, Especialidad e) {
        if (!especialidades.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La especialidad no existe");
        e.setIdEspecialidad(id); return guardar(e);
    }
    private Especialidad guardar(Especialidad e) {
        e.setNombre(e.getNombre().trim()); return especialidades.saveAndFlush(e);
    }
    public void eliminar(Integer id) {
        Especialidad e = especialidades.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "La especialidad no existe"));
        if (medicos.existsByEspecialidad_IdEspecialidad(id)) throw new ResponseStatusException(
            HttpStatus.CONFLICT, "La especialidad tiene médicos; puedes desactivarla al editar");
        especialidades.delete(e); especialidades.flush();
    }
}

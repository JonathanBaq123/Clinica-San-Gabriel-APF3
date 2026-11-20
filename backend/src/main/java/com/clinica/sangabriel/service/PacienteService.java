package com.clinica.sangabriel.service;

import com.clinica.sangabriel.model.Paciente;
import com.clinica.sangabriel.repository.PacienteRepository;
import com.clinica.sangabriel.repository.CitaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class PacienteService {
    private final PacienteRepository pacientes;
    private final CitaRepository citas;
    public PacienteService(PacienteRepository pacientes, CitaRepository citas) {
        this.pacientes = pacientes; this.citas = citas;
    }
    @Transactional(readOnly = true)
    public List<Paciente> listarTodos() { return pacientes.findAll(); }
    @Transactional(readOnly = true)
    public Optional<Paciente> buscarPorDni(String dni) { return pacientes.findByDni(dni.trim()); }
    public Paciente registrar(Paciente p) { p.setIdPaciente(null); return guardar(p); }
    public Paciente actualizar(Integer id, Paciente p) {
        Paciente actual = pacientes.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "El paciente no existe"));
        p.setIdPaciente(id); p.setFechaRegistro(actual.getFechaRegistro()); return guardar(p);
    }
    private Paciente guardar(Paciente p) {
        p.setDni(p.getDni().trim()); p.setNombres(p.getNombres().trim()); p.setApellidos(p.getApellidos().trim());
        if (p.getSexo() != null && p.getSexo() != 'M' && p.getSexo() != 'F') {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sexo debe ser M, F o vacío");
        }
        pacientes.findByDni(p.getDni()).filter(x -> !x.getIdPaciente().equals(p.getIdPaciente())).ifPresent(x -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un paciente con ese DNI");
        });
        return pacientes.saveAndFlush(p);
    }
    public void eliminar(Integer id) {
        Paciente p = pacientes.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "El paciente no existe"));
        if (citas.existsByPaciente_IdPaciente(id)) throw new ResponseStatusException(
            HttpStatus.CONFLICT, "El paciente tiene citas; se conserva su historial");
        pacientes.delete(p); pacientes.flush();
    }
}

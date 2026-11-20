package com.clinica.sangabriel;

import com.clinica.sangabriel.model.*;
import com.clinica.sangabriel.repository.*;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate;

/** Servidor real con H2 temporal para las pruebas de navegador. No carga MySQL. */
public class BrowserTestApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(SanGabrielApplication.class);
        app.setAdditionalProfiles("test");
        ConfigurableApplicationContext ctx = app.run(args);
        RolRepository roles = ctx.getBean(RolRepository.class);
        UsuarioRepository usuarios = ctx.getBean(UsuarioRepository.class);
        PasswordEncoder encoder = ctx.getBean(PasswordEncoder.class);
        for (String nombre : new String[]{"ADMIN", "RECEPCION", "MEDICO"}) {
            Rol rol = roles.save(new Rol(null, nombre));
            usuarios.save(new Usuario(null, "apf3." + nombre.toLowerCase(), encoder.encode("DemoClinica123!"), true, rol));
        }
        EspecialidadRepository especialidades = ctx.getBean(EspecialidadRepository.class);
        Especialidad e = especialidades.save(new Especialidad(null, "Medicina General APF3", "Consultas generales de demostración", true));
        especialidades.save(new Especialidad(null, "Pediatría APF3", "Datos ficticios", true));
        Medico m = new Medico(); m.setDni("90000011"); m.setNombres("Elena"); m.setApellidos("Demo Ríos");
        m.setCmp("APF3001"); m.setCorreo("demo.medico@example.test"); m.setEspecialidad(e); m.setEstado(true);
        ctx.getBean(MedicoRepository.class).save(m);
        Paciente p = new Paciente(); p.setDni("90000021"); p.setNombres("Lucía"); p.setApellidos("Demo Campos");
        p.setFechaNacimiento(LocalDate.of(1998,4,12)); p.setSexo('F'); p.setCorreo("demo.paciente@example.test");
        ctx.getBean(PacienteRepository.class).save(p);
        System.out.println("Servidor de pruebas de navegador listo: http://localhost:8080");
    }
}

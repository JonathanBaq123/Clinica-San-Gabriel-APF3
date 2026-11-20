package com.clinica.sangabriel;

import com.clinica.sangabriel.model.*;
import com.clinica.sangabriel.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Map;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired PasswordEncoder passwords;
    @Autowired UsuarioRepository usuarios;
    @Autowired RolRepository roles;
    @Autowired PacienteRepository pacientes;
    @Autowired MedicoRepository medicos;
    @Autowired EspecialidadRepository especialidades;
    @Autowired CitaRepository citas;
    @Autowired AtencionRepository atenciones;
    String admin, recepcion, medico;

    @BeforeEach
    void preparar() throws Exception {
        atenciones.deleteAll(); citas.deleteAll(); medicos.deleteAll(); pacientes.deleteAll();
        especialidades.deleteAll(); usuarios.deleteAll(); roles.deleteAll();
        for (String nombre : new String[]{"ADMIN", "RECEPCION", "MEDICO"}) {
            Rol rol = roles.save(new Rol(null, nombre));
            usuarios.save(new Usuario(null, nombre.toLowerCase(), passwords.encode("PruebaClinica123!"), true, rol));
        }
        admin = login("admin"); recepcion = login("recepcion"); medico = login("medico");
    }

    String login(String usuario) throws Exception {
        return respuesta(post("/api/auth/login"), null, Map.of("username", usuario, "password", "PruebaClinica123!"), 200).get("token").asText();
    }
    JsonNode respuesta(MockHttpServletRequestBuilder request, String token, Object datos, int status) throws Exception {
        if (token != null) request.header("Authorization", "Bearer " + token);
        if (datos != null) request.contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(datos));
        String body = mvc.perform(request).andExpect(status().is(status)).andReturn().getResponse().getContentAsString();
        return body.isBlank() ? json.nullNode() : json.readTree(body);
    }
    JsonNode especialidad() throws Exception {
        return respuesta(post("/api/especialidades"), admin, Map.of("nombre", "General prueba", "descripcion", "Prueba", "estado", true), 201);
    }
    Map<String, Object> datosPaciente(String dni) {
        return Map.of("dni", dni, "nombres", "Paciente", "apellidos", "Prueba", "fechaNacimiento", "2000-01-01", "sexo", "F", "correo", "paciente@example.test");
    }
    JsonNode paciente() throws Exception { return respuesta(post("/api/pacientes"), recepcion, datosPaciente("90000001"), 201); }
    Map<String, Object> datosMedico(int idEspecialidad) {
        return Map.of("dni", "90000002", "nombres", "Medico", "apellidos", "Prueba", "cmp", "TEST001", "estado", true, "especialidad", Map.of("idEspecialidad", idEspecialidad));
    }
    JsonNode profesional(int idEspecialidad) throws Exception { return respuesta(post("/api/medicos"), admin, datosMedico(idEspecialidad), 201); }
    Map<String, Object> datosCita(int idPaciente, int idMedico) {
        return Map.of("idPaciente", idPaciente, "idMedico", idMedico, "fechaCita", LocalDate.now().plusDays(1).toString(), "horaCita", "10:30:00", "motivoConsulta", "Prueba de integración");
    }

    @Test
    void corsLoginYPermisosSeAplicanEnElServidor() throws Exception {
        mvc.perform(options("/api/pacientes").header("Origin", "http://localhost:4200")
            .header("Access-Control-Request-Method", "POST").header("Access-Control-Request-Headers", "authorization,content-type"))
            .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4200"));
        mvc.perform(options("/api/pacientes").header("Origin", "http://ejemplo.invalid")
            .header("Access-Control-Request-Method", "POST")).andExpect(status().isForbidden());
        mvc.perform(get("/api/pacientes")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/pacientes").header("Authorization", "Bearer token-invalido")).andExpect(status().isUnauthorized());
        respuesta(post("/api/auth/login"), null, Map.of("username", "admin", "password", "incorrecta"), 401);
        mvc.perform(get("/api/usuarios/me").header("Authorization", "Bearer " + admin))
            .andExpect(jsonPath("$.rol").value("ADMIN")).andExpect(jsonPath("$.password").doesNotExist());
        respuesta(get("/api/medicos"), recepcion, null, 200);
        respuesta(post("/api/medicos"), recepcion, datosMedico(1), 403);
        respuesta(get("/api/atenciones"), recepcion, null, 403);
        respuesta(post("/api/pacientes"), medico, datosPaciente("90000004"), 403);
    }

    @Test
    void crudDeTablasBasicasValidaDuplicadosYEliminaSoloSinRelaciones() throws Exception {
        int e = especialidad().get("idEspecialidad").asInt();
        int m = profesional(e).get("idMedico").asInt();
        int p = paciente().get("idPaciente").asInt();
        respuesta(post("/api/pacientes"), recepcion, datosPaciente("90000001"), 409);
        respuesta(post("/api/pacientes"), recepcion, datosPaciente("123"), 400);
        respuesta(post("/api/medicos"), admin, datosMedico(e), 409);
        respuesta(put("/api/medicos/" + m), admin, datosMedico(e), 200);
        respuesta(put("/api/pacientes/" + p), recepcion, datosPaciente("90000003"), 200);
        respuesta(put("/api/especialidades/" + e), admin, Map.of("nombre", "Actualizada", "estado", true), 200);
        assertThat(respuesta(get("/api/pacientes?dni=90000003"), recepcion, null, 200).size()).isEqualTo(1);
        assertThat(respuesta(get("/api/medicos?idEspecialidad=" + e), recepcion, null, 200).size()).isEqualTo(1);
        respuesta(delete("/api/especialidades/" + e), admin, null, 409);
        respuesta(delete("/api/medicos/" + m), admin, null, 204);
        respuesta(delete("/api/especialidades/" + e), admin, null, 204);
        respuesta(delete("/api/pacientes/" + p), recepcion, null, 204);
        assertThat(pacientes.count()).isZero(); assertThat(medicos.count()).isZero();
    }

    @Test
    void citaAtencionYPersistenciaMantienenLaIntegridad() throws Exception {
        int e = especialidad().get("idEspecialidad").asInt();
        int m = profesional(e).get("idMedico").asInt();
        int p = paciente().get("idPaciente").asInt();
        JsonNode c = respuesta(post("/api/citas"), recepcion, datosCita(p,m), 201);
        int id = c.get("idCita").asInt();
        assertThat(c.get("idPaciente").asInt()).isEqualTo(p);
        assertThat(c.has("paciente")).isFalse(); // El DTO de citas es plano.
        respuesta(post("/api/citas"), recepcion, datosCita(p,m), 409);
        respuesta(put("/api/citas/" + id), recepcion, datosCita(p,m), 200);
        respuesta(patch("/api/citas/" + id + "/estado?nuevoEstado=CONFIRMADA"), recepcion, null, 200);
        respuesta(patch("/api/citas/" + id + "/estado?nuevoEstado=ATENDIDA"), recepcion, null, 400);
        respuesta(delete("/api/pacientes/" + p), recepcion, null, 409);
        respuesta(delete("/api/medicos/" + m), admin, null, 409);
        Map<String, Object> invalida = Map.of("cita", Map.of("idCita", id), "diagnostico", "  ");
        respuesta(post("/api/atenciones"), medico, invalida, 400);
        assertThat(citas.findById(id).orElseThrow().getEstado()).isEqualTo(Cita.EstadoCita.CONFIRMADA);
        Map<String, Object> atencion = Map.of("cita", Map.of("idCita", id), "diagnostico", "Prueba académica", "observaciones", "Datos ficticios");
        JsonNode a = respuesta(post("/api/atenciones"), medico, atencion, 201);
        assertThat(a.get("cita").get("paciente").get("idPaciente").asInt()).isEqualTo(p);
        assertThat(citas.findById(id).orElseThrow().getEstado()).isEqualTo(Cita.EstadoCita.ATENDIDA);
        respuesta(post("/api/atenciones"), medico, atencion, 409);
        respuesta(put("/api/atenciones/" + a.get("idAtencion").asInt()), medico, atencion, 200);
        respuesta(patch("/api/citas/" + id + "/estado?nuevoEstado=CANCELADA"), recepcion, null, 409);
        assertThat(atenciones.count()).isEqualTo(1);
    }

    @Test
    void cancelarLiberaElTurnoYBloqueaLaAtencion() throws Exception {
        int e = especialidad().get("idEspecialidad").asInt(); int m = profesional(e).get("idMedico").asInt(); int p = paciente().get("idPaciente").asInt();
        int id = respuesta(post("/api/citas"), recepcion, datosCita(p,m), 201).get("idCita").asInt();
        respuesta(patch("/api/citas/" + id + "/estado?nuevoEstado=CANCELADA"), recepcion, null, 200);
        respuesta(post("/api/atenciones"), medico, Map.of("cita", Map.of("idCita", id), "diagnostico", "Prueba"), 409);
        respuesta(post("/api/citas"), recepcion, datosCita(p,m), 201);
        assertThat(citas.count()).isEqualTo(2);
        assertThat(atenciones.count()).isZero();
    }

    @Test
    void dosReservasSimultaneasSoloOcupanElTurnoUnaVez() throws Exception {
        int e = especialidad().get("idEspecialidad").asInt();
        int m = profesional(e).get("idMedico").asInt();
        int p = paciente().get("idPaciente").asInt();
        String body = json.writeValueAsString(datosCita(p, m));
        var inicio = new CountDownLatch(1);
        var ejecutor = Executors.newFixedThreadPool(2);
        try {
            java.util.concurrent.Callable<Integer> reservar = () -> {
                inicio.await(5, TimeUnit.SECONDS);
                return mvc.perform(post("/api/citas").header("Authorization", "Bearer " + recepcion)
                    .contentType(MediaType.APPLICATION_JSON).content(body)).andReturn().getResponse().getStatus();
            };
            var primera = ejecutor.submit(reservar);
            var segunda = ejecutor.submit(reservar);
            inicio.countDown();
            assertThat(List.of(primera.get(10, TimeUnit.SECONDS), segunda.get(10, TimeUnit.SECONDS)))
                .containsExactlyInAnyOrder(201, 409);
            assertThat(citas.count()).isEqualTo(1);
        } finally {
            ejecutor.shutdownNow();
        }
    }
}

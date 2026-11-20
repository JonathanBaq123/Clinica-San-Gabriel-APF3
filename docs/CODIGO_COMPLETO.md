# Código completo por archivo

Cada bloque corresponde al archivo indicado. Las rutas son relativas a la raíz del proyecto. Copiar los archivos completos a sus ubicaciones; no concatenar bloques de distintos archivos. El ZIP incluye además Maven Wrapper y package-lock.json. Los comandos de instalación están en README.md.

## backend/.mvn/wrapper/maven-wrapper.properties

```properties
wrapperVersion=3.3.4
distributionType=only-script
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.10.0/apache-maven-3.10.0-bin.zip
```

## backend/pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.3.5</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.clinica</groupId>
	<artifactId>sangabriel</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name/>
	<description/>
	<url/>
	<licenses>
		<license/>
	</licenses>
	<developers>
		<developer/>
	</developers>
	<scm>
		<connection/>
		<developerConnection/>
		<tag/>
		<url/>
	</scm>
	<properties>
		<java.version>21</java.version>
		<lombok.version>1.18.36</lombok.version>
	</properties>
	<dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
		<dependency>
    		<groupId>org.springframework.security</groupId>
    		<artifactId>spring-security-crypto</artifactId>
		</dependency>
    </dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<executions>
					<execution>
						<id>default-compile</id>
						<phase>compile</phase>
						<goals>
							<goal>compile</goal>
						</goals>
						<configuration>
							<annotationProcessorPaths>
								<path>
									<groupId>org.projectlombok</groupId>
									<artifactId>lombok</artifactId>
								</path>
							</annotationProcessorPaths>
						</configuration>
					</execution>
					<execution>
						<id>default-testCompile</id>
						<phase>test-compile</phase>
						<goals>
							<goal>testCompile</goal>
						</goals>
						<configuration>
							<annotationProcessorPaths>
								<path>
									<groupId>org.projectlombok</groupId>
									<artifactId>lombok</artifactId>
								</path>
							</annotationProcessorPaths>
						</configuration>
					</execution>
				</executions>
			</plugin>
		</plugins>
	</build>

</project>
```

## backend/src/main/java/com/clinica/sangabriel/SanGabrielApplication.java

```java
package com.clinica.sangabriel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SanGabrielApplication {

	public static void main(String[] args) {
		SpringApplication.run(SanGabrielApplication.class, args);
	}

}
```

## backend/src/main/java/com/clinica/sangabriel/config/ApiExceptionHandler.java

```java
package com.clinica.sangabriel.config;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
    private ResponseEntity<Map<String, Object>> error(int status, String message) {
        return ResponseEntity.status(status).body(Map.of(
            "status", status, "message", message, "timestamp", Instant.now().toString()));
    }
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> estado(ResponseStatusException ex) {
        return error(ex.getStatusCode().value(), ex.getReason() == null ? "Solicitud rechazada" : ex.getReason());
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validacion(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage()).distinct().collect(Collectors.joining("; "));
        return error(400, message);
    }
    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<Map<String, Object>> formato(Exception ex) {
        return error(400, "Revisa los campos, identificadores, fechas y estados enviados.");
    }
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> integridad(DataIntegrityViolationException ex) {
        return error(HttpStatus.CONFLICT.value(),
            "No se pudo guardar o eliminar: hay un valor duplicado o registros relacionados. Conserva los datos vinculados.");
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/config/CorsConfig.java

```java
package com.clinica.sangabriel.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setAllowCredentials(false); // El JWT viaja como Bearer, no como cookie.
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/config/DemoUserInitializer.java

```java
package com.clinica.sangabriel.config;

import com.clinica.sangabriel.model.Rol;
import com.clinica.sangabriel.model.Usuario;
import com.clinica.sangabriel.repository.RolRepository;
import com.clinica.sangabriel.repository.UsuarioRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

// Solo se ejecuta cuando DEMO_SEED_ENABLED=true, para pruebas locales.
@Component
@ConditionalOnProperty(name = "demo.seed.enabled", havingValue = "true")
public class DemoUserInitializer implements ApplicationRunner {
    private final RolRepository roles;
    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;

    @Value("${demo.seed.username:}")
    private String username;
    @Value("${demo.seed.password:}")
    private String password;

    public DemoUserInitializer(RolRepository roles, UsuarioRepository usuarios, PasswordEncoder encoder) {
        this.roles = roles;
        this.usuarios = usuarios;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments argumentos) {
        if (username.isBlank() || password.length() < 12) {
            throw new IllegalStateException(
                "Para pruebas, define DEMO_SEED_USERNAME y DEMO_SEED_PASSWORD (12+ caracteres)");
        }
        for (String nombre : new String[]{"ADMIN", "RECEPCION", "MEDICO"}) {
            roles.findByNombre(nombre).orElseGet(() -> {
                Rol rol = new Rol();
                rol.setNombre(nombre);
                return roles.save(rol);
            });
        }
        if (!usuarios.existsByUsername(username)) {
            Usuario usuario = new Usuario();
            usuario.setUsername(username);
            usuario.setPassword(encoder.encode(password));
            usuario.setEstado(true);
            usuario.setRol(roles.findByNombre("RECEPCION").orElseThrow());
            usuarios.save(usuario);
        }
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/config/JwtAuthenticationFilter.java

```java
package com.clinica.sangabriel.config;

import com.clinica.sangabriel.service.JwtService;
import com.clinica.sangabriel.service.UserDetailsServiceImpl;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsServiceImpl usuarios;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsServiceImpl usuarios) {
        this.jwtService = jwtService;
        this.usuarios = usuarios;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                String token = header.substring(7);
                String username = jwtService.extractUsername(token);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails usuario = usuarios.loadUserByUsername(username);
                    if (usuario.isEnabled() && jwtService.isTokenValid(token, usuario)) {
                        UsernamePasswordAuthenticationToken autenticacion =
                            new UsernamePasswordAuthenticationToken(
                                usuario, null, usuario.getAuthorities());
                        autenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(autenticacion);
                    }
                }
            } catch (JwtException | IllegalArgumentException | UsernameNotFoundException ex) {
                // Un JWT invalido nunca autentica al usuario.
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/config/SecurityConfig.java

```java
package com.clinica.sangabriel.config;

import com.clinica.sangabriel.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.Customizer;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsServiceImpl usuarios,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(usuarios);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationProvider provider) {
        return new ProviderManager(provider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtFilter,
            AuthenticationProvider provider) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, exception) ->
                    response.sendError(401, "Autenticacion requerida"))
                .accessDeniedHandler((request, response, exception) ->
                    response.sendError(403, "Sin permisos")))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/api/usuarios/me").authenticated()
                .requestMatchers("/api/atenciones", "/api/atenciones/**").hasAnyRole("ADMIN", "MEDICO")
                .requestMatchers(HttpMethod.GET, "/api/pacientes", "/api/pacientes/**",
                    "/api/medicos", "/api/medicos/**", "/api/especialidades", "/api/especialidades/**",
                    "/api/citas", "/api/citas/**").hasAnyRole("ADMIN", "RECEPCION", "MEDICO")
                .requestMatchers("/api/medicos", "/api/medicos/**",
                    "/api/especialidades", "/api/especialidades/**").hasRole("ADMIN")
                .requestMatchers("/api/pacientes", "/api/pacientes/**",
                    "/api/citas", "/api/citas/**").hasAnyRole("ADMIN", "RECEPCION")
                .anyRequest().denyAll())
            .authenticationProvider(provider)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/controller/AtencionController.java

```java
package com.clinica.sangabriel.controller;

import jakarta.validation.Valid;
import com.clinica.sangabriel.model.Atencion;
import com.clinica.sangabriel.service.AtencionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/atenciones")
public class AtencionController {

    @Autowired
    private AtencionService atencionService;

    @GetMapping
    public ResponseEntity<List<Atencion>> listar() {
        return ResponseEntity.ok(atencionService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<Atencion> crear(@Valid @RequestBody Atencion atencion) {
        return new ResponseEntity<>(atencionService.registrar(atencion), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Atencion> actualizar(@PathVariable Integer id, @Valid @RequestBody Atencion datos) {
        return ResponseEntity.ok(atencionService.actualizar(id, datos));
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/controller/AuthController.java

```java
package com.clinica.sangabriel.controller;

import com.clinica.sangabriel.dto.LoginRequest;
import com.clinica.sangabriel.dto.LoginResponse;
import com.clinica.sangabriel.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request == null || request.getUsername() == null || request.getPassword() == null
                || request.getUsername().isBlank() || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Faltan credenciales");
        }
        try {
            Authentication autenticado = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername().trim(), request.getPassword()));
            String token = jwtService.generateToken((UserDetails) autenticado.getPrincipal());
            return ResponseEntity.ok(new LoginResponse(token));
        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                "Credenciales incorrectas o usuario deshabilitado");
        }
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/controller/CitaController.java

```java
package com.clinica.sangabriel.controller;

import com.clinica.sangabriel.dto.CitaRequest;
import com.clinica.sangabriel.dto.CitaResponse;
import com.clinica.sangabriel.model.Cita;
import com.clinica.sangabriel.service.CitaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final CitaService citaService;

        public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    // GET /api/citas y GET /api/citas?fecha=2026-11-20
     @GetMapping


    public ResponseEntity<List<CitaResponse>> listar(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
         if (fecha != null) {
             return ResponseEntity.ok(citaService.listarPorFecha(fecha));
         }
         return ResponseEntity.ok(citaService.listarTodas());
     }
 
    // POST /api/citas: se envian IDs, no objetos Paciente/Medico completos.
     @PostMapping

    public ResponseEntity<CitaResponse> crear(@RequestBody CitaRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(citaService.registrar(datos));
     }
 
    // PATCH /api/citas/1/estado?nuevoEstado=CANCELADA
     @PatchMapping("/{id}/estado")

    public ResponseEntity<CitaResponse> actualizarEstado(
             @PathVariable Integer id,
             @RequestParam Cita.EstadoCita nuevoEstado) {
         return citaService.actualizarEstado(id, nuevoEstado)
                 .map(ResponseEntity::ok)
                 .orElseGet(() -> ResponseEntity.notFound().build());
     }

    @PutMapping("/{id}")
    public ResponseEntity<CitaResponse> actualizar(@PathVariable Integer id, @RequestBody CitaRequest datos) {
        return ResponseEntity.ok(citaService.actualizar(id, datos));
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/controller/EspecialidadController.java

```java
package com.clinica.sangabriel.controller;

import jakarta.validation.Valid;
import com.clinica.sangabriel.model.Especialidad;
import com.clinica.sangabriel.service.EspecialidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/especialidades")
public class EspecialidadController {

    @Autowired
    private EspecialidadService especialidadService;

    @GetMapping
    public ResponseEntity<List<Especialidad>> listar() {
        return ResponseEntity.ok(especialidadService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<Especialidad> crear(@Valid @RequestBody Especialidad especialidad) {
        return new ResponseEntity<>(especialidadService.registrar(especialidad), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Especialidad> actualizar(@PathVariable Integer id, @Valid @RequestBody Especialidad datos) {
        return ResponseEntity.ok(especialidadService.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        especialidadService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/controller/MedicoController.java

```java
package com.clinica.sangabriel.controller;

import jakarta.validation.Valid;
import com.clinica.sangabriel.model.Medico;
import com.clinica.sangabriel.service.MedicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicos")
public class MedicoController {

    @Autowired
    private MedicoService medicoService;

    @GetMapping
    public ResponseEntity<List<Medico>> listar(@RequestParam(required = false) Integer idEspecialidad) {
        if (idEspecialidad != null) {
            return ResponseEntity.ok(medicoService.listarPorEspecialidad(idEspecialidad));
        }
        return ResponseEntity.ok(medicoService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<Medico> crear(@Valid @RequestBody Medico medico) {
        return new ResponseEntity<>(medicoService.registrar(medico), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medico> actualizar(@PathVariable Integer id, @Valid @RequestBody Medico datos) {
        return ResponseEntity.ok(medicoService.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        medicoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/controller/PacienteController.java

```java
package com.clinica.sangabriel.controller;

import jakarta.validation.Valid;
import com.clinica.sangabriel.model.Paciente;
import com.clinica.sangabriel.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @GetMapping
    public ResponseEntity<List<Paciente>> listar(@RequestParam(required = false) String dni) {
        if (dni != null && !dni.isBlank()) {
            return pacienteService.buscarPorDni(dni)
                    .map(paciente -> ResponseEntity.ok(List.of(paciente)))
                    .orElseGet(() -> ResponseEntity.ok(List.of()));
        }
        return ResponseEntity.ok(pacienteService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<Paciente> crear(@Valid @RequestBody Paciente paciente) {
        return new ResponseEntity<>(pacienteService.registrar(paciente), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> actualizar(@PathVariable Integer id, @Valid @RequestBody Paciente datos) {
        return ResponseEntity.ok(pacienteService.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        pacienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/controller/UsuarioController.java

```java
package com.clinica.sangabriel.controller;

import com.clinica.sangabriel.model.Usuario;
import com.clinica.sangabriel.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioRepository usuarios;

    public UsuarioController(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    // Nunca devolver Usuario completo: contiene el hash de la contrasena.
    public record PerfilResponse(Long id, String username, String rol, boolean activo) {}

    @GetMapping("/me")
    public ResponseEntity<PerfilResponse> miPerfil(Authentication autenticacion) {
        Usuario usuario = usuarios.findByUsername(autenticacion.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return ResponseEntity.ok(new PerfilResponse(
                usuario.getId(), usuario.getUsername(), usuario.getRol().getNombre(),
                Boolean.TRUE.equals(usuario.getEstado())));
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/dto/CitaRequest.java

```java
package com.clinica.sangabriel.dto;

import java.time.LocalDate;
import java.time.LocalTime;

// Datos que Postman debe enviar para crear una cita.
// Solo recibimos IDs: no permitimos crear pacientes/medicos desde este endpoint.
public record CitaRequest(
        Integer idPaciente,
        Integer idMedico,
        LocalDate fechaCita,
        LocalTime horaCita,
        String motivoConsulta) {
}
```

## backend/src/main/java/com/clinica/sangabriel/dto/CitaResponse.java

```java
package com.clinica.sangabriel.dto;

import com.clinica.sangabriel.model.Cita;
import java.time.LocalDate;
import java.time.LocalTime;

// Devuelve unicamente los datos necesarios para presentar la cita.
// No expone DNI, domicilio ni otros datos personales de paciente/medico.
public record CitaResponse(
        Integer idCita,
        Integer idPaciente,
        Integer idMedico,
        LocalDate fechaCita,
        LocalTime horaCita,
        String motivoConsulta,
        Cita.EstadoCita estado) {

    public static CitaResponse desde(Cita cita) {
        return new CitaResponse(
                cita.getIdCita(),
                cita.getPaciente().getIdPaciente(),
                cita.getMedico().getIdMedico(),
                cita.getFechaCita(),
                cita.getHoraCita(),
                cita.getMotivoConsulta(),
                cita.getEstado());
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/dto/LoginRequest.java

```java
package com.clinica.sangabriel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String username;
    private String password;
}
```

## backend/src/main/java/com/clinica/sangabriel/dto/LoginResponse.java

```java
package com.clinica.sangabriel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
}
```

## backend/src/main/java/com/clinica/sangabriel/model/Atencion.java

```java
package com.clinica.sangabriel.model;

import jakarta.validation.constraints.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "atenciones")
public class Atencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_atencion")
    private Integer idAtencion;

    @OneToOne
    @JoinColumn(name = "id_cita", nullable = false, unique = true)
    @NotNull
    private Cita cita;

    @Column(name = "fecha_hora_atencion", insertable = false, updatable = false)
    private LocalDateTime fechaHoraAtencion;

    @Column(name = "signos_vitales", length = 255)
    @Size(max = 255)
    private String signosVitales;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank @Size(max = 10000)
    private String diagnostico;

    @Column(name = "tratamiento_receta", columnDefinition = "TEXT")
    @Size(max = 10000)
    private String tratamientoReceta;

    @Column(columnDefinition = "TEXT")
    @Size(max = 10000)
    private String observaciones;

    public Atencion() {
    }

    public Integer getIdAtencion() {
        return idAtencion;
    }

    public void setIdAtencion(Integer idAtencion) {
        this.idAtencion = idAtencion;
    }

    public Cita getCita() {
        return cita;
    }

    public void setCita(Cita cita) {
        this.cita = cita;
    }

    public LocalDateTime getFechaHoraAtencion() {
        return fechaHoraAtencion;
    }

    public void setFechaHoraAtencion(LocalDateTime fechaHoraAtencion) {
        this.fechaHoraAtencion = fechaHoraAtencion;
    }

    public String getSignosVitales() {
        return signosVitales;
    }

    public void setSignosVitales(String signosVitales) {
        this.signosVitales = signosVitales;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getTratamientoReceta() {
        return tratamientoReceta;
    }

    public void setTratamientoReceta(String tratamientoReceta) {
        this.tratamientoReceta = tratamientoReceta;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/model/Cita.java

```java
package com.clinica.sangabriel.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "citas")
public class Cita {

    public enum EstadoCita {
        PENDIENTE, CONFIRMADA, ATENDIDA, CANCELADA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cita")
    private Integer idCita;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    @Column(name = "fecha_cita", nullable = false)
    private LocalDate fechaCita;

    @Column(name = "hora_cita", nullable = false)
    private LocalTime horaCita;

    @Column(name = "motivo_consulta", length = 255)
    private String motivoConsulta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCita estado = EstadoCita.PENDIENTE;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    public Cita() {
    }

    public Integer getIdCita() {
        return idCita;
    }

    public void setIdCita(Integer idCita) {
        this.idCita = idCita;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public LocalDate getFechaCita() {
        return fechaCita;
    }

    public void setFechaCita(LocalDate fechaCita) {
        this.fechaCita = fechaCita;
    }

    public LocalTime getHoraCita() {
        return horaCita;
    }

    public void setHoraCita(LocalTime horaCita) {
        this.horaCita = horaCita;
    }

    public String getMotivoConsulta() {
        return motivoConsulta;
    }

    public void setMotivoConsulta(String motivoConsulta) {
        this.motivoConsulta = motivoConsulta;
    }

    public EstadoCita getEstado() {
        return estado;
    }

    public void setEstado(EstadoCita estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/model/Especialidad.java

```java
package com.clinica.sangabriel.model;

import jakarta.validation.constraints.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "especialidades")
public class Especialidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_especialidad")
    private Integer idEspecialidad;

    @Column(nullable = false, unique = true, length = 100)
    @NotBlank @Size(max = 100)
    private String nombre;

    @Column(length = 255)
    @Size(max = 255)
    private String descripcion;

    @Column(columnDefinition = "TINYINT(1) DEFAULT 1")
    @NotNull
    private Boolean estado = true;

    public Especialidad() {
    }

    public Especialidad(Integer idEspecialidad, String nombre, String descripcion, Boolean estado) {
        this.idEspecialidad = idEspecialidad;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
    }

    public Integer getIdEspecialidad() {
        return idEspecialidad;
    }

    public void setIdEspecialidad(Integer idEspecialidad) {
        this.idEspecialidad = idEspecialidad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/model/Medico.java

```java
package com.clinica.sangabriel.model;

import jakarta.validation.constraints.*;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "medicos")
@Data
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medico")
    private Integer idMedico;

    @Column(nullable = false, unique = true, length = 8)
    @NotBlank @Pattern(regexp = "[0-9]{8}", message = "debe tener 8 dígitos")
    private String dni;

    @Column(nullable = false, length = 100)
    @NotBlank @Size(max = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    @NotBlank @Size(max = 100)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 20)
    @NotBlank @Size(max = 20)
    private String cmp;

    @Column(length = 15)
    @Size(max = 15)
    private String telefono;

    @Column(length = 100)
    @Email @Size(max = 100)
    private String correo;

    @ManyToOne
    @JoinColumn(name = "id_especialidad", nullable = false)
    @NotNull
    private Especialidad especialidad;

    @Column(columnDefinition = "TINYINT(1) DEFAULT 1")
    @NotNull
    private Boolean estado = true;
}
```

## backend/src/main/java/com/clinica/sangabriel/model/Paciente.java

```java
package com.clinica.sangabriel.model;

import jakarta.validation.constraints.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pacientes")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paciente")
    private Integer idPaciente;

    @Column(nullable = false, unique = true, length = 8)
    @NotBlank @Pattern(regexp = "[0-9]{8}", message = "debe tener 8 dígitos")
    private String dni;

    @Column(nullable = false, length = 100)
    @NotBlank @Size(max = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    @NotBlank @Size(max = 100)
    private String apellidos;

    @Column(name = "fecha_nacimiento", nullable = false)
    @NotNull @PastOrPresent
    private LocalDate fechaNacimiento;

    @Column(length = 1)
    private Character sexo;

    @Column(length = 15)
    @Size(max = 15)
    private String telefono;

    @Column(length = 100)
    @Email @Size(max = 100)
    private String correo;

    @Column(length = 200)
    @Size(max = 200)
    private String direccion;

    @Column(name = "fecha_registro", insertable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    public Paciente() {
    }

    public Integer getIdPaciente() {
        return idPaciente;
    }

    public void setIdPaciente(Integer idPaciente) {
        this.idPaciente = idPaciente;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public Character getSexo() {
        return sexo;
    }

    public void setSexo(Character sexo) {
        this.sexo = sexo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/model/Rol.java

```java
package com.clinica.sangabriel.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String nombre;
}
```

## backend/src/main/java/com/clinica/sangabriel/model/Usuario.java

```java
package com.clinica.sangabriel.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Boolean estado = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;
}
```

## backend/src/main/java/com/clinica/sangabriel/repository/AtencionRepository.java

```java
package com.clinica.sangabriel.repository;
import com.clinica.sangabriel.model.Atencion;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AtencionRepository extends JpaRepository<Atencion, Integer> {
    boolean existsByCita_IdCita(Integer idCita);
}
```

## backend/src/main/java/com/clinica/sangabriel/repository/CitaRepository.java

```java
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
```

## backend/src/main/java/com/clinica/sangabriel/repository/EspecialidadRepository.java

```java
package com.clinica.sangabriel.repository;

import com.clinica.sangabriel.model.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspecialidadRepository extends JpaRepository<Especialidad, Integer> {
}
```

## backend/src/main/java/com/clinica/sangabriel/repository/MedicoRepository.java

```java
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
```

## backend/src/main/java/com/clinica/sangabriel/repository/PacienteRepository.java

```java
package com.clinica.sangabriel.repository;

import com.clinica.sangabriel.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
    Optional<Paciente> findByDni(String dni);
}
```

## backend/src/main/java/com/clinica/sangabriel/repository/RolRepository.java

```java
package com.clinica.sangabriel.repository;

import com.clinica.sangabriel.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombre(String nombre);
}
```

## backend/src/main/java/com/clinica/sangabriel/repository/UsuarioRepository.java

```java
package com.clinica.sangabriel.repository;

import com.clinica.sangabriel.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    Boolean existsByUsername(String username);
}
```

## backend/src/main/java/com/clinica/sangabriel/service/AtencionService.java

```java
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
```

## backend/src/main/java/com/clinica/sangabriel/service/CitaService.java

```java
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
```

## backend/src/main/java/com/clinica/sangabriel/service/EspecialidadService.java

```java
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
```

## backend/src/main/java/com/clinica/sangabriel/service/JwtService.java

```java
package com.clinica.sangabriel.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    private final Key secretKey;
    private static final long EXPIRATION_MS = 60L * 60 * 1000; // 1 hora

    public JwtService(@Value("${jwt.secret:}") String claveBase64) {
        if (claveBase64 == null || claveBase64.isBlank()) {
            throw new IllegalStateException("Define la variable JWT_SECRET antes de iniciar Spring Boot");
        }
        byte[] bytes = Decoders.BASE64.decode(claveBase64);
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET debe tener al menos 32 bytes en Base64");
        }
        this.secretKey = Keys.hmacShaKeyFor(bytes);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails usuario) {
        Claims claims = extractAllClaims(token);
        return usuario.isEnabled()
                && usuario.getUsername().equals(claims.getSubject())
                && claims.getExpiration() != null
                && claims.getExpiration().after(new Date());
    }

    public String generateToken(UserDetails usuario) {
        long ahora = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(usuario.getUsername())
                .setIssuedAt(new Date(ahora))
                .setExpiration(new Date(ahora + EXPIRATION_MS))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
}
```

## backend/src/main/java/com/clinica/sangabriel/service/MedicoService.java

```java
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
```

## backend/src/main/java/com/clinica/sangabriel/service/PacienteService.java

```java
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
```

## backend/src/main/java/com/clinica/sangabriel/service/UserDetailsServiceImpl.java

```java
package com.clinica.sangabriel.service;

import com.clinica.sangabriel.model.Usuario;
import com.clinica.sangabriel.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el username: " + username));

            List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre())
        );

        return new User(
                usuario.getUsername(),
                usuario.getPassword(),
                usuario.getEstado(),
                true,
                true,
                true,
                authorities
        );
    }
}
```

## backend/src/main/resources/application.properties

```properties
spring.application.name=sangabriel
server.port=${SERVER_PORT:8080}
spring.datasource.url=jdbc:mysql://${DB_HOST:127.0.0.1}:${DB_PORT:3306}/${DB_NAME:clinica_san_gabriel}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Lima
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD:}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
server.error.include-message=always

# Definir una clave Base64 de al menos 32 bytes antes de iniciar (README).
jwt.secret=${JWT_SECRET:}

# La carga inicial anterior es opcional; el SQL APF3 ya incluye usuarios de prueba.
demo.seed.enabled=${DEMO_SEED_ENABLED:false}
demo.seed.username=${DEMO_SEED_USERNAME:}
demo.seed.password=${DEMO_SEED_PASSWORD:}
```

## backend/src/test/java/com/clinica/sangabriel/ApiIntegrationTest.java

```java
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
```

## backend/src/test/java/com/clinica/sangabriel/BrowserTestApplication.java

```java
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
```

## backend/src/test/resources/application-test.properties

```properties
spring.datasource.url=jdbc:h2:mem:clinica_test;MODE=MySQL;DB_CLOSE_DELAY=-1
spring.datasource.username=sa
spring.datasource.password=
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false
spring.jpa.open-in-view=false
jwt.secret=c2FuLWdhYnJpZWwtcHJ1ZWJhcy1hcGYzLWNvbi1jbGF2ZS1kZS1wcnVlYmE=
demo.seed.enabled=false
```

## database/clinica_san_gabriel.sql

```sql
-- APF3 / Clínica San Gabriel. Registros ficticios para pruebas académicas.
-- No borra tablas ni sobrescribe registros existentes. Importar en una BD de pruebas.

CREATE DATABASE IF NOT EXISTS clinica_san_gabriel;
USE clinica_san_gabriel;

-- 1. Especialidades médicas (Cardiología, Pediatría, Medicina General, etc.)
CREATE TABLE IF NOT EXISTS especialidades (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE
);

-- 2. Médicos
CREATE TABLE IF NOT EXISTS medicos (
    id_medico INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(8) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cmp VARCHAR(20) NOT NULL UNIQUE, -- Colegio Médico del Perú
    telefono VARCHAR(15),
    correo VARCHAR(100),
    id_especialidad INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad)
);

-- 3. Pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(8) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1), -- 'M' o 'F'
    telefono VARCHAR(15),
    correo VARCHAR(100),
    direccion VARCHAR(200),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Citas Médicas (El agendamiento)
CREATE TABLE IF NOT EXISTS citas (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    motivo_consulta VARCHAR(255),
    estado ENUM('PENDIENTE', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA') DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_medico) REFERENCES medicos(id_medico)
);

-- 5. Atenciones (El acto médico / Historia clínica de la cita)
CREATE TABLE IF NOT EXISTS atenciones (
    id_atencion INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT NOT NULL UNIQUE, -- Una cita genera una atención
    fecha_hora_atencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    signos_vitales VARCHAR(255), -- Ej: "PA: 120/80, Temp: 36.5°C, Peso: 70kg"
    diagnostico TEXT NOT NULL,
    tratamiento_receta TEXT,
    observaciones TEXT,
    FOREIGN KEY (id_cita) REFERENCES citas(id_cita)
);

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    rol_id BIGINT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Datos iniciales. Contraseña de las tres cuentas DEMO: DemoClinica123!
INSERT INTO roles(nombre) SELECT 'ADMIN' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre='ADMIN');
INSERT INTO roles(nombre) SELECT 'RECEPCION' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre='RECEPCION');
INSERT INTO roles(nombre) SELECT 'MEDICO' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre='MEDICO');
INSERT INTO usuarios(username,password,estado,rol_id) SELECT 'apf3.admin','$2a$10$YqPb8ibNudXCIc.SF37tM.B5GZ6yOGpr4kAekLFXAKOJdX6NNy6Ga',TRUE,id FROM roles WHERE nombre='ADMIN' AND NOT EXISTS (SELECT 1 FROM usuarios WHERE username='apf3.admin');
INSERT INTO usuarios(username,password,estado,rol_id) SELECT 'apf3.recepcion','$2a$10$YqPb8ibNudXCIc.SF37tM.B5GZ6yOGpr4kAekLFXAKOJdX6NNy6Ga',TRUE,id FROM roles WHERE nombre='RECEPCION' AND NOT EXISTS (SELECT 1 FROM usuarios WHERE username='apf3.recepcion');
INSERT INTO usuarios(username,password,estado,rol_id) SELECT 'apf3.medico','$2a$10$YqPb8ibNudXCIc.SF37tM.B5GZ6yOGpr4kAekLFXAKOJdX6NNy6Ga',TRUE,id FROM roles WHERE nombre='MEDICO' AND NOT EXISTS (SELECT 1 FROM usuarios WHERE username='apf3.medico');
INSERT INTO especialidades(nombre,descripcion,estado) SELECT 'Medicina General APF3','Consultas generales (datos ficticios)',TRUE WHERE NOT EXISTS (SELECT 1 FROM especialidades WHERE nombre='Medicina General APF3');
INSERT INTO especialidades(nombre,descripcion,estado) SELECT 'Pediatría APF3','Especialidad de demostración',TRUE WHERE NOT EXISTS (SELECT 1 FROM especialidades WHERE nombre='Pediatría APF3');
INSERT INTO especialidades(nombre,descripcion,estado) SELECT 'Cardiología APF3','Especialidad de demostración',TRUE WHERE NOT EXISTS (SELECT 1 FROM especialidades WHERE nombre='Cardiología APF3');
INSERT INTO medicos(dni,nombres,apellidos,cmp,correo,id_especialidad,estado) SELECT '90000011','Elena','Demo Ríos','APF3001','demo.medico@example.test',id_especialidad,TRUE FROM especialidades WHERE nombre='Medicina General APF3' AND NOT EXISTS (SELECT 1 FROM medicos WHERE dni='90000011' OR cmp='APF3001');
INSERT INTO medicos(dni,nombres,apellidos,cmp,correo,id_especialidad,estado) SELECT '90000012','Marco','Demo Torres','APF3002','demo.medico@example.test',id_especialidad,TRUE FROM especialidades WHERE nombre='Pediatría APF3' AND NOT EXISTS (SELECT 1 FROM medicos WHERE dni='90000012' OR cmp='APF3002');
INSERT INTO pacientes(dni,nombres,apellidos,fecha_nacimiento,sexo,correo,direccion) SELECT '90000021','Lucía','Demo Campos','1998-04-12','F','demo.paciente@example.test','Dirección ficticia APF3' WHERE NOT EXISTS (SELECT 1 FROM pacientes WHERE dni='90000021');
INSERT INTO pacientes(dni,nombres,apellidos,fecha_nacimiento,sexo,correo,direccion) SELECT '90000022','Mateo','Demo Flores','2017-08-03','M','demo.paciente@example.test','Dirección ficticia APF3' WHERE NOT EXISTS (SELECT 1 FROM pacientes WHERE dni='90000022');

INSERT INTO citas(id_paciente,id_medico,fecha_cita,hora_cita,motivo_consulta,estado)
SELECT p.id_paciente,m.id_medico,DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY),'09:00:00','APF3: cita de demostración','PENDIENTE'
FROM pacientes p CROSS JOIN medicos m WHERE p.dni='90000021' AND m.dni='90000011'
AND NOT EXISTS (SELECT 1 FROM citas WHERE motivo_consulta='APF3: cita de demostración')
AND NOT EXISTS (SELECT 1 FROM citas c WHERE c.id_medico=m.id_medico AND c.fecha_cita=DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY) AND c.hora_cita='09:00:00' AND c.estado<>'CANCELADA');

INSERT INTO citas(id_paciente,id_medico,fecha_cita,hora_cita,motivo_consulta,estado)
SELECT p.id_paciente,m.id_medico,DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY),'08:00:00','APF3: atención de demostración','ATENDIDA'
FROM pacientes p CROSS JOIN medicos m WHERE p.dni='90000022' AND m.dni='90000012'
AND NOT EXISTS (SELECT 1 FROM citas WHERE motivo_consulta='APF3: atención de demostración')
AND NOT EXISTS (SELECT 1 FROM citas c WHERE c.id_medico=m.id_medico AND c.fecha_cita=DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY) AND c.hora_cita='08:00:00' AND c.estado<>'CANCELADA');

INSERT INTO atenciones(id_cita,signos_vitales,diagnostico,tratamiento_receta,observaciones)
SELECT id_cita,'Ejemplo académico','Registro de prueba académica','Texto ficticio de demostración','No corresponde a un paciente real'
FROM citas c WHERE motivo_consulta='APF3: atención de demostración'
AND NOT EXISTS (SELECT 1 FROM atenciones a WHERE a.id_cita=c.id_cita);
```

## database/esquema_original_recibido.sql

```sql
CREATE DATABASE IF NOT EXISTS clinica_san_gabriel;
USE clinica_san_gabriel;

-- 1. Especialidades médicas (Cardiología, Pediatría, Medicina General, etc.)
CREATE TABLE especialidades (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE
);

-- 2. Médicos
CREATE TABLE medicos (
    id_medico INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(8) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cmp VARCHAR(20) NOT NULL UNIQUE, -- Colegio Médico del Perú
    telefono VARCHAR(15),
    correo VARCHAR(100),
    id_especialidad INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad)
);

-- 3. Pacientes
CREATE TABLE pacientes (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(8) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1), -- 'M' o 'F'
    telefono VARCHAR(15),
    correo VARCHAR(100),
    direccion VARCHAR(200),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Citas Médicas (El agendamiento)
CREATE TABLE citas (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    motivo_consulta VARCHAR(255),
    estado ENUM('PENDIENTE', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA') DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_medico) REFERENCES medicos(id_medico)
);

-- 5. Atenciones (El acto médico / Historia clínica de la cita)
CREATE TABLE atenciones (
    id_atencion INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT NOT NULL UNIQUE, -- Una cita genera una atención
    fecha_hora_atencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    signos_vitales VARCHAR(255), -- Ej: "PA: 120/80, Temp: 36.5°C, Peso: 70kg"
    diagnostico TEXT NOT NULL,
    tratamiento_receta TEXT,
    observaciones TEXT,
    FOREIGN KEY (id_cita) REFERENCES citas(id_cita)
);
```

## frontend/angular.json

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "packageManager": "npm",
    "analytics": false
  },
  "newProjectRoot": "projects",
  "projects": {
    "frontend": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss",
          "skipTests": true,
          "type": "component",
          "addTypeToClassName": false
        },
        "@schematics/angular:class": {
          "skipTests": true
        },
        "@schematics/angular:directive": {
          "skipTests": true,
          "type": "directive",
          "addTypeToClassName": false
        },
        "@schematics/angular:guard": {
          "skipTests": true,
          "typeSeparator": "."
        },
        "@schematics/angular:interceptor": {
          "skipTests": true,
          "typeSeparator": "."
        },
        "@schematics/angular:pipe": {
          "skipTests": true,
          "typeSeparator": "."
        },
        "@schematics/angular:resolver": {
          "skipTests": true,
          "typeSeparator": "."
        },
        "@schematics/angular:service": {
          "skipTests": true,
          "type": "service",
          "addTypeToClassName": false
        },
        "@schematics/angular:module": {
          "typeSeparator": "."
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "browser": "src/main.ts",
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": ["node_modules/bootstrap/dist/css/bootstrap.min.css", "src/styles.scss"],
            "polyfills": ["zone.js"]
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "600kB",
                  "maximumError": "1MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "4kB",
                  "maximumError": "8kB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "frontend:build:production"
            },
            "development": {
              "buildTarget": "frontend:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
```

## frontend/package.json

```json
{
  "name": "frontend",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development"
  },
  "private": true,
  "packageManager": "npm@11.9.0",
  "dependencies": {
    "@angular/common": "21.2.26",
    "@angular/compiler": "21.2.26",
    "@angular/core": "21.2.26",
    "@angular/forms": "21.2.26",
    "@angular/platform-browser": "21.2.26",
    "@angular/router": "21.2.26",
    "bootstrap": "5.3.8",
    "rxjs": "7.8.2",
    "tslib": "2.9.1",
    "zone.js": "0.16.2"
  },
  "devDependencies": {
    "@angular/build": "21.2.30",
    "@angular/cli": "21.2.30",
    "@angular/compiler-cli": "21.2.26",
    "prettier": "3.10.1",
    "typescript": "5.9.3"
  },
  "engines": {
    "node": "^22.12.0 || ^24.0.0"
  }
}
```

## frontend/public/favicon.svg

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#123e35"/><path d="M21 11h6v10h10v6H27v10h-6V27H11v-6h10z" fill="#e6f0dc"/></svg>
```

## frontend/src/app/Componentes/atenciones/atenciones.component.html

```html
<section class="page-heading">
  <div>
    <span class="eyebrow">REGISTRO CLÍNICO</span>
    <h1>Atenciones</h1>
    <p>Consulta las atenciones y registra la información de cada cita.</p>
  </div>
  <button class="btn btn-primary" (click)="nuevo()" [disabled]="guardando">+ Nueva atención</button>
</section>
<app-feedback [error]="error" [exito]="exito" [cargando]="cargando" />
@if (abierto) {
  <section class="panel">
    <div class="panel-header">
      <h2>{{ editando === null ? 'Registrar atención' : 'Editar atención #' + editando }}</h2>
      <span class="section-note">Una atención por cita</span>
    </div>
    <div class="panel-body">
      <p class="required-note">Los campos con * son obligatorios.</p>
      <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
        <fieldset [disabled]="guardando">
          <div class="row g-3">
            <div class="col-12">
              <label for="idCita" class="form-label">Cita *</label
              ><select id="idCita" class="form-select" formControlName="idCita">
                <option [ngValue]="0">Selecciona la cita del paciente</option>
                <option *ngFor="let c of disponibles" [ngValue]="c.idCita">
                  {{ etiqueta(c) }}
                </option></select
              ><app-field-error [control]="form.controls.idCita" />
              @if (!disponibles.length) {
                <small class="text-secondary"
                  >No hay citas pendientes o confirmadas. Registra una cita desde la agenda.</small
                >
              }
              @if (editando) {
                <small class="text-secondary">La cita vinculada se conserva al editar.</small>
              }
            </div>
            <div class="col-12">
              <label for="signosVitales" class="form-label">Signos vitales</label
              ><input
                id="signosVitales"
                class="form-control"
                formControlName="signosVitales"
                maxlength="255"
              /><app-field-error [control]="form.controls.signosVitales" />
            </div>
            <div class="col-12">
              <label for="diagnostico" class="form-label">Diagnóstico *</label
              ><textarea
                id="diagnostico"
                class="form-control"
                rows="3"
                formControlName="diagnostico"
                maxlength="10000"
              ></textarea
              ><app-field-error [control]="form.controls.diagnostico" />
            </div>
            <div class="col-md-6">
              <label for="tratamientoReceta" class="form-label">Tratamiento / receta</label
              ><textarea
                id="tratamientoReceta"
                class="form-control"
                rows="4"
                formControlName="tratamientoReceta"
                maxlength="10000"
              ></textarea
              ><app-field-error [control]="form.controls.tratamientoReceta" />
            </div>
            <div class="col-md-6">
              <label for="observaciones" class="form-label">Observaciones</label
              ><textarea
                id="observaciones"
                class="form-control"
                rows="4"
                formControlName="observaciones"
                maxlength="10000"
              ></textarea
              ><app-field-error [control]="form.controls.observaciones" />
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" type="submit">
              {{ guardando ? 'Guardando…' : 'Guardar atención' }}</button
            ><button type="button" class="btn btn-outline-secondary" (click)="cancelar()">
              Cancelar
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  </section>
}
@if (detalle; as a) {
  <section class="panel">
    <div class="panel-header">
      <h2>
        Atención #{{ a.idAtencion }} · {{ a.cita.paciente.nombres }} {{ a.cita.paciente.apellidos }}
      </h2>
      <button class="btn btn-sm btn-outline-secondary" (click)="detalle = null">
        Cerrar detalle
      </button>
    </div>
    <div class="panel-body">
      <p class="section-note">
        Cita #{{ a.cita.idCita }} · {{ a.cita.fechaCita | date: 'dd/MM/yyyy' }} ·
        {{ a.cita.medico.nombres }} {{ a.cita.medico.apellidos }}
      </p>
      <div class="row g-3">
        <div class="col-12">
          <h3>Signos vitales</h3>
          <p class="detail-text">{{ a.signosVitales || 'Sin registro' }}</p>
        </div>
        <div class="col-12">
          <h3>Diagnóstico</h3>
          <p class="detail-text">{{ a.diagnostico }}</p>
        </div>
        <div class="col-md-6">
          <h3>Tratamiento / receta</h3>
          <p class="detail-text">{{ a.tratamientoReceta || 'Sin registro' }}</p>
        </div>
        <div class="col-md-6">
          <h3>Observaciones</h3>
          <p class="detail-text">{{ a.observaciones || 'Sin observaciones' }}</p>
        </div>
      </div>
    </div>
  </section>
}
<section class="panel">
  <div class="panel-header">
    <h2>
      Historial <span class="tag ms-2">{{ lista.length }}</span>
    </h2>
    <div class="d-flex gap-2">
      <label for="buscar" class="visually-hidden">Buscar atenciones</label
      ><input
        id="buscar"
        class="form-control search-box"
        [(ngModel)]="busqueda"
        placeholder="Paciente, DNI o diagnóstico"
      /><button
        class="btn btn-outline-secondary"
        (click)="cargar()"
        [disabled]="cargando || guardando"
      >
        Actualizar
      </button>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Atención / cita</th>
          <th>Paciente</th>
          <th>Médico</th>
          <th>Diagnóstico</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let a of filtrados">
          <td>
            <span class="person-name">#{{ a.idAtencion }}</span
            ><span class="table-subtext"
              >Cita #{{ a.cita.idCita }} · {{ a.cita.fechaCita | date: 'dd/MM/yyyy' }}</span
            >
          </td>
          <td>
            {{ a.cita.paciente.nombres }} {{ a.cita.paciente.apellidos
            }}<span class="table-subtext">{{ a.cita.paciente.dni }}</span>
          </td>
          <td>
            {{ a.cita.medico.nombres }} {{ a.cita.medico.apellidos
            }}<span class="table-subtext">{{ a.cita.medico.especialidad.nombre }}</span>
          </td>
          <td>
            {{ a.diagnostico.length > 80 ? a.diagnostico.slice(0, 80) + '…' : a.diagnostico }}
          </td>
          <td>
            <div class="actions">
              <button class="btn btn-sm btn-outline-primary" (click)="detalle = a">
                Ver detalle</button
              ><button
                class="btn btn-sm btn-outline-primary"
                (click)="editar(a)"
                [disabled]="guardando"
              >
                Editar
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  @if (!cargando && !filtrados.length) {
    <div class="empty-state">No hay atenciones para mostrar.</div>
  }
</section>
<p class="section-note">
  Las atenciones se conservan como parte del historial; no se eliminan desde la intranet.
</p>
```

## frontend/src/app/Componentes/atenciones/atenciones.component.scss

```scss
:host {
  display: block;
}
.table td {
  min-width: 120px;
}
```

## frontend/src/app/Componentes/atenciones/atenciones.component.ts

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { Atencion, AtencionRequest } from '../../modelos/atencion';
import { CitaResponse } from '../../modelos/cita';
import { Paciente } from '../../modelos/paciente';
import { Medico } from '../../modelos/medico';
import { AtencionService } from '../../Servicios/atencion.service';
import { CitaService } from '../../Servicios/cita.service';
import { PacienteService } from '../../Servicios/paciente.service';
import { MedicoService } from '../../Servicios/medico.service';
import { FeedbackComponent } from '../../shared/feedback.component';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { mensajeError, requerido } from '../../shared/form-utils';

@Component({
  selector: 'app-atenciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FeedbackComponent, FieldErrorComponent],
  templateUrl: './atenciones.component.html',
  styleUrl: './atenciones.component.scss',
})
export class AtencionesComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    idCita: [0, Validators.min(1)],
    signosVitales: ['', Validators.maxLength(255)],
    diagnostico: ['', [Validators.required, requerido, Validators.maxLength(10000)]],
    tratamientoReceta: ['', Validators.maxLength(10000)],
    observaciones: ['', Validators.maxLength(10000)],
  });
  lista: Atencion[] = [];
  citas: CitaResponse[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  busqueda = '';
  error = '';
  exito = '';
  cargando = false;
  guardando = false;
  abierto = false;
  editando: number | null = null;
  detalle: Atencion | null = null;
  constructor(
    private service: AtencionService,
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
  ) {}
  ngOnInit(): void {
    this.cargar();
  }
  get disponibles(): CitaResponse[] {
    return this.citas.filter(
      (c) =>
        c.estado === 'PENDIENTE' ||
        c.estado === 'CONFIRMADA' ||
        c.idCita === this.form.controls.idCita.value,
    );
  }
  get filtrados(): Atencion[] {
    const texto = this.busqueda.trim().toLocaleLowerCase('es');
    return this.lista.filter((a) =>
      `${a.cita.paciente.nombres} ${a.cita.paciente.apellidos} ${a.cita.paciente.dni} ${a.diagnostico} ${a.idAtencion}`
        .toLocaleLowerCase('es')
        .includes(texto),
    );
  }
  etiqueta(c: CitaResponse): string {
    const p = this.pacientes.find((p) => p.idPaciente === c.idPaciente);
    const m = this.medicos.find((m) => m.idMedico === c.idMedico);
    return `#${c.idCita} · ${c.fechaCita} ${c.horaCita.slice(0, 5)} · ${p?.nombres ?? ''} ${p?.apellidos ?? ''} · Dr(a). ${m?.apellidos ?? c.idMedico}`;
  }
  cargar(): void {
    this.cargando = true;
    this.error = '';
    forkJoin({
      atenciones: this.service.listar(),
      citas: this.citaService.listar(),
      pacientes: this.pacienteService.listar(),
      medicos: this.medicoService.listar(),
    })
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (datos) => {
          this.lista = datos.atenciones.sort((a, b) => b.idAtencion - a.idAtencion);
          this.citas = datos.citas;
          this.pacientes = datos.pacientes;
          this.medicos = datos.medicos;
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  nuevo(): void {
    this.cancelar();
    this.detalle = null;
    this.error = '';
    this.exito = '';
    this.abierto = true;
  }
  editar(a: Atencion): void {
    if (this.guardando) return;
    this.editando = a.idAtencion;
    this.abierto = true;
    this.detalle = null;
    this.error = '';
    this.exito = '';
    this.form.reset({
      idCita: a.cita.idCita,
      signosVitales: a.signosVitales ?? '',
      diagnostico: a.diagnostico,
      tratamientoReceta: a.tratamientoReceta ?? '',
      observaciones: a.observaciones ?? '',
    });
    this.form.controls.idCita.disable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  cancelar(): void {
    this.abierto = false;
    this.editando = null;
    this.form.controls.idCita.enable();
    this.form.reset({
      idCita: 0,
      signosVitales: '',
      diagnostico: '',
      tratamientoReceta: '',
      observaciones: '',
    });
  }
  guardar(): void {
    if (this.guardando) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const datos: AtencionRequest = {
      cita: { idCita: v.idCita },
      diagnostico: v.diagnostico.trim(),
      signosVitales: v.signosVitales.trim() || null,
      tratamientoReceta: v.tratamientoReceta.trim() || null,
      observaciones: v.observaciones.trim() || null,
    };
    this.guardando = true;
    this.error = '';
    this.exito = '';
    const peticion =
      this.editando === null
        ? this.service.crear(datos)
        : this.service.actualizar(this.editando, datos);
    peticion.pipe(finalize(() => (this.guardando = false))).subscribe({
      next: (a) => {
        this.cancelar();
        this.exito = `Atención #${a.idAtencion} guardada. La cita figura como atendida.`;
        this.cargar();
      },
      error: (error) => (this.error = mensajeError(error)),
    });
  }
}
```

## frontend/src/app/Componentes/citas/citas.component.html

```html
<section class="page-heading">
  <div>
    <span class="eyebrow">COORDINACIÓN DE ATENCIÓN</span>
    <h1>Agenda de citas</h1>
    <p>Consulta la agenda y organiza los próximos turnos.</p>
  </div>
  @if (puedeEditar) {
    <button class="btn btn-primary" (click)="nuevo()" [disabled]="guardando">+ Nueva cita</button>
  }
</section>
<div class="stat-grid">
  <div class="stat-card">
    <span class="stat-label">CITAS EN LA CONSULTA</span
    ><strong class="stat-number">{{ citas.length }}</strong
    ><span class="metric-note">{{ fechaFiltro || 'Todas las fechas' }}</span>
  </div>
  <div class="stat-card">
    <span class="stat-label">POR CONFIRMAR</span
    ><strong class="stat-number">{{ contar('PENDIENTE') }}</strong
    ><span class="metric-note">Pendientes</span>
  </div>
  <div class="stat-card">
    <span class="stat-label">CONFIRMADAS</span
    ><strong class="stat-number">{{ contar('CONFIRMADA') }}</strong
    ><span class="metric-note">Turnos confirmados</span>
  </div>
</div>
<app-feedback [error]="error" [exito]="exito" [cargando]="cargando" />
@if (abierto && puedeEditar) {
  <section class="panel">
    <div class="panel-header">
      <h2>{{ editando === null ? 'Registrar cita' : 'Editar cita #' + editando }}</h2>
      <span class="section-note">Selecciona especialidad y médico</span>
    </div>
    <div class="panel-body">
      <p class="required-note">
        Los campos con * son obligatorios. El paciente, médico y especialidad deben estar
        registrados.
      </p>
      <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
        <fieldset [disabled]="guardando">
          <div class="row g-3">
            <div class="col-12">
              <label for="idPaciente" class="form-label">Paciente *</label
              ><select id="idPaciente" class="form-select" formControlName="idPaciente">
                <option [ngValue]="0">Selecciona un paciente</option>
                <option *ngFor="let p of pacientes" [ngValue]="p.idPaciente">
                  {{ p.dni }} · {{ p.nombres }} {{ p.apellidos }}
                </option></select
              ><app-field-error [control]="form.controls.idPaciente" />
            </div>
            <div class="col-md-6">
              <label for="idEspecialidad" class="form-label">Especialidad *</label
              ><select
                id="idEspecialidad"
                class="form-select"
                formControlName="idEspecialidad"
                (change)="cambiarEspecialidad()"
              >
                <option [ngValue]="0">Selecciona una especialidad</option>
                <option
                  *ngFor="let e of especialidades"
                  [ngValue]="e.idEspecialidad"
                  [disabled]="!e.estado"
                >
                  {{ e.nombre }}{{ e.estado ? '' : ' (inactiva)' }}
                </option></select
              ><app-field-error [control]="form.controls.idEspecialidad" />
            </div>
            <div class="col-md-6">
              <label for="idMedico" class="form-label">Médico *</label
              ><select id="idMedico" class="form-select" formControlName="idMedico">
                <option [ngValue]="0">Selecciona un médico</option>
                <option *ngFor="let m of medicosDisponibles" [ngValue]="m.idMedico">
                  {{ m.nombres }} {{ m.apellidos }} · CMP {{ m.cmp }}
                </option></select
              ><app-field-error [control]="form.controls.idMedico" />
              @if (form.controls.idEspecialidad.value && !medicosDisponibles.length) {
                <small class="text-secondary">No hay médicos activos para esta especialidad.</small>
              }
            </div>
            <div class="col-md-6">
              <label for="fechaCita" class="form-label">Fecha *</label
              ><input
                id="fechaCita"
                class="form-control"
                type="date"
                [min]="hoy"
                formControlName="fechaCita"
              /><app-field-error [control]="form.controls.fechaCita" />
            </div>
            <div class="col-md-6">
              <label for="horaCita" class="form-label">Hora *</label
              ><input
                id="horaCita"
                class="form-control"
                type="time"
                formControlName="horaCita"
              /><app-field-error [control]="form.controls.horaCita" />
            </div>
            <div class="col-12">
              <label for="motivoConsulta" class="form-label">Motivo de consulta</label
              ><textarea
                id="motivoConsulta"
                class="form-control"
                rows="2"
                maxlength="255"
                formControlName="motivoConsulta"
              ></textarea
              ><app-field-error [control]="form.controls.motivoConsulta" />
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" type="submit">
              {{ guardando ? 'Guardando…' : 'Guardar cita' }}</button
            ><button class="btn btn-outline-secondary" type="button" (click)="cancelarEdicion()">
              Cancelar
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  </section>
}
<section class="panel">
  <div class="panel-header">
    <h2>Agenda</h2>
    <button class="btn btn-outline-secondary" (click)="cargar()" [disabled]="cargando || guardando">
      Actualizar
    </button>
  </div>
  <div class="panel-body pb-0">
    <form class="toolbar" (ngSubmit)="cargar()">
      <div>
        <label for="fechaFiltro" class="form-label">Fecha</label
        ><input
          id="fechaFiltro"
          name="fechaFiltro"
          type="date"
          class="form-control"
          [(ngModel)]="fechaFiltro"
        />
      </div>
      <div>
        <label for="estadoFiltro" class="form-label">Estado</label
        ><select
          id="estadoFiltro"
          name="estadoFiltro"
          class="form-select"
          [(ngModel)]="estadoFiltro"
        >
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="ATENDIDA">Atendida</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </div>
      <button class="btn btn-primary" type="submit" [disabled]="cargando">Consultar</button
      ><button
        class="btn btn-outline-secondary"
        type="button"
        (click)="limpiarFiltros()"
        [disabled]="cargando"
      >
        Ver todas
      </button>
    </form>
  </div>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Cita / horario</th>
          <th>Paciente</th>
          <th>Médico</th>
          <th>Estado</th>
          <th>Motivo</th>
          @if (puedeEditar) {
            <th>Acciones</th>
          }
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let c of visibles">
          <td>
            <span class="person-name"
              >{{ c.fechaCita | date: 'dd/MM/yyyy' }} · {{ c.horaCita.slice(0, 5) }}</span
            ><span class="table-subtext">Cita #{{ c.idCita }}</span>
          </td>
          <td>{{ paciente(c.idPaciente) }}</td>
          <td>
            {{ medico(c.idMedico)
            }}<span class="table-subtext">{{ especialidad(c.idMedico) }}</span>
          </td>
          <td>
            <span class="tag" [ngClass]="c.estado">{{ c.estado }}</span>
          </td>
          <td>{{ c.motivoConsulta || '—' }}</td>
          @if (puedeEditar) {
            <td>
              <div class="actions">
                @if (c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA') {
                  <button
                    class="btn btn-sm btn-outline-primary"
                    (click)="editar(c)"
                    [disabled]="guardando"
                  >
                    Editar
                  </button>
                  @if (c.estado === 'PENDIENTE') {
                    <button
                      class="btn btn-sm btn-outline-primary"
                      (click)="cambiarEstado(c, 'CONFIRMADA')"
                      [disabled]="guardando"
                    >
                      Confirmar
                    </button>
                  }
                  <button
                    class="btn btn-sm btn-outline-danger"
                    (click)="porCancelar = c"
                    [disabled]="guardando"
                  >
                    Cancelar cita
                  </button>
                } @else {
                  <span class="section-note">Cita cerrada</span>
                }
              </div>
            </td>
          }
        </tr>
      </tbody>
    </table>
  </div>
  @if (!cargando && !visibles.length) {
    <div class="empty-state">No hay citas para esta consulta.</div>
  }
</section>
<p class="section-note">
  Al registrar una atención, la cita pasa a ATENDIDA. Las citas canceladas se conservan en el
  historial.
</p>
@if (porCancelar; as c) {
  <div class="modal-backdrop-local">
    <section
      class="confirm-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="cancel-title"
    >
      <h2 id="cancel-title">¿Cancelar la cita #{{ c.idCita }}?</h2>
      <p>
        {{ paciente(c.idPaciente) }} · {{ c.fechaCita | date: 'dd/MM/yyyy' }} a las
        {{ c.horaCita.slice(0, 5) }}.<br />El turno quedará libre y el registro se conservará.
      </p>
      <div class="d-flex gap-2">
        <button
          class="btn btn-danger"
          (click)="cambiarEstado(c, 'CANCELADA')"
          [disabled]="guardando"
        >
          Confirmar cancelación</button
        ><button
          class="btn btn-outline-secondary"
          (click)="porCancelar = null"
          [disabled]="guardando"
        >
          Conservar cita
        </button>
      </div>
    </section>
  </div>
}
```

## frontend/src/app/Componentes/citas/citas.component.scss

```scss
:host {
  display: block;
}
.table td {
  min-width: 125px;
}
```

## frontend/src/app/Componentes/citas/citas.component.ts

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { CitaRequest, CitaResponse, EstadoCita } from '../../modelos/cita';
import { Paciente } from '../../modelos/paciente';
import { Medico } from '../../modelos/medico';
import { Especialidad } from '../../modelos/especialidad';
import { CitaService } from '../../Servicios/cita.service';
import { PacienteService } from '../../Servicios/paciente.service';
import { MedicoService } from '../../Servicios/medico.service';
import { EspecialidadService } from '../../Servicios/especialidad.service';
import { AuthService } from '../../Servicios/auth.service';
import { FeedbackComponent } from '../../shared/feedback.component';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { hoyLocal, mensajeError } from '../../shared/form-utils';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FeedbackComponent, FieldErrorComponent],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss',
})
export class CitasComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    idPaciente: [0, Validators.min(1)],
    idEspecialidad: [0, Validators.min(1)],
    idMedico: [0, Validators.min(1)],
    fechaCita: [hoyLocal(), Validators.required],
    horaCita: ['', Validators.required],
    motivoConsulta: ['', Validators.maxLength(255)],
  });
  citas: CitaResponse[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  especialidades: Especialidad[] = [];
  fechaFiltro = '';
  estadoFiltro = '';
  hoy = hoyLocal();
  error = '';
  exito = '';
  cargando = false;
  guardando = false;
  abierto = false;
  editando: number | null = null;
  porCancelar: CitaResponse | null = null;
  constructor(
    private service: CitaService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    public auth: AuthService,
  ) {}
  ngOnInit(): void {
    this.cargar();
  }
  get puedeEditar(): boolean {
    return this.auth.tieneRol('ADMIN', 'RECEPCION');
  }
  get visibles(): CitaResponse[] {
    return this.citas.filter((c) => !this.estadoFiltro || c.estado === this.estadoFiltro);
  }
  get medicosDisponibles(): Medico[] {
    return this.medicos.filter(
      (m) =>
        m.estado &&
        m.especialidad.estado &&
        m.especialidad.idEspecialidad === this.form.controls.idEspecialidad.value,
    );
  }
  contar(estado: EstadoCita): number {
    return this.citas.filter((c) => c.estado === estado).length;
  }
  paciente(id: number): string {
    const p = this.pacientes.find((p) => p.idPaciente === id);
    return p ? `${p.nombres} ${p.apellidos}` : `Paciente #${id}`;
  }
  medico(id: number): string {
    const m = this.medicos.find((m) => m.idMedico === id);
    return m ? `${m.nombres} ${m.apellidos}` : `Médico #${id}`;
  }
  especialidad(idMedico: number): string {
    return this.medicos.find((m) => m.idMedico === idMedico)?.especialidad.nombre ?? '';
  }
  cargar(): void {
    this.cargando = true;
    this.error = '';
    forkJoin({
      citas: this.service.listar(this.fechaFiltro),
      pacientes: this.pacienteService.listar(),
      medicos: this.medicoService.listar(),
      especialidades: this.especialidadService.listar(),
    })
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (datos) => {
          this.citas = datos.citas.sort((a, b) =>
            (a.fechaCita + a.horaCita).localeCompare(b.fechaCita + b.horaCita),
          );
          this.pacientes = datos.pacientes;
          this.medicos = datos.medicos;
          this.especialidades = datos.especialidades;
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  limpiarFiltros(): void {
    this.fechaFiltro = '';
    this.estadoFiltro = '';
    this.cargar();
  }
  cambiarEspecialidad(): void {
    this.form.controls.idMedico.setValue(0);
  }
  nuevo(): void {
    this.cancelarEdicion();
    this.error = '';
    this.exito = '';
    this.abierto = true;
  }
  editar(c: CitaResponse): void {
    if (!this.puedeEditar || this.guardando) return;
    this.editando = c.idCita;
    this.abierto = true;
    this.error = '';
    this.exito = '';
    this.form.reset({
      ...c,
      idEspecialidad:
        this.medicos.find((m) => m.idMedico === c.idMedico)?.especialidad.idEspecialidad ?? 0,
      motivoConsulta: c.motivoConsulta ?? '',
      horaCita: c.horaCita.slice(0, 5),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  cancelarEdicion(): void {
    this.abierto = false;
    this.editando = null;
    this.form.reset({
      idPaciente: 0,
      idEspecialidad: 0,
      idMedico: 0,
      fechaCita: hoyLocal(),
      horaCita: '',
      motivoConsulta: '',
    });
  }
  guardar(): void {
    if (this.guardando || !this.puedeEditar) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    if (new Date(`${v.fechaCita}T${v.horaCita}`).getTime() <= Date.now()) {
      this.error = 'Selecciona una fecha y hora futuras.';
      return;
    }
    const medico = this.medicosDisponibles.find((m) => m.idMedico === v.idMedico);
    if (!medico) {
      this.error = 'Selecciona un médico activo de la especialidad elegida.';
      return;
    }
    const datos: CitaRequest = {
      idPaciente: v.idPaciente,
      idMedico: v.idMedico,
      fechaCita: v.fechaCita,
      horaCita: v.horaCita.length === 5 ? v.horaCita + ':00' : v.horaCita,
      motivoConsulta: v.motivoConsulta.trim() || null,
    };
    this.guardando = true;
    this.error = '';
    this.exito = '';
    const peticion =
      this.editando === null
        ? this.service.crear(datos)
        : this.service.actualizar(this.editando, datos);
    peticion.pipe(finalize(() => (this.guardando = false))).subscribe({
      next: (cita) => {
        this.cancelarEdicion();
        this.fechaFiltro = cita.fechaCita;
        this.estadoFiltro = '';
        this.exito = `Cita #${cita.idCita} guardada.`;
        this.cargar();
      },
      error: (error) => (this.error = mensajeError(error)),
    });
  }
  cambiarEstado(c: CitaResponse, estado: EstadoCita): void {
    if (this.guardando || !this.puedeEditar) return;
    this.guardando = true;
    this.error = '';
    this.exito = '';
    this.service
      .cambiarEstado(c.idCita, estado)
      .pipe(
        finalize(() => {
          this.guardando = false;
          this.porCancelar = null;
        }),
      )
      .subscribe({
        next: () => {
          if (this.editando === c.idCita) this.cancelarEdicion();
          this.exito = `Cita #${c.idCita}: ${estado.toLowerCase()}.`;
          this.cargar();
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
}
```

## frontend/src/app/Componentes/especialidades/especialidades.component.html

```html
<section class="page-heading">
  <div>
    <span class="eyebrow">DIRECTORIO CLÍNICO</span>
    <h1>Especialidades</h1>
    <p>Organiza las especialidades disponibles en la clínica.</p>
  </div>
  @if (puedeEditar) {
    <button class="btn btn-primary" (click)="nuevo()" [disabled]="guardando">
      + Nuevo registro
    </button>
  }
</section>
<app-feedback [error]="error" [exito]="exito" [cargando]="cargando" />
@if (abierto && puedeEditar) {
  <section class="panel">
    <div class="panel-header">
      <h2>{{ editando === null ? 'Registrar especialidad' : 'Editar especialidad' }}</h2>
      <span class="section-note">{{ editando ? 'ID ' + editando : 'Nuevo registro' }}</span>
    </div>
    <div class="panel-body">
      <p class="required-note">Los campos con * son obligatorios.</p>
      <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
        <fieldset [disabled]="guardando">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label for="nombre" class="form-label">Nombre *</label
              ><input
                id="nombre"
                class="form-control"
                type="text"
                formControlName="nombre"
                maxlength="100"
              /><app-field-error [control]="form.controls.nombre" />
            </div>
            <div class="col-12 col-md-6">
              <label for="estado" class="form-label">Estado</label
              ><select id="estado" class="form-select" formControlName="estado">
                <option [ngValue]="true">Activo</option>
                <option [ngValue]="false">Inactivo</option></select
              ><app-field-error [control]="form.controls.estado" />
            </div>
            <div class="col-12">
              <label for="descripcion" class="form-label">Descripción</label
              ><textarea
                id="descripcion"
                class="form-control"
                formControlName="descripcion"
                rows="3"
                maxlength="255"
              ></textarea
              ><app-field-error [control]="form.controls.descripcion" />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              {{ guardando ? 'Guardando…' : 'Guardar cambios' }}</button
            ><button type="button" class="btn btn-outline-secondary" (click)="cancelar()">
              Cancelar
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  </section>
}
<section class="panel">
  <div class="panel-header">
    <h2>
      Directorio <span class="tag ms-2">{{ lista.length }}</span>
    </h2>
    <div class="d-flex gap-2 align-items-center">
      <label class="visually-hidden" for="buscar">Buscar especialidades</label
      ><input
        id="buscar"
        class="form-control search-box"
        [(ngModel)]="busqueda"
        placeholder="Buscar en el directorio"
      /><button
        class="btn btn-outline-secondary"
        (click)="cargar()"
        [disabled]="cargando || guardando"
      >
        Actualizar
      </button>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Especialidad</th>
          <th>Descripción</th>
          <th>Estado</th>
          @if (puedeEditar) {
            <th>Acciones</th>
          }
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let dato of filtrados">
          <td>#{{ dato.idEspecialidad }}</td>
          <td class="person-name">{{ dato.nombre }}</td>
          <td>{{ dato.descripcion || '—' }}</td>
          <td>
            <span class="tag" [class.activo]="dato.estado" [class.inactivo]="!dato.estado">{{
              dato.estado ? 'Activa' : 'Inactiva'
            }}</span>
          </td>
          @if (puedeEditar) {
            <td>
              <div class="actions">
                <button
                  class="btn btn-sm btn-outline-primary"
                  (click)="editar(dato)"
                  [disabled]="guardando"
                >
                  Editar</button
                ><button
                  class="btn btn-sm btn-outline-danger"
                  (click)="porEliminar = dato"
                  [disabled]="guardando"
                >
                  Eliminar
                </button>
              </div>
            </td>
          }
        </tr>
      </tbody>
    </table>
  </div>
  @if (!cargando && !filtrados.length) {
    <div class="empty-state">
      {{ busqueda ? 'No hay coincidencias para esa búsqueda.' : 'Todavía no hay registros.' }}
    </div>
  }
</section>
<p class="section-note">
  Si una especialidad tiene médicos, desactívala desde Editar para conservar las relaciones.
</p>
@if (porEliminar; as dato) {
  <div class="modal-backdrop-local">
    <section
      class="confirm-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <h2 id="confirm-title">¿Eliminar este registro?</h2>
      <p>
        {{ nombreEliminar(dato) }}<br />La eliminación solo se permite si no existen registros
        vinculados.
      </p>
      <div class="d-flex gap-2">
        <button class="btn btn-danger" (click)="confirmarEliminar()" [disabled]="guardando">
          {{ guardando ? 'Eliminando…' : 'Confirmar eliminación' }}</button
        ><button
          class="btn btn-outline-secondary"
          (click)="porEliminar = null"
          [disabled]="guardando"
        >
          Conservar
        </button>
      </div>
    </section>
  </div>
}
```

## frontend/src/app/Componentes/especialidades/especialidades.component.scss

```scss
:host {
  display: block;
}
fieldset {
  min-width: 0;
}
```

## frontend/src/app/Componentes/especialidades/especialidades.component.ts

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { Especialidad, EspecialidadRequest } from '../../modelos/especialidad';
import { EspecialidadService } from '../../Servicios/especialidad.service';
import { AuthService } from '../../Servicios/auth.service';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { FeedbackComponent } from '../../shared/feedback.component';
import { hoyLocal, mensajeError, noFuturo, requerido } from '../../shared/form-utils';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FieldErrorComponent, FeedbackComponent],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.scss',
})
export class EspecialidadesComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, requerido, Validators.maxLength(100)]],
    descripcion: ['', Validators.maxLength(255)],
    estado: [true],
  });
  lista: Especialidad[] = [];
  busqueda = '';
  cargando = false;
  guardando = false;
  error = '';
  exito = '';
  abierto = false;
  editando: number | null = null;
  porEliminar: Especialidad | null = null;
  hoy = hoyLocal();

  constructor(
    private service: EspecialidadService,
    public auth: AuthService,
  ) {}
  ngOnInit(): void {
    this.cargar();
  }
  get puedeEditar(): boolean {
    return this.auth.tieneRol('ADMIN');
  }
  get filtrados(): Especialidad[] {
    const texto = this.busqueda.trim().toLocaleLowerCase('es');
    return this.lista.filter((dato) =>
      `${dato.nombre} ${dato.descripcion ?? ''}`.toLocaleLowerCase('es').includes(texto),
    );
  }
  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.service
      .listar()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (datos) => (this.lista = datos),
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  nuevo(): void {
    this.cancelar();
    this.error = '';
    this.exito = '';
    this.abierto = true;
  }
  editar(dato: Especialidad): void {
    if (!this.puedeEditar || this.guardando) return;
    this.error = '';
    this.exito = '';
    this.editando = dato.idEspecialidad;
    this.abierto = true;

    this.form.reset({ ...dato, descripcion: dato.descripcion ?? '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  cancelar(): void {
    this.abierto = false;
    this.editando = null;
    this.form.reset({ nombre: '', descripcion: '', estado: true });
  }
  guardar(): void {
    if (this.guardando || !this.puedeEditar) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const datos: EspecialidadRequest = {
      nombre: v.nombre.trim(),
      descripcion: v.descripcion.trim() || null,
      estado: v.estado,
    };
    this.guardando = true;
    this.error = '';
    this.exito = '';
    const peticion =
      this.editando === null
        ? this.service.crear(datos)
        : this.service.actualizar(this.editando, datos);
    peticion.pipe(finalize(() => (this.guardando = false))).subscribe({
      next: () => {
        this.cancelar();
        this.exito = 'Registro guardado.';
        this.cargar();
      },
      error: (error) => (this.error = mensajeError(error)),
    });
  }
  confirmarEliminar(): void {
    if (!this.porEliminar || this.guardando || !this.puedeEditar) return;
    const id = this.porEliminar.idEspecialidad;
    this.guardando = true;
    this.error = '';
    this.exito = '';
    this.service
      .eliminar(id)
      .pipe(
        finalize(() => {
          this.guardando = false;
          this.porEliminar = null;
        }),
      )
      .subscribe({
        next: () => {
          if (this.editando === id) this.cancelar();
          this.exito = 'Registro eliminado.';
          this.cargar();
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  nombreEliminar(dato: Especialidad): string {
    return dato.nombre;
  }
}
```

## frontend/src/app/Componentes/login/login.component.html

```html
<main class="login-page">
  <section class="login-story">
    <a class="brand" href="/login"
      ><span class="brand-mark">+</span><span>Clínica<br /><strong>San Gabriel</strong></span></a
    >
    <div class="story-copy">
      <span class="eyebrow">INTRANET CLÍNICA</span>
      <h1>Más tiempo<br />para cuidar.</h1>
      <p>Pacientes, agenda y atención médica.<br />Tu equipo, en un solo lugar.</p>
      <div class="story-line"></div>
    </div>
    <span class="story-footer">Gestión de atención • San Gabriel</span>
  </section>
  <section class="login-form-wrap">
    <div class="login-form">
      <span class="eyebrow text-success">ACCESO DEL PERSONAL</span>
      <h2>Bienvenido de nuevo</h2>
      <p class="text-secondary mb-4">Ingresa con tu cuenta para continuar.</p>
      @if (aviso) {
        <div class="alert alert-info" role="status">{{ aviso }}</div>
      }
      <app-feedback [error]="error" />
      <form [formGroup]="form" (ngSubmit)="ingresar()" novalidate>
        <div class="mb-3">
          <label for="username" class="form-label">Usuario</label
          ><input
            id="username"
            class="form-control form-control-lg"
            formControlName="username"
            autocomplete="username"
            placeholder="Tu nombre de usuario"
          /><app-field-error [control]="form.controls.username" />
        </div>
        <div class="mb-4">
          <label for="password" class="form-label">Contraseña</label>
          <div class="input-group">
            <input
              id="password"
              class="form-control form-control-lg"
              formControlName="password"
              [type]="visible ? 'text' : 'password'"
              autocomplete="current-password"
            /><button
              class="btn btn-outline-secondary"
              type="button"
              (click)="visible = !visible"
              [attr.aria-label]="visible ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              {{ visible ? 'Ocultar' : 'Ver' }}
            </button>
          </div>
          <app-field-error [control]="form.controls.password" />
        </div>
        <button type="submit" class="btn btn-primary btn-lg w-100" [disabled]="enviando">
          {{ enviando ? 'Ingresando…' : 'Iniciar sesión' }}
        </button>
      </form>
      <p class="login-note">Acceso exclusivo para el personal autorizado de la clínica.</p>
    </div>
  </section>
</main>
```

## frontend/src/app/Componentes/login/login.component.scss

```scss
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.login-story {
  background: #123e35;
  color: white;
  padding: 3rem 4rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.login-story::after {
  content: '+';
  position: absolute;
  right: -0.1em;
  bottom: -0.3em;
  font-size: 31rem;
  color: #ffffff05;
  font-weight: 200;
}
.brand {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 1rem;
  line-height: 1.3;
}
.brand-mark {
  font-size: 2.4rem;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid #ffffff50;
  border-radius: 14px;
}
.story-copy {
  margin: auto 0;
  padding: 4rem 0;
  z-index: 1;
}
.story-copy h1 {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: clamp(3rem, 4.7vw, 5rem);
  line-height: 1.08;
  margin: 1.4rem 0;
}
.story-copy p {
  color: #c6ddd5;
  font-size: 1.1rem;
  line-height: 1.8;
}
.story-line {
  width: 60px;
  height: 3px;
  background: #b8cd8c;
  margin-top: 2rem;
}
.story-footer {
  font-size: 0.8rem;
  color: #b2c9c0;
}
.login-form-wrap {
  display: grid;
  place-items: center;
  padding: 3rem;
  background: #fafbf9;
}
.login-form {
  width: 100%;
  max-width: 405px;
}
h2 {
  font-size: 1.9rem;
  margin: 1rem 0 0.65rem;
  letter-spacing: -0.06rem;
}
.login-note {
  font-size: 0.8rem;
  text-align: center;
  color: #738078;
  margin: 2rem 1rem 0;
}
@media (max-width: 767px) {
  .login-page {
    grid-template-columns: 1fr;
  }
  .login-story {
    padding: 1.5rem;
  }
  .story-copy,
  .story-footer {
    display: none;
  }
  .login-form-wrap {
    padding: 3rem 1.5rem;
    min-height: 75vh;
  }
}
```

## frontend/src/app/Componentes/login/login.component.ts

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../Servicios/auth.service';
import { FeedbackComponent } from '../../shared/feedback.component';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { mensajeError, requerido } from '../../shared/form-utils';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FeedbackComponent, FieldErrorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, requerido]],
    password: ['', Validators.required],
  });
  error = '';
  enviando = false;
  visible = false;
  aviso = '';
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.aviso =
      this.route.snapshot.queryParamMap.get('sesion') === 'expirada'
        ? 'Tu sesión terminó. Ingresa nuevamente.'
        : '';
    this.auth.asegurarSesion().subscribe((activa) => {
      if (activa) void this.router.navigateByUrl('/citas');
    });
  }
  ingresar(): void {
    if (this.enviando) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.enviando = true;
    this.error = '';
    const datos = this.form.getRawValue();
    datos.username = datos.username.trim();
    this.auth
      .login(datos)
      .pipe(finalize(() => (this.enviando = false)))
      .subscribe({
        next: () => {
          const destino = this.route.snapshot.queryParamMap.get('returnUrl');
          void this.router.navigateByUrl(
            destino?.startsWith('/') && !destino.startsWith('//') && !destino.startsWith('/login')
              ? destino
              : '/citas',
          );
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
}
```

## frontend/src/app/Componentes/medicos/medicos.component.html

```html
<section class="page-heading">
  <div>
    <span class="eyebrow">DIRECTORIO CLÍNICO</span>
    <h1>Médicos</h1>
    <p>Equipo médico, especialidades y datos de contacto.</p>
  </div>
  @if (puedeEditar) {
    <button class="btn btn-primary" (click)="nuevo()" [disabled]="guardando">
      + Nuevo registro
    </button>
  }
</section>
<app-feedback [error]="error" [exito]="exito" [cargando]="cargando" />
@if (abierto && puedeEditar) {
  <section class="panel">
    <div class="panel-header">
      <h2>{{ editando === null ? 'Registrar médico' : 'Editar médico' }}</h2>
      <span class="section-note">{{ editando ? 'ID ' + editando : 'Nuevo registro' }}</span>
    </div>
    <div class="panel-body">
      <p class="required-note">Los campos con * son obligatorios.</p>
      <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
        <fieldset [disabled]="guardando">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label for="dni" class="form-label">DNI * (8 dígitos)</label
              ><input
                id="dni"
                class="form-control"
                type="text"
                formControlName="dni"
                maxlength="8"
                inputmode="numeric"
              /><app-field-error [control]="form.controls.dni" />
            </div>
            <div class="col-12 col-md-6">
              <label for="cmp" class="form-label">CMP *</label
              ><input
                id="cmp"
                class="form-control"
                type="text"
                formControlName="cmp"
                maxlength="20"
              /><app-field-error [control]="form.controls.cmp" />
            </div>
            <div class="col-12 col-md-6">
              <label for="nombres" class="form-label">Nombres *</label
              ><input
                id="nombres"
                class="form-control"
                type="text"
                formControlName="nombres"
                maxlength="100"
              /><app-field-error [control]="form.controls.nombres" />
            </div>
            <div class="col-12 col-md-6">
              <label for="apellidos" class="form-label">Apellidos *</label
              ><input
                id="apellidos"
                class="form-control"
                type="text"
                formControlName="apellidos"
                maxlength="100"
              /><app-field-error [control]="form.controls.apellidos" />
            </div>
            <div class="col-12 col-md-6">
              <label for="idEspecialidad" class="form-label">Especialidad *</label
              ><select id="idEspecialidad" class="form-select" formControlName="idEspecialidad">
                <option [ngValue]="0">Selecciona una especialidad</option>
                <option
                  *ngFor="let e of especialidades"
                  [ngValue]="e.idEspecialidad"
                  [disabled]="!e.estado && e.idEspecialidad !== especialidadOriginal"
                >
                  {{ e.nombre }}{{ e.estado ? '' : ' (inactiva)' }}
                </option></select
              ><app-field-error [control]="form.controls.idEspecialidad" />
            </div>
            <div class="col-12 col-md-6">
              <label for="estado" class="form-label">Estado</label
              ><select id="estado" class="form-select" formControlName="estado">
                <option [ngValue]="true">Activo</option>
                <option [ngValue]="false">Inactivo</option></select
              ><app-field-error [control]="form.controls.estado" />
            </div>
            <div class="col-12 col-md-6">
              <label for="telefono" class="form-label">Teléfono</label
              ><input
                id="telefono"
                class="form-control"
                type="tel"
                formControlName="telefono"
                maxlength="15"
              /><app-field-error [control]="form.controls.telefono" />
            </div>
            <div class="col-12 col-md-6">
              <label for="correo" class="form-label">Correo</label
              ><input
                id="correo"
                class="form-control"
                type="email"
                formControlName="correo"
                maxlength="100"
              /><app-field-error [control]="form.controls.correo" />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              {{ guardando ? 'Guardando…' : 'Guardar cambios' }}</button
            ><button type="button" class="btn btn-outline-secondary" (click)="cancelar()">
              Cancelar
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  </section>
}
<section class="panel">
  <div class="panel-header">
    <h2>
      Directorio <span class="tag ms-2">{{ lista.length }}</span>
    </h2>
    <div class="d-flex gap-2 align-items-center">
      <label class="visually-hidden" for="buscar">Buscar médicos</label
      ><input
        id="buscar"
        class="form-control search-box"
        [(ngModel)]="busqueda"
        placeholder="Buscar en el directorio"
      /><button
        class="btn btn-outline-secondary"
        (click)="cargar()"
        [disabled]="cargando || guardando"
      >
        Actualizar
      </button>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Médico</th>
          <th>Especialidad</th>
          <th>CMP / DNI</th>
          <th>Estado</th>
          @if (puedeEditar) {
            <th>Acciones</th>
          }
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let dato of filtrados">
          <td>#{{ dato.idMedico }}</td>
          <td>
            <span class="person-name">{{ dato.nombres }} {{ dato.apellidos }}</span
            ><span class="table-subtext">{{ dato.correo || dato.telefono || 'Sin contacto' }}</span>
          </td>
          <td>{{ dato.especialidad.nombre }}</td>
          <td>
            {{ dato.cmp }}<span class="table-subtext">{{ dato.dni }}</span>
          </td>
          <td>
            <span class="tag" [class.activo]="dato.estado" [class.inactivo]="!dato.estado">{{
              dato.estado ? 'Activo' : 'Inactivo'
            }}</span>
          </td>
          @if (puedeEditar) {
            <td>
              <div class="actions">
                <button
                  class="btn btn-sm btn-outline-primary"
                  (click)="editar(dato)"
                  [disabled]="guardando"
                >
                  Editar</button
                ><button
                  class="btn btn-sm btn-outline-danger"
                  (click)="porEliminar = dato"
                  [disabled]="guardando"
                >
                  Eliminar
                </button>
              </div>
            </td>
          }
        </tr>
      </tbody>
    </table>
  </div>
  @if (!cargando && !filtrados.length) {
    <div class="empty-state">
      {{ busqueda ? 'No hay coincidencias para esa búsqueda.' : 'Todavía no hay registros.' }}
    </div>
  }
</section>
<p class="section-note">
  Los médicos con citas no se eliminan. Puedes desactivarlos para impedir nuevas reservas.
</p>
@if (porEliminar; as dato) {
  <div class="modal-backdrop-local">
    <section
      class="confirm-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <h2 id="confirm-title">¿Eliminar este registro?</h2>
      <p>
        {{ nombreEliminar(dato) }}<br />La eliminación solo se permite si no existen registros
        vinculados.
      </p>
      <div class="d-flex gap-2">
        <button class="btn btn-danger" (click)="confirmarEliminar()" [disabled]="guardando">
          {{ guardando ? 'Eliminando…' : 'Confirmar eliminación' }}</button
        ><button
          class="btn btn-outline-secondary"
          (click)="porEliminar = null"
          [disabled]="guardando"
        >
          Conservar
        </button>
      </div>
    </section>
  </div>
}
```

## frontend/src/app/Componentes/medicos/medicos.component.scss

```scss
:host {
  display: block;
}
fieldset {
  min-width: 0;
}
```

## frontend/src/app/Componentes/medicos/medicos.component.ts

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { Medico, MedicoRequest } from '../../modelos/medico';
import { MedicoService } from '../../Servicios/medico.service';
import { AuthService } from '../../Servicios/auth.service';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { FeedbackComponent } from '../../shared/feedback.component';
import { hoyLocal, mensajeError, noFuturo, requerido } from '../../shared/form-utils';
import { EspecialidadService } from '../../Servicios/especialidad.service';
import { Especialidad } from '../../modelos/especialidad';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FieldErrorComponent, FeedbackComponent],
  templateUrl: './medicos.component.html',
  styleUrl: './medicos.component.scss',
})
export class MedicosComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    dni: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
    nombres: ['', [Validators.required, requerido, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, requerido, Validators.maxLength(100)]],
    cmp: ['', [Validators.required, requerido, Validators.maxLength(20)]],
    telefono: ['', Validators.maxLength(15)],
    correo: ['', [Validators.email, Validators.maxLength(100)]],
    idEspecialidad: [0, Validators.min(1)],
    estado: [true],
  });
  lista: Medico[] = [];
  busqueda = '';
  cargando = false;
  guardando = false;
  error = '';
  exito = '';
  abierto = false;
  editando: number | null = null;
  porEliminar: Medico | null = null;
  hoy = hoyLocal();
  especialidades: Especialidad[] = [];
  especialidadOriginal = 0;
  constructor(
    private service: MedicoService,
    public auth: AuthService,
    private especialidadService: EspecialidadService,
  ) {}
  ngOnInit(): void {
    this.cargar();
  }
  get puedeEditar(): boolean {
    return this.auth.tieneRol('ADMIN');
  }
  get filtrados(): Medico[] {
    const texto = this.busqueda.trim().toLocaleLowerCase('es');
    return this.lista.filter((dato) =>
      `${dato.nombres} ${dato.apellidos} ${dato.dni} ${dato.cmp} ${dato.especialidad.nombre}`
        .toLocaleLowerCase('es')
        .includes(texto),
    );
  }
  cargar(): void {
    this.cargando = true;
    this.error = '';
    forkJoin({ lista: this.service.listar(), especialidades: this.especialidadService.listar() })
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (res) => {
          this.lista = res.lista;
          this.especialidades = res.especialidades;
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  nuevo(): void {
    this.cancelar();
    this.error = '';
    this.exito = '';
    this.abierto = true;
  }
  editar(dato: Medico): void {
    if (!this.puedeEditar || this.guardando) return;
    this.error = '';
    this.exito = '';
    this.editando = dato.idMedico;
    this.abierto = true;
    this.especialidadOriginal = dato.especialidad.idEspecialidad;
    this.form.reset({
      ...dato,
      telefono: dato.telefono ?? '',
      correo: dato.correo ?? '',
      idEspecialidad: dato.especialidad.idEspecialidad,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  cancelar(): void {
    this.abierto = false;
    this.editando = null;
    this.form.reset({
      dni: '',
      nombres: '',
      apellidos: '',
      cmp: '',
      telefono: '',
      correo: '',
      idEspecialidad: 0,
      estado: true,
    });
    this.especialidadOriginal = 0;
  }
  guardar(): void {
    if (this.guardando || !this.puedeEditar) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const datos: MedicoRequest = {
      dni: v.dni.trim(),
      nombres: v.nombres.trim(),
      apellidos: v.apellidos.trim(),
      cmp: v.cmp.trim(),
      telefono: v.telefono.trim() || null,
      correo: v.correo.trim() || null,
      estado: v.estado,
      especialidad: { idEspecialidad: v.idEspecialidad },
    };
    this.guardando = true;
    this.error = '';
    this.exito = '';
    const peticion =
      this.editando === null
        ? this.service.crear(datos)
        : this.service.actualizar(this.editando, datos);
    peticion.pipe(finalize(() => (this.guardando = false))).subscribe({
      next: () => {
        this.cancelar();
        this.exito = 'Registro guardado.';
        this.cargar();
      },
      error: (error) => (this.error = mensajeError(error)),
    });
  }
  confirmarEliminar(): void {
    if (!this.porEliminar || this.guardando || !this.puedeEditar) return;
    const id = this.porEliminar.idMedico;
    this.guardando = true;
    this.error = '';
    this.exito = '';
    this.service
      .eliminar(id)
      .pipe(
        finalize(() => {
          this.guardando = false;
          this.porEliminar = null;
        }),
      )
      .subscribe({
        next: () => {
          if (this.editando === id) this.cancelar();
          this.exito = 'Registro eliminado.';
          this.cargar();
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  nombreEliminar(dato: Medico): string {
    return dato.nombres + ' ' + dato.apellidos;
  }
}
```

## frontend/src/app/Componentes/menu/menu.component.html

```html
<div class="app-shell">
  <aside class="sidebar" [class.mobile-open]="abierto">
    <a class="sidebar-brand" routerLink="/citas"
      ><span class="brand-icon">+</span><span>Clínica<strong>San Gabriel</strong></span></a
    >
    <p class="nav-label">ESPACIO DE TRABAJO</p>
    <nav aria-label="Menú principal" (click)="abierto = false">
      <a routerLink="/citas" routerLinkActive="active"
        ><span class="nav-symbol">▦</span> Agenda de citas</a
      >
      <a routerLink="/pacientes" routerLinkActive="active"
        ><span class="nav-symbol">♧</span> Pacientes</a
      >
      <a routerLink="/medicos" routerLinkActive="active"
        ><span class="nav-symbol">✚</span> Médicos</a
      >
      <a routerLink="/especialidades" routerLinkActive="active"
        ><span class="nav-symbol">◈</span> Especialidades</a
      >
      @if (auth.tieneRol('ADMIN', 'MEDICO')) {
        <a routerLink="/atenciones" routerLinkActive="active"
          ><span class="nav-symbol">▤</span> Atenciones</a
        >
      }
    </nav>
    <div class="sidebar-footer">
      <div class="small mb-2">Sesión de {{ auth.perfil()?.rol }}</div>
      <button class="btn btn-outline-light w-100" (click)="salir()">Cerrar sesión</button>
    </div>
  </aside>
  <div class="workspace">
    <header class="topbar">
      <div class="d-flex align-items-center gap-3">
        <button
          class="btn btn-outline-secondary mobile-toggle"
          (click)="abierto = !abierto"
          [attr.aria-expanded]="abierto"
          aria-label="Abrir menú"
        >
          ☰</button
        ><span class="topbar-label">Gestión de la clínica</span>
      </div>
      <div class="user-chip">
        <span class="avatar">{{ auth.perfil()?.username?.slice(0, 1)?.toUpperCase() }}</span
        ><span
          >{{ auth.perfil()?.username }}<small>{{ auth.perfil()?.rol }}</small></span
        >
      </div>
    </header>
    <main id="contenido" class="main-content"><router-outlet /></main>
    <footer class="workspace-footer">Clínica San Gabriel · Intranet</footer>
  </div>
</div>
```

## frontend/src/app/Componentes/menu/menu.component.scss

```scss
.app-shell {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 242px;
  background: #123e35;
  color: #fff;
  padding: 2rem 1.15rem;
  position: fixed;
  inset: 0 auto 0 0;
  display: flex;
  flex-direction: column;
  z-index: 20;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #fff;
  text-decoration: none;
  font-size: 0.85rem;
  margin: 0 0.4rem 3rem;
  line-height: 1.45;
}
.sidebar-brand strong {
  display: block;
  font-size: 1.15rem;
}
.brand-icon {
  border: 1px solid #ffffff55;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  font-size: 2rem;
  text-align: center;
  line-height: 40px;
}
.nav-label {
  font-size: 0.62rem;
  letter-spacing: 0.12rem;
  color: #acc4bc;
  padding: 0 0.8rem;
  margin-bottom: 1rem;
}
nav {
  display: grid;
  gap: 0.4rem;
}
nav a {
  padding: 0.85rem 0.8rem;
  text-decoration: none;
  color: #cfe1db;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  gap: 0.85rem;
  align-items: center;
}
nav a:hover,
nav a.active {
  background: #ffffff14;
  color: white;
}
nav a.active {
  box-shadow: inset 3px 0 #cfdfa7;
}
.nav-symbol {
  font-size: 1.15rem;
  width: 22px;
  text-align: center;
}
.sidebar-footer {
  margin-top: auto;
  padding: 0.7rem 0.5rem 0;
  color: #c8dbd3;
}
.workspace {
  margin-left: 242px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.topbar {
  height: 80px;
  border-bottom: 1px solid #e5eae7;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
}
.topbar-label {
  font-size: 0.85rem;
  color: #64766d;
}
.user-chip {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.8rem;
}
.user-chip small {
  display: block;
  color: #75867c;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  margin-top: 2px;
}
.avatar {
  height: 35px;
  width: 35px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e5eee5;
  color: #255548;
  font-weight: 600;
}
.main-content {
  padding: 2.3rem 2.5rem;
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
}
.workspace-footer {
  padding: 0 2.5rem 1.3rem;
  color: #859189;
  font-size: 0.7rem;
}
.mobile-toggle {
  display: none;
}
@media (max-width: 1000px) {
  .sidebar {
    width: 210px;
  }
  .workspace {
    margin-left: 210px;
  }
  .main-content {
    padding: 1.8rem;
  }
  .topbar {
    padding: 0 1.8rem;
  }
}
@media (max-width: 767px) {
  .sidebar {
    display: none;
    top: 80px;
    width: 242px;
  }
  .sidebar.mobile-open {
    display: flex;
  }
  .workspace {
    margin-left: 0;
  }
  .main-content {
    padding: 1.25rem;
  }
  .mobile-toggle {
    display: block;
  }
  .topbar {
    padding: 0 1rem;
  }
  .topbar-label {
    display: none;
  }
}
```

## frontend/src/app/Componentes/menu/menu.component.ts

```typescript
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../Servicios/auth.service';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  abierto = false;
  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}
  salir(): void {
    this.auth.limpiarSesion();
    void this.router.navigateByUrl('/login');
  }
}
```

## frontend/src/app/Componentes/pacientes/pacientes.component.html

```html
<section class="page-heading">
  <div>
    <span class="eyebrow">DIRECTORIO CLÍNICO</span>
    <h1>Pacientes</h1>
    <p>Directorio e información de contacto de los pacientes.</p>
  </div>
  @if (puedeEditar) {
    <button class="btn btn-primary" (click)="nuevo()" [disabled]="guardando">
      + Nuevo registro
    </button>
  }
</section>
<app-feedback [error]="error" [exito]="exito" [cargando]="cargando" />
@if (abierto && puedeEditar) {
  <section class="panel">
    <div class="panel-header">
      <h2>{{ editando === null ? 'Registrar paciente' : 'Editar paciente' }}</h2>
      <span class="section-note">{{ editando ? 'ID ' + editando : 'Nuevo registro' }}</span>
    </div>
    <div class="panel-body">
      <p class="required-note">Los campos con * son obligatorios.</p>
      <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
        <fieldset [disabled]="guardando">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label for="dni" class="form-label">DNI * (8 dígitos)</label
              ><input
                id="dni"
                class="form-control"
                type="text"
                formControlName="dni"
                maxlength="8"
                inputmode="numeric"
              /><app-field-error [control]="form.controls.dni" />
            </div>
            <div class="col-12 col-md-6">
              <label for="fechaNacimiento" class="form-label">Fecha de nacimiento *</label
              ><input
                id="fechaNacimiento"
                class="form-control"
                type="date"
                formControlName="fechaNacimiento"
                [max]="hoy"
              /><app-field-error [control]="form.controls.fechaNacimiento" />
            </div>
            <div class="col-12 col-md-6">
              <label for="nombres" class="form-label">Nombres *</label
              ><input
                id="nombres"
                class="form-control"
                type="text"
                formControlName="nombres"
                maxlength="100"
              /><app-field-error [control]="form.controls.nombres" />
            </div>
            <div class="col-12 col-md-6">
              <label for="apellidos" class="form-label">Apellidos *</label
              ><input
                id="apellidos"
                class="form-control"
                type="text"
                formControlName="apellidos"
                maxlength="100"
              /><app-field-error [control]="form.controls.apellidos" />
            </div>
            <div class="col-12 col-md-6">
              <label for="sexo" class="form-label">Sexo</label
              ><select id="sexo" class="form-select" formControlName="sexo">
                <option value="">Sin especificar</option>
                <option value="F">Femenino</option>
                <option value="M">Masculino</option></select
              ><app-field-error [control]="form.controls.sexo" />
            </div>
            <div class="col-12 col-md-6">
              <label for="telefono" class="form-label">Teléfono</label
              ><input
                id="telefono"
                class="form-control"
                type="tel"
                formControlName="telefono"
                maxlength="15"
              /><app-field-error [control]="form.controls.telefono" />
            </div>
            <div class="col-12 col-md-6">
              <label for="correo" class="form-label">Correo</label
              ><input
                id="correo"
                class="form-control"
                type="email"
                formControlName="correo"
                maxlength="100"
              /><app-field-error [control]="form.controls.correo" />
            </div>
            <div class="col-12 col-md-6">
              <label for="direccion" class="form-label">Dirección</label
              ><input
                id="direccion"
                class="form-control"
                type="text"
                formControlName="direccion"
                maxlength="200"
              /><app-field-error [control]="form.controls.direccion" />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              {{ guardando ? 'Guardando…' : 'Guardar cambios' }}</button
            ><button type="button" class="btn btn-outline-secondary" (click)="cancelar()">
              Cancelar
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  </section>
}
<section class="panel">
  <div class="panel-header">
    <h2>
      Directorio <span class="tag ms-2">{{ lista.length }}</span>
    </h2>
    <div class="d-flex gap-2 align-items-center">
      <label class="visually-hidden" for="buscar">Buscar pacientes</label
      ><input
        id="buscar"
        class="form-control search-box"
        [(ngModel)]="busqueda"
        placeholder="Buscar en el directorio"
      /><button
        class="btn btn-outline-secondary"
        (click)="cargar()"
        [disabled]="cargando || guardando"
      >
        Actualizar
      </button>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Paciente</th>
          <th>DNI</th>
          <th>Nacimiento</th>
          <th>Contacto</th>
          @if (puedeEditar) {
            <th>Acciones</th>
          }
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let dato of filtrados">
          <td>#{{ dato.idPaciente }}</td>
          <td>
            <span class="person-name">{{ dato.nombres }} {{ dato.apellidos }}</span
            ><span class="table-subtext">{{ dato.direccion || 'Sin dirección registrada' }}</span>
          </td>
          <td>{{ dato.dni }}</td>
          <td>{{ dato.fechaNacimiento | date: 'dd/MM/yyyy' }}</td>
          <td>
            {{ dato.telefono || '—' }}<span class="table-subtext">{{ dato.correo || '' }}</span>
          </td>
          @if (puedeEditar) {
            <td>
              <div class="actions">
                <button
                  class="btn btn-sm btn-outline-primary"
                  (click)="editar(dato)"
                  [disabled]="guardando"
                >
                  Editar</button
                ><button
                  class="btn btn-sm btn-outline-danger"
                  (click)="porEliminar = dato"
                  [disabled]="guardando"
                >
                  Eliminar
                </button>
              </div>
            </td>
          }
        </tr>
      </tbody>
    </table>
  </div>
  @if (!cargando && !filtrados.length) {
    <div class="empty-state">
      {{ busqueda ? 'No hay coincidencias para esa búsqueda.' : 'Todavía no hay registros.' }}
    </div>
  }
</section>
<p class="section-note">
  Solo se eliminan pacientes sin citas. Los pacientes con historial se conservan.
</p>
@if (porEliminar; as dato) {
  <div class="modal-backdrop-local">
    <section
      class="confirm-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <h2 id="confirm-title">¿Eliminar este registro?</h2>
      <p>
        {{ nombreEliminar(dato) }}<br />La eliminación solo se permite si no existen registros
        vinculados.
      </p>
      <div class="d-flex gap-2">
        <button class="btn btn-danger" (click)="confirmarEliminar()" [disabled]="guardando">
          {{ guardando ? 'Eliminando…' : 'Confirmar eliminación' }}</button
        ><button
          class="btn btn-outline-secondary"
          (click)="porEliminar = null"
          [disabled]="guardando"
        >
          Conservar
        </button>
      </div>
    </section>
  </div>
}
```

## frontend/src/app/Componentes/pacientes/pacientes.component.scss

```scss
:host {
  display: block;
}
fieldset {
  min-width: 0;
}
```

## frontend/src/app/Componentes/pacientes/pacientes.component.ts

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { Paciente, PacienteRequest } from '../../modelos/paciente';
import { PacienteService } from '../../Servicios/paciente.service';
import { AuthService } from '../../Servicios/auth.service';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { FeedbackComponent } from '../../shared/feedback.component';
import { hoyLocal, mensajeError, noFuturo, requerido } from '../../shared/form-utils';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FieldErrorComponent, FeedbackComponent],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss',
})
export class PacientesComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    dni: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
    nombres: ['', [Validators.required, requerido, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, requerido, Validators.maxLength(100)]],
    fechaNacimiento: ['', [Validators.required, noFuturo]],
    sexo: [''],
    telefono: ['', Validators.maxLength(15)],
    correo: ['', [Validators.email, Validators.maxLength(100)]],
    direccion: ['', Validators.maxLength(200)],
  });
  lista: Paciente[] = [];
  busqueda = '';
  cargando = false;
  guardando = false;
  error = '';
  exito = '';
  abierto = false;
  editando: number | null = null;
  porEliminar: Paciente | null = null;
  hoy = hoyLocal();

  constructor(
    private service: PacienteService,
    public auth: AuthService,
  ) {}
  ngOnInit(): void {
    this.cargar();
  }
  get puedeEditar(): boolean {
    return this.auth.tieneRol('ADMIN', 'RECEPCION');
  }
  get filtrados(): Paciente[] {
    const texto = this.busqueda.trim().toLocaleLowerCase('es');
    return this.lista.filter((dato) =>
      `${dato.nombres} ${dato.apellidos} ${dato.dni}`.toLocaleLowerCase('es').includes(texto),
    );
  }
  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.service
      .listar()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (datos) => (this.lista = datos),
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  nuevo(): void {
    this.cancelar();
    this.error = '';
    this.exito = '';
    this.abierto = true;
  }
  editar(dato: Paciente): void {
    if (!this.puedeEditar || this.guardando) return;
    this.error = '';
    this.exito = '';
    this.editando = dato.idPaciente;
    this.abierto = true;

    this.form.reset({
      ...dato,
      sexo: dato.sexo ?? '',
      telefono: dato.telefono ?? '',
      correo: dato.correo ?? '',
      direccion: dato.direccion ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  cancelar(): void {
    this.abierto = false;
    this.editando = null;
    this.form.reset({
      dni: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      sexo: '',
      telefono: '',
      correo: '',
      direccion: '',
    });
  }
  guardar(): void {
    if (this.guardando || !this.puedeEditar) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const datos: PacienteRequest = {
      ...v,
      dni: v.dni.trim(),
      nombres: v.nombres.trim(),
      apellidos: v.apellidos.trim(),
      sexo: v.sexo === 'M' || v.sexo === 'F' ? v.sexo : null,
      telefono: v.telefono.trim() || null,
      correo: v.correo.trim() || null,
      direccion: v.direccion.trim() || null,
    };
    this.guardando = true;
    this.error = '';
    this.exito = '';
    const peticion =
      this.editando === null
        ? this.service.crear(datos)
        : this.service.actualizar(this.editando, datos);
    peticion.pipe(finalize(() => (this.guardando = false))).subscribe({
      next: () => {
        this.cancelar();
        this.exito = 'Registro guardado.';
        this.cargar();
      },
      error: (error) => (this.error = mensajeError(error)),
    });
  }
  confirmarEliminar(): void {
    if (!this.porEliminar || this.guardando || !this.puedeEditar) return;
    const id = this.porEliminar.idPaciente;
    this.guardando = true;
    this.error = '';
    this.exito = '';
    this.service
      .eliminar(id)
      .pipe(
        finalize(() => {
          this.guardando = false;
          this.porEliminar = null;
        }),
      )
      .subscribe({
        next: () => {
          if (this.editando === id) this.cancelar();
          this.exito = 'Registro eliminado.';
          this.cargar();
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  nombreEliminar(dato: Paciente): string {
    return dato.nombres + ' ' + dato.apellidos;
  }
}
```

## frontend/src/app/Componentes/sin-permiso/sin-permiso.component.ts

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-sin-permiso',
  standalone: true,
  imports: [RouterLink],
  template: `<section class="empty-state">
    <span class="eyebrow">ACCESO RESTRINGIDO</span>
    <h1 class="mt-3">No tienes permiso para esta sección</h1>
    <p>Tu sesión sigue activa. Puedes volver a la agenda.</p>
    <a routerLink="/citas" class="btn btn-primary">Ir a citas</a>
  </section>`,
})
export class SinPermisoComponent {}
```

## frontend/src/app/Servicios/atencion.service.ts

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Atencion, AtencionRequest } from '../modelos/atencion';

@Injectable({ providedIn: 'root' })
export class AtencionService {
  private readonly url = `${environment.apiUrl}/atenciones`;
  constructor(private http: HttpClient) {}
  listar(): Observable<Atencion[]> {
    return this.http.get<Atencion[]>(this.url);
  }
  crear(datos: AtencionRequest): Observable<Atencion> {
    return this.http.post<Atencion>(this.url, datos);
  }
  actualizar(id: number, datos: AtencionRequest): Observable<Atencion> {
    return this.http.put<Atencion>(`${this.url}/${id}`, datos);
  }
}
```

## frontend/src/app/Servicios/auth.service.ts

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, Perfil, Rol } from '../modelos/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'san-gabriel-token';
  private readonly perfilActual = signal<Perfil | null>(null);
  readonly perfil = this.perfilActual.asReadonly();
  private recuperacion?: Observable<boolean>;
  constructor(private http: HttpClient) {}

  token(): string | null {
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')));
      return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now() ? token : null;
    } catch {
      return null;
    }
  }
  login(datos: LoginRequest): Observable<Perfil> {
    this.limpiarSesion();
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, datos).pipe(
      tap((respuesta) => sessionStorage.setItem(this.tokenKey, respuesta.token)),
      switchMap(() => this.http.get<Perfil>(`${environment.apiUrl}/usuarios/me`)),
      tap((perfil) => this.perfilActual.set(perfil)),
      catchError((error) => {
        this.limpiarSesion();
        return throwError(() => error);
      }),
    );
  }
  asegurarSesion(): Observable<boolean> {
    if (!this.token()) {
      this.limpiarSesion();
      return of(false);
    }
    if (this.perfilActual()) return of(true);
    if (!this.recuperacion) {
      this.recuperacion = this.http.get<Perfil>(`${environment.apiUrl}/usuarios/me`).pipe(
        tap((perfil) => this.perfilActual.set(perfil)),
        map((perfil) => perfil.activo),
        catchError(() => {
          this.limpiarSesion();
          return of(false);
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
      );
    }
    return this.recuperacion;
  }
  tieneRol(...roles: Rol[]): boolean {
    const perfil = this.perfilActual();
    return !!perfil && perfil.activo && roles.includes(perfil.rol);
  }
  limpiarSesion(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.perfilActual.set(null);
    this.recuperacion = undefined;
  }
}
```

## frontend/src/app/Servicios/cita.service.ts

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CitaRequest, CitaResponse, EstadoCita } from '../modelos/cita';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly url = `${environment.apiUrl}/citas`;
  constructor(private http: HttpClient) {}
  listar(fecha = ''): Observable<CitaResponse[]> {
    return this.http.get<CitaResponse[]>(this.url, { params: fecha ? { fecha } : {} });
  }
  crear(datos: CitaRequest): Observable<CitaResponse> {
    return this.http.post<CitaResponse>(this.url, datos);
  }
  actualizar(id: number, datos: CitaRequest): Observable<CitaResponse> {
    return this.http.put<CitaResponse>(`${this.url}/${id}`, datos);
  }
  cambiarEstado(id: number, nuevoEstado: EstadoCita): Observable<CitaResponse> {
    return this.http.patch<CitaResponse>(`${this.url}/${id}/estado`, null, {
      params: { nuevoEstado },
    });
  }
}
```

## frontend/src/app/Servicios/especialidad.service.ts

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Especialidad, EspecialidadRequest } from '../modelos/especialidad';

@Injectable({ providedIn: 'root' })
export class EspecialidadService {
  private readonly url = `${environment.apiUrl}/especialidades`;
  constructor(private http: HttpClient) {}
  listar(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.url);
  }
  crear(datos: EspecialidadRequest): Observable<Especialidad> {
    return this.http.post<Especialidad>(this.url, datos);
  }
  actualizar(id: number, datos: EspecialidadRequest): Observable<Especialidad> {
    return this.http.put<Especialidad>(`${this.url}/${id}`, datos);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
```

## frontend/src/app/Servicios/medico.service.ts

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Medico, MedicoRequest } from '../modelos/medico';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private readonly url = `${environment.apiUrl}/medicos`;
  constructor(private http: HttpClient) {}
  listar(idEspecialidad?: number): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.url, { params: idEspecialidad ? { idEspecialidad } : {} });
  }
  crear(datos: MedicoRequest): Observable<Medico> {
    return this.http.post<Medico>(this.url, datos);
  }
  actualizar(id: number, datos: MedicoRequest): Observable<Medico> {
    return this.http.put<Medico>(`${this.url}/${id}`, datos);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
```

## frontend/src/app/Servicios/paciente.service.ts

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paciente, PacienteRequest } from '../modelos/paciente';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly url = `${environment.apiUrl}/pacientes`;
  constructor(private http: HttpClient) {}
  listar(dni = ''): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.url, { params: dni ? { dni } : {} });
  }
  crear(datos: PacienteRequest): Observable<Paciente> {
    return this.http.post<Paciente>(this.url, datos);
  }
  actualizar(id: number, datos: PacienteRequest): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.url}/${id}`, datos);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
```

## frontend/src/app/app.component.html

```html
<router-outlet />
```

## frontend/src/app/app.component.scss

```scss
:host {
  display: block;
  min-height: 100vh;
}
```

## frontend/src/app/app.component.ts

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
```

## frontend/src/app/app.config.ts

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

## frontend/src/app/app.routes.ts

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { MenuComponent } from './Componentes/menu/menu.component';
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./Componentes/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MenuComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'citas' },
      {
        path: 'citas',
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'RECEPCION', 'MEDICO'] },
        loadComponent: () =>
          import('./Componentes/citas/citas.component').then((m) => m.CitasComponent),
      },
      {
        path: 'pacientes',
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'RECEPCION', 'MEDICO'] },
        loadComponent: () =>
          import('./Componentes/pacientes/pacientes.component').then((m) => m.PacientesComponent),
      },
      {
        path: 'medicos',
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'RECEPCION', 'MEDICO'] },
        loadComponent: () =>
          import('./Componentes/medicos/medicos.component').then((m) => m.MedicosComponent),
      },
      {
        path: 'especialidades',
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'RECEPCION', 'MEDICO'] },
        loadComponent: () =>
          import('./Componentes/especialidades/especialidades.component').then(
            (m) => m.EspecialidadesComponent,
          ),
      },
      {
        path: 'atenciones',
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'MEDICO'] },
        loadComponent: () =>
          import('./Componentes/atenciones/atenciones.component').then(
            (m) => m.AtencionesComponent,
          ),
      },
      {
        path: 'sin-permiso',
        loadComponent: () =>
          import('./Componentes/sin-permiso/sin-permiso.component').then(
            (m) => m.SinPermisoComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'citas' },
];
```

## frontend/src/app/core/auth.guard.ts

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../Servicios/auth.service';
import { Rol } from '../modelos/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.asegurarSesion().pipe(
    map((activo) => {
      if (!activo)
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      const roles = route.data['roles'] as Rol[] | undefined;
      return !roles || auth.tieneRol(...roles) ? true : router.createUrlTree(['/sin-permiso']);
    }),
  );
};
```

## frontend/src/app/core/auth.interceptor.ts

```typescript
import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../Servicios/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const esApi = request.url.startsWith(`${environment.apiUrl}/`);
  const esLogin = request.url === `${environment.apiUrl}/auth/login`;
  const token = auth.token();
  const peticion =
    esApi && !esLogin && token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;
  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      if (esApi && !esLogin && error.status === 401) {
        auth.limpiarSesion();
        void router.navigate(['/login'], { queryParams: { sesion: 'expirada' } });
      }
      return throwError(() => error);
    }),
  );
};
```

## frontend/src/app/modelos/atencion.ts

```typescript
import { CitaDetalle } from './cita';
export interface Atencion {
  idAtencion: number;
  cita: CitaDetalle;
  fechaHoraAtencion: string | null;
  signosVitales: string | null;
  diagnostico: string;
  tratamientoReceta: string | null;
  observaciones: string | null;
}
export interface AtencionRequest {
  cita: { idCita: number };
  signosVitales: string | null;
  diagnostico: string;
  tratamientoReceta: string | null;
  observaciones: string | null;
}
```

## frontend/src/app/modelos/auth.ts

```typescript
export type Rol = 'ADMIN' | 'RECEPCION' | 'MEDICO';
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}
export interface Perfil {
  id: number;
  username: string;
  rol: Rol;
  activo: boolean;
}
```

## frontend/src/app/modelos/cita.ts

```typescript
import { Medico } from './medico';
import { Paciente } from './paciente';
export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
export interface CitaRequest {
  idPaciente: number;
  idMedico: number;
  fechaCita: string;
  horaCita: string;
  motivoConsulta: string | null;
}
export interface CitaResponse extends CitaRequest {
  idCita: number;
  estado: EstadoCita;
}
// /api/citas usa el DTO plano. /api/atenciones devuelve la cita anidada de la entidad.
export interface CitaDetalle {
  idCita: number;
  paciente: Paciente;
  medico: Medico;
  fechaCita: string;
  horaCita: string;
  motivoConsulta: string | null;
  estado: EstadoCita;
  fechaCreacion: string | null;
}
```

## frontend/src/app/modelos/especialidad.ts

```typescript
export interface Especialidad {
  idEspecialidad: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
}
export type EspecialidadRequest = Omit<Especialidad, 'idEspecialidad'>;
```

## frontend/src/app/modelos/medico.ts

```typescript
import { Especialidad } from './especialidad';
export interface Medico {
  idMedico: number;
  dni: string;
  nombres: string;
  apellidos: string;
  cmp: string;
  telefono: string | null;
  correo: string | null;
  especialidad: Especialidad;
  estado: boolean;
}
export type MedicoRequest = Omit<Medico, 'idMedico' | 'especialidad'> & {
  especialidad: { idEspecialidad: number };
};
```

## frontend/src/app/modelos/paciente.ts

```typescript
export interface Paciente {
  idPaciente: number;
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F' | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  fechaRegistro: string | null;
}
export type PacienteRequest = Omit<Paciente, 'idPaciente' | 'fechaRegistro'>;
```

## frontend/src/app/shared/feedback.component.ts

```typescript
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-feedback',
  standalone: true,
  template: `
    @if (error) {
      <div class="alert alert-danger" role="alert">{{ error }}</div>
    }
    @if (exito) {
      <div class="alert alert-success" role="status">{{ exito }}</div>
    }
    @if (cargando) {
      <div class="loading-state" role="status">
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Cargando datos…
      </div>
    }
  `,
})
export class FeedbackComponent {
  @Input() error = '';
  @Input() exito = '';
  @Input() cargando = false;
}
```

## frontend/src/app/shared/field-error.component.ts

```typescript
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  standalone: true,
  template: `@if (control?.invalid && control?.touched) {
    <div class="field-error" role="alert">{{ mensaje }}</div>
  }`,
})
export class FieldErrorComponent {
  @Input({ required: true }) control: AbstractControl | null = null;
  get mensaje(): string {
    const e = this.control?.errors ?? {};
    if (e['required']) return 'Completa este campo.';
    if (e['email']) return 'Escribe un correo válido.';
    if (e['pattern']) return 'Revisa el formato indicado para este campo.';
    if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres.`;
    if (e['min']) return 'Selecciona una opción.';
    if (e['futuro']) return 'La fecha de nacimiento no puede ser futura.';
    return 'Revisa este campo.';
  }
}
```

## frontend/src/app/shared/form-utils.ts

```typescript
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

export function requerido(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && !control.value.trim() ? { required: true } : null;
}
export function hoyLocal(): string {
  const fecha = new Date();
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}
export function noFuturo(control: AbstractControl): ValidationErrors | null {
  return control.value && control.value > hoyLocal() ? { futuro: true } : null;
}
export function mensajeError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'No se pudo completar la operación.';
  if (error.status === 0)
    return 'No hay conexión con el servidor. Comprueba que Spring Boot esté iniciado en el puerto 8080 y que CORS permita localhost:4200.';
  if (error.status === 401)
    return 'Credenciales incorrectas o sesión vencida. Vuelve a iniciar sesión.';
  if (error.status === 403) return 'Tu usuario no tiene permisos para esta operación.';
  if (typeof error.error?.message === 'string') return error.error.message;
  if (typeof error.error?.detail === 'string') return error.error.detail;
  return (
    (
      {
        400: 'Revisa los datos del formulario.',
        404: 'El registro ya no existe. Actualiza la lista.',
        409: 'Hay datos duplicados o registros vinculados.',
      } as Record<number, string>
    )[error.status] ?? 'Ocurrió un error en el servidor. Inténtalo nuevamente.'
  );
}
```

## frontend/src/environments/environment.ts

```typescript
export const environment = { apiUrl: 'http://localhost:8080/api' };
```

## frontend/src/index.html

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Clínica San Gabriel · Intranet</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#123e35" />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

## frontend/src/main.ts

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
bootstrapApplication(AppComponent, appConfig).catch((error) => console.error(error));
```

## frontend/src/styles.scss

```scss
:root {
  --sg-green: #23624e;
  --sg-ink: #24392f;
  --sg-muted: #718078;
}
body {
  margin: 0;
  background: #f5f7f4;
  color: var(--sg-ink);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    sans-serif;
  font-size: 0.93rem;
}
h1,
h2,
h3 {
  color: #223c30;
}
h1 {
  font-size: 2rem;
  letter-spacing: -0.065rem;
  font-weight: 650;
}
h2 {
  font-size: 1.15rem;
}
h3 {
  font-size: 1rem;
}
.eyebrow {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14rem;
}
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.6rem;
}
.page-heading p {
  color: var(--sg-muted);
  margin: 0.55rem 0 0;
  line-height: 1.6;
}
.page-heading .eyebrow {
  color: #7b8c7e;
  margin-bottom: 0.6rem;
  display: block;
}
.btn {
  font-size: 0.85rem;
  border-radius: 7px;
  padding: 0.6rem 1rem;
  font-weight: 500;
}
.btn-sm {
  font-size: 0.76rem;
  padding: 0.35rem 0.65rem;
}
.btn-primary {
  --bs-btn-bg: #23624e;
  --bs-btn-border-color: #23624e;
  --bs-btn-hover-bg: #174c3c;
  --bs-btn-hover-border-color: #174c3c;
  --bs-btn-active-bg: #174c3c;
  --bs-btn-active-border-color: #174c3c;
  --bs-btn-disabled-bg: #23624e;
  --bs-btn-disabled-border-color: #23624e;
}
.btn-outline-primary {
  --bs-btn-color: #23624e;
  --bs-btn-border-color: #c3d6ca;
  --bs-btn-hover-bg: #23624e;
  --bs-btn-hover-border-color: #23624e;
}
.panel {
  background: #fff;
  border: 1px solid #e3e9e3;
  border-radius: 12px;
  box-shadow: 0 2px 3px #17382903;
  margin-bottom: 1.5rem;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #edf0eb;
}
.panel-header h2 {
  margin: 0;
}
.panel-body {
  padding: 1.5rem;
}
.table {
  margin-bottom: 0;
  font-size: 0.85rem;
  --bs-table-hover-bg: #f4f8f3;
}
.table thead th {
  background: #f7f9f6;
  color: #728075;
  font-size: 0.67rem;
  font-weight: 650;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  white-space: nowrap;
  border-bottom: 1px solid #e5eae3;
  padding: 1rem;
}
.table td {
  padding: 1rem;
  vertical-align: middle;
  border-color: #edf1eb;
}
.table td:first-child,
.table th:first-child {
  padding-left: 1.5rem;
}
.person-name {
  font-weight: 600;
  color: #2f4839;
}
.table-subtext {
  display: block;
  color: #7f8c81;
  font-size: 0.75rem;
  margin-top: 3px;
}
.actions {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.tag {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.02rem;
  border-radius: 30px;
  padding: 0.35rem 0.65rem;
  display: inline-block;
  background: #ecf0ea;
  color: #516453;
}
.tag.PENDIENTE {
  background: #fbf0d8;
  color: #866326;
}
.tag.CONFIRMADA {
  background: #e4eef9;
  color: #3c6691;
}
.tag.ATENDIDA,
.tag.activo {
  background: #e4f1e6;
  color: #36714a;
}
.tag.CANCELADA,
.tag.inactivo {
  background: #f6e8e5;
  color: #945c52;
}
.toolbar {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  align-items: end;
  margin-bottom: 1rem;
}
.toolbar .form-control,
.toolbar .form-select {
  min-width: 150px;
}
.form-label {
  font-size: 0.8rem;
  font-weight: 550;
  color: #42584a;
  margin-bottom: 0.4rem;
}
.form-control,
.form-select {
  border-color: #dce4db;
  border-radius: 7px;
  font-size: 0.87rem;
  padding: 0.65rem 0.8rem;
}
.form-control:focus,
.form-select:focus {
  border-color: #6a9f7b;
  box-shadow: 0 0 0 0.2rem #23624e12;
}
.form-control.ng-invalid.ng-touched,
.form-select.ng-invalid.ng-touched {
  border-color: #c17469;
}
.field-error {
  font-size: 0.73rem;
  color: #a23f37;
  margin-top: 0.35rem;
}
.form-actions {
  display: flex;
  gap: 0.7rem;
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid #edf0ea;
}
.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: #77887b;
}
.empty-state h1 {
  font-size: 1.6rem;
}
.loading-state {
  padding: 1rem;
  color: #586f5c;
  display: flex;
  gap: 0.6rem;
  align-items: center;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.6rem;
}
.stat-card {
  padding: 1.2rem 1.5rem;
  background: #fff;
  border: 1px solid #e3e9e3;
  border-radius: 10px;
}
.stat-label {
  color: #7b8b7c;
  font-size: 0.7rem;
  letter-spacing: 0.04rem;
}
.stat-number {
  font-size: 1.8rem;
  color: #31553d;
  display: block;
  margin-top: 0.3rem;
  font-weight: 600;
}
.alert {
  font-size: 0.85rem;
}
.section-note {
  font-size: 0.77rem;
  color: #758573;
}
.required-note {
  font-size: 0.75rem;
  color: #7c8b7e;
  margin-bottom: 1.2rem;
}
.search-box {
  max-width: 300px;
}
.modal-backdrop-local {
  position: fixed;
  inset: 0;
  background: #183c3066;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}
.confirm-dialog {
  background: #fff;
  max-width: 480px;
  width: 100%;
  padding: 1.6rem;
  border-radius: 12px;
  box-shadow: 0 10px 50px #17352625;
}
.confirm-dialog p {
  color: #6d7d70;
  line-height: 1.6;
}
.confirm-dialog h2 {
  margin-bottom: 1rem;
}
.detail-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  line-height: 1.65;
}
.metric-note {
  font-size: 0.7rem;
  color: #8b978c;
}
@media (max-width: 767px) {
  h1 {
    font-size: 1.65rem;
  }
  .page-heading {
    align-items: start;
    flex-direction: column;
  }
  .panel-header,
  .panel-body {
    padding: 1rem;
  }
  .stat-grid {
    gap: 0.5rem;
  }
  .stat-card {
    padding: 0.9rem;
  }
  .stat-number {
    font-size: 1.4rem;
  }
  .table td,
  .table thead th {
    padding: 0.75rem;
  }
  .panel-header {
    flex-wrap: wrap;
  }
}

.panel-header > .d-flex {
  max-width: 100%;
  flex-wrap: wrap;
}
.panel-header .search-box {
  min-width: 0;
  flex: 1 1 160px;
}
```

## frontend/tsconfig.app.json

```json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
```

## frontend/tsconfig.json

```json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "compileOnSave": false,
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "ES2022",
    "module": "preserve"
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  },
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    }
  ]
}
```

## frontend/tsconfig.spec.json

```json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.d.ts", "src/**/*.spec.ts"]
}
```

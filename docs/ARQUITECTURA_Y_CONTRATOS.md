# Arquitectura y contratos — APF3

## Correspondencia con la Semana 13

La solución mantiene el flujo enseñado: componente → servicio `@Injectable({ providedIn: 'root' })` → `HttpClient` → `Observable` → controlador REST → servicio Java → repositorio JPA → MySQL. Los componentes usan `OnInit`, `subscribe`, tablas Bootstrap, formularios reactivos y navegación con `routerLink`.

La base es **standalone**. `src/main.ts` ejecuta `bootstrapApplication`, y `app.config.ts` registra `provideRouter` y `provideHttpClient(withInterceptors([authInterceptor]))`. No existe un `AppModule` aislado que Angular nunca ejecute. Se configura Zone.js para que las propiedades actualizadas por `subscribe` se reflejen como en los ejemplos de la clase.

Los archivos `.scss` permiten SASS y contienen estilos CSS. Bootstrap se instala como dependencia local y se carga desde `angular.json`; no depende de un CDN durante la sustentación. No se necesita el JavaScript de Bootstrap porque los controles interactivos los maneja Angular.

La integración usa CORS global dentro de Spring Security. Se retiraron las anotaciones `@CrossOrigin(origins="*")` para evitar políticas diferentes entre controladores. Se permite únicamente `http://localhost:4200`, con métodos y encabezados necesarios. Las peticiones preflight `OPTIONS` no requieren JWT.

## Diferencias encontradas en los adjuntos

| Código recibido | Ajuste realizado |
|---|---|
| `server.port=8082` | Se estandarizó 8080, configurable con `SERVER_PORT` |
| Contraseña MySQL fija y clave JWT dentro de properties | Variables de entorno; clave generada localmente en las instrucciones |
| `MedicoService` utilizaba `existsByDni` y `existsByCmp` inexistentes en el repositorio | Métodos de consulta implementados, considerando exclusión del propio ID al editar |
| Controladores básicos mayormente GET/POST | PUT y DELETE donde corresponde; edición de citas y atenciones |
| Médicos restringidos completamente a ADMIN | Consulta habilitada para recepción y médicos; escritura reservada a ADMIN |
| Atenciones cambiaba el estado sin una transacción que cubriera todo el registro | Registro y cambio de estado en una transacción; control de cita inexistente, cerrada o duplicada |
| Pacientes/especialidades con pocas validaciones | Bean Validation, verificación de referencias y respuestas 400/404/409 |
| Cualquier cambio de estado podía marcar ATENDIDA | ATENDIDA solo se obtiene al registrar la atención |
| SQL con cinco tablas y sin INSERT | Script complementado con seguridad y datos ficticios; original conservado aparte |
| Test en paquete `com.clinica.SanGabriel` | Pruebas en `com.clinica.sangabriel`, con H2 temporal |
| `pom.xml` declaraba Java 17 | Entorno unificado en JDK 21 para este paquete |

Los cambios se limitan a la integración y mantenimiento necesarios para las pantallas. No se agregan facturación, farmacia, reportes estadísticos, registro público de usuarios ni recuperación de contraseñas.

## Modelos y JSON reales

La API usa camelCase en JSON; los nombres snake_case se usan en MySQL. Angular no debe enviar `id_paciente` ni `id_medico` como propiedades JSON.

### Autenticación

`POST /api/auth/login`

```json
{"username":"apf3.admin","password":"DemoClinica123!"}
```

Respuesta: objeto con propiedad `token` de tipo string. El backend recibido **no añade el rol al JWT ni al LoginResponse**. Angular consulta `GET /api/usuarios/me` después del login y al recuperar una sesión tras recargar.

Ejemplo de perfil, con ID ilustrativo:

```json
{"id":1,"username":"apf3.admin","rol":"ADMIN","activo":true}
```

El token se conserva en `sessionStorage`, se retira al cerrar sesión y se envía como `Authorization: Bearer ...` exclusivamente a las peticiones de la API configurada. El interceptor no añade el token al login. Un 401 de una ruta protegida limpia la sesión y dirige al login; un 403 mantiene la sesión y explica el permiso insuficiente.

El guard organiza la navegación y verifica el vencimiento local. La autenticación y autorización definitivas siguen en Spring Security: manipular el frontend no otorga permisos.

### Pacientes

`POST /api/pacientes` y `PUT /api/pacientes/{id}`:

```json
{"dni":"90000031","nombres":"Ana","apellidos":"Demo","fechaNacimiento":"2000-03-15","sexo":"F","telefono":null,"correo":"ana@example.test","direccion":"Dirección ficticia"}
```

La respuesta añade `idPaciente` y `fechaRegistro`. DNI de 8 dígitos; nombres y apellidos obligatorios; nacimiento no futuro; sexo `M`, `F` o null; correo opcional válido. No existe `estado` en el modelo Paciente recibido, por eso no se inventa una baja lógica para este módulo.

### Especialidades

```json
{"nombre":"Especialidad de prueba","descripcion":"Demostración APF3","estado":true}
```

La respuesta añade `idEspecialidad`. `estado` es booleano, no el texto `"ACTIVO"`.

### Médicos

```json
{"dni":"90000032","nombres":"Luis","apellidos":"Demo","cmp":"APF3032","telefono":null,"correo":null,"especialidad":{"idEspecialidad":1},"estado":true}
```

El ID de especialidad es ilustrativo: usar uno existente. El JSON envía **`especialidad: { idEspecialidad }`**, no un `idEspecialidad` suelto. La respuesta añade `idMedico` y devuelve la especialidad completa. Se controlan DNI y CMP duplicados. Un médico nuevo debe vincularse a una especialidad activa. Al editar puede conservar su especialidad anterior aunque esté inactiva, por ejemplo para desactivarlo o corregir su contacto; eso no habilita nuevas citas.

### Citas

`POST /api/citas` y `PUT /api/citas/{id}` usan `CitaRequest`:

```json
{"idPaciente":1,"idMedico":1,"fechaCita":"2027-01-20","horaCita":"10:30:00","motivoConsulta":"Registro de demostración"}
```

IDs y fecha son ilustrativos. Usar IDs existentes y un horario futuro al momento de probar. `CitaResponse` devuelve esos cinco campos más `idCita` y `estado`.

La especialidad del formulario filtra los médicos disponibles. **No se manda `idEspecialidad` en CitaRequest**, porque la relación se obtiene del médico. No se duplican objetos paciente o médico en ese DTO.

`PATCH /api/citas/{id}/estado?nuevoEstado=CONFIRMADA` usa el parámetro **`nuevoEstado`**, con cuerpo vacío. La UI permite confirmar o cancelar. Una cita cancelada o atendida queda cerrada; para otro turno se registra una nueva. `ATENDIDA` se asigna en el servicio de atenciones.

Se valida fecha/hora futura, médico y especialidad activos y horario ocupado. El bloqueo transaccional del médico, con aislamiento READ_COMMITTED, serializa las reservas para el mismo profesional y permite consultar el último turno confirmado tras esperar el bloqueo. La comprobación de choque es por hora exacta; el modelo recibido no define duración de consulta ni solapamientos por intervalos.

### Atenciones

```json
{"cita":{"idCita":1},"signosVitales":"Datos ficticios","diagnostico":"Registro académico de prueba","tratamientoReceta":null,"observaciones":"No corresponde a un paciente real"}
```

La respuesta añade `idAtencion`, `fechaHoraAtencion` y la **cita anidada completa**, con `paciente`, `medico` y su `especialidad`. Este JSON difiere del DTO plano de `/api/citas`: por eso existe `CitaDetalle` en Angular.

Debe existir una cita pendiente o confirmada y no tener otra atención. La creación actualiza esa cita a ATENDIDA en la misma transacción. PUT conserva la cita original y modifica el texto clínico. La versión académica no aplica una restricción adicional de fecha de la atención respecto de la cita; ese comportamiento no se presenta como una regla clínica validada.

## Endpoints y permisos

| Ruta | Método | ADMIN | RECEPCION | MEDICO |
|---|---|---|---|---|
| `/api/auth/login` | POST | Público | Público | Público |
| `/api/usuarios/me` | GET | Sí | Sí | Sí |
| `/api/pacientes` | GET | Sí | Sí | Sí |
| `/api/pacientes` | POST | Sí | Sí | No |
| `/api/pacientes/{id}` | PUT, DELETE | Sí | Sí | No |
| `/api/especialidades` | GET | Sí | Sí | Sí |
| `/api/especialidades` | POST | Sí | No | No |
| `/api/especialidades/{id}` | PUT, DELETE | Sí | No | No |
| `/api/medicos` | GET | Sí | Sí | Sí |
| `/api/medicos` | POST | Sí | No | No |
| `/api/medicos/{id}` | PUT, DELETE | Sí | No | No |
| `/api/citas` | GET | Sí | Sí | Sí |
| `/api/citas` | POST | Sí | Sí | No |
| `/api/citas/{id}` | PUT | Sí | Sí | No |
| `/api/citas/{id}/estado` | PATCH | Sí | Sí | No |
| `/api/atenciones` | GET, POST | Sí | No | Sí |
| `/api/atenciones/{id}` | PUT | Sí | No | Sí |

Filtros existentes: `/api/pacientes?dni=...`, `/api/medicos?idEspecialidad=...` y `/api/citas?fecha=YYYY-MM-DD`. Las búsquedas de texto del directorio se realizan sobre los listados cargados. No existe paginación en el backend recibido.

Los permisos son por módulo. El modelo original no relaciona Usuario con Medico; esta versión no promete restringir al médico a sus propias citas o pacientes. Si su equipo ya tiene otra matriz de permisos, revisar conjuntamente `SecurityConfig`, las rutas y los botones antes de integrar.

## Errores de la API

| Código | Comportamiento esperado |
|---|---|
| 400 | JSON/formato o validación incorrectos; Angular muestra el motivo y conserva el formulario |
| 401 | Credenciales incorrectas o autenticación inválida/expirada |
| 403 | Usuario autenticado sin permiso |
| 404 | Entidad referenciada inexistente |
| 409 | Duplicado, horario ocupado, referencia que impide eliminar o transición inválida |
| 0 en Angular | No se pudo recibir la respuesta: revisar servidor, URL y CORS |

Para errores controlados se devuelve `status`, `message` y `timestamp`. Los errores de Spring Security pueden usar el formato de error estándar; el frontend maneja 401 y 403 por su código HTTP.

## Referencias técnicas consultadas

- [Angular: configuración de HttpClient](https://angular.dev/guide/http/setup).
- [Angular: interceptores HTTP](https://angular.dev/guide/http/interceptors).
- [Spring Security: CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html).

La transcripción de la Semana 13 adjunta es la referencia del alcance académico; estas páginas respaldan las decisiones de integración.

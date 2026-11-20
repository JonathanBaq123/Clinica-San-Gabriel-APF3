# Pruebas locales y sustentación del APF3

## Definición de terminado

La entrega está terminada cuando estos puntos se comprueban sobre la versión integrada con **MySQL/MariaDB del grupo**. La compilación y las pruebas H2 incluidas son comprobaciones previas, no reemplazan esa demostración.

- [ ] El SQL se importa en una base de prueba y contiene registros en las siete tablas.
- [ ] Backend inicia en 8080 y Angular en 4200 desde una copia limpia.
- [ ] `npm ci` y `npm run build` funcionan.
- [ ] `mvnw.cmd clean test` funciona con JDK 21.
- [ ] Login válido obtiene token y perfil; login incorrecto muestra error.
- [ ] `/citas` sin sesión redirige al login.
- [ ] Una petición de API protegida sin token responde 401.
- [ ] Una petición con rol insuficiente responde 403.
- [ ] El token se añade en las peticiones de la API y se elimina al cerrar sesión.
- [ ] Recargar una página privada recupera el perfil sin perder la sesión vigente.
- [ ] Todos los formularios muestran errores de campos obligatorios y formato.
- [ ] Pacientes, médicos y especialidades permiten registrar, listar, editar y eliminar datos sin referencias.
- [ ] Se rechaza eliminar registros con relaciones; se informa el motivo.
- [ ] Médicos y especialidades inactivos no pueden usarse para nuevas citas.
- [ ] Cita vinculada a paciente y médico de la especialidad seleccionada.
- [ ] Duplicado de DNI/CMP y choque de horario se rechazan con 409.
- [ ] Una cita se puede editar/reprogramar, confirmar y cancelar.
- [ ] Cita cancelada conserva su fila y libera el turno.
- [ ] Atención guardada y cita ATENDIDA persisten juntas.
- [ ] No se permite duplicar atención ni atender una cita cancelada.
- [ ] Editar una atención conserva la cita vinculada.
- [ ] Se visualizan en MySQL los registros creados desde Angular.
- [ ] Se revisa navegación en pantalla de escritorio y teléfono, mensajes, listas vacías y servidor apagado.
- [ ] Informe actualizado, comprimido de ambos frameworks y exportación SQL final preparados.

## Casos manuales concretos

| Caso | Pasos | Resultado esperado |
|---|---|---|
| Acceso sin sesión | Cerrar sesión y escribir `/pacientes` en la barra del navegador | Redirección a login |
| Credenciales incorrectas | Escribir usuario válido y contraseña incorrecta | 401; mensaje, sin acceso a intranet |
| JWT válido | Ingresar como `apf3.admin`; abrir Network y consultar pacientes | GET 200 con encabezado Bearer |
| Sin JWT en la API | En Postman enviar GET `http://localhost:8080/api/pacientes`, con Authorization desactivado | 401 |
| JWT inválido | En Postman enviar ese GET con `Bearer token-invalido` | 401 |
| Rol insuficiente | Ingresar como recepción; llamar GET `/api/atenciones` en Postman con su token | 403; recepción mantiene acceso a sus pantallas |
| Formulario inválido | Nuevo paciente: DNI de 3 dígitos, nombres vacíos y correo inválido; guardar | Mensajes junto a los campos; no se envía una creación válida |
| Persistencia de paciente | Registrar paciente ficticio; editar teléfono; recargar página y consultar SQL | Se mantienen los datos |
| DNI duplicado | Repetir alta con DNI existente | 409 y formulario conservado |
| Catálogos | Crear especialidad y médico; editar contacto; desactivar el médico | Cambios persistidos; no aparece como opción para nueva cita |
| Baja sin referencias | Crear una especialidad temporal sin médicos; eliminar y confirmar | 204 y fila retirada de lista |
| Baja con referencias | Intentar eliminar especialidad con médico, o paciente con cita | 409; relación conservada |
| Reserva completa | Paciente existente → especialidad activa → médico activo → mañana 10:30 | Cita PENDIENTE; IDs correctos en respuesta y SQL |
| Choque | Repetir mismo médico, fecha y hora sin cancelar la anterior | 409 |
| Reprogramación | Editar cita pendiente y seleccionar otro horario futuro | Mismo ID, nuevo horario |
| Cancelación | Cancelar cita pendiente/confirmada y volver a reservar ese horario | Antigua CANCELADA; nueva cita con otro ID |
| Atención | Médico registra diagnóstico ficticio para cita confirmada | Atención creada; cita ATENDIDA |
| Duplicación de atención | Repetir POST de atención en Postman para el mismo idCita | 409 y una sola atención |
| Edición de atención | Cambiar observaciones desde la pantalla | Cambios guardados; idCita no cambia |
| Sesión vencida | Usar un token expirado en una llamada protegida | API 401; Angular vuelve a login al recibirlo |
| Servidor apagado | Detener Spring Boot y pulsar Actualizar | Mensaje de conexión; no se anuncia éxito |

Para comprobar un 400 del servidor, enviar un JSON con DNI inválido mediante Postman. La validación del navegador puede impedir que ese caso llegue a la API, lo cual es correcto.

## Guion de demostración de 10–12 minutos

Preparar MySQL y ambas terminales antes de empezar. Tener una cuenta por rol, Postman o un cliente HTTP disponible, y una ventana de consultas SQL. Usar datos ficticios identificables con `APF3`.

1. **Integrante 1, 2 minutos:** abrir `/citas` sin sesión y mostrar redirección. Entrar como administrador. Explicar `AuthService`, `HttpClient`, interceptor y guard. Mostrar una petición GET 200 con encabezado Bearer. Desde Postman, mostrar la misma API sin token → 401. Mostrar que recepción obtiene 403 al intentar consultar atenciones.
2. **Integrante 2, 2 minutos:** mostrar especialidades y médicos, registrar o editar un dato del catálogo. Explicar la relación `medicos.id_especialidad`, el selector y las validaciones. Mostrar que los registros existen en MySQL.
3. **Integrante 3, 1–2 minutos:** registrar un paciente ficticio desde Angular; mostrar un error de campo, corregirlo y guardar. Mostrar el paciente en la lista y consultar la fila en MySQL.
4. **Integrante 4, 2–3 minutos:** registrar una cita para ese paciente, elegir especialidad y médico, seleccionar horario futuro y escribir como motivo **`APF3: demostración en vivo`**. Mostrar la petición con `CitaRequest`, confirmar la cita y ejecutar la consulta SQL de abajo. Mostrar un conflicto de horario o cancelación con otra cita de prueba.
5. **Integrante 3, 1–2 minutos:** entrar como médico, registrar la atención de la cita demostrada y mostrar el detalle. Volver a la agenda: estado ATENDIDA. Ejecutar la consulta SQL que incluye la atención.
6. **Integrante 4, 1 minuto:** mostrar el informe actualizado, carpeta con ambos frameworks y SQL con INSERT. Explicar cómo arrancar la copia entregada.

Si el tiempo del profesor es menor, priorizar login → paciente → cita → MySQL → atención y conservar las evidencias de errores en el informe.

## Consultas SQL para la demostración

Estas consultas se ejecutan sobre la base de datos local. No requieren modificar datos a mano para que la demostración funcione.

```sql
USE clinica_san_gabriel;

SELECT id_paciente, dni, nombres, apellidos, telefono
FROM pacientes
ORDER BY id_paciente DESC
LIMIT 5;

SELECT c.id_cita, c.fecha_cita, c.hora_cita, c.estado,
       p.id_paciente, CONCAT(p.nombres, ' ', p.apellidos) AS paciente,
       m.id_medico, CONCAT(m.nombres, ' ', m.apellidos) AS medico,
       e.nombre AS especialidad,
       a.id_atencion, a.diagnostico, a.observaciones
FROM citas c
JOIN pacientes p ON p.id_paciente = c.id_paciente
JOIN medicos m ON m.id_medico = c.id_medico
JOIN especialidades e ON e.id_especialidad = m.id_especialidad
LEFT JOIN atenciones a ON a.id_cita = c.id_cita
WHERE c.motivo_consulta = 'APF3: demostración en vivo'
ORDER BY c.id_cita DESC;

SELECT u.username, r.nombre AS rol, u.estado
FROM usuarios u
JOIN roles r ON r.id = u.rol_id
WHERE u.username LIKE 'apf3.%';
```

Antes de la atención, `id_atencion` debe aparecer nulo; después, debe aparecer el ID y la cita debe estar ATENDIDA. Eso evidencia la relación y la persistencia real.

## Evidencias del informe

| Evidencia | Responsable | Qué debe verse / explicarse |
|---|---|---|
| Arquitectura y carpetas | 1 | Componentes, modelos, servicios REST y capas Java |
| Login y petición autenticada | 1 | Usuario, ruta, método y Bearer; ocultar la mayor parte del token |
| 401 y 403 | 1 | Diferencia entre no autenticado y rol insuficiente |
| CRUD de especialidad/médico | 2 | Formularios, registro y relación con especialidad |
| SQL y datos iniciales | 2 | Siete tablas, relaciones e INSERT de exportación |
| Paciente y validaciones | 3 | DNI, mensajes de campo y fila persistida |
| Atención vinculada | 3 | Registro, detalle y cambio transaccional de estado |
| Cita integrada | 4 | Paciente/médico/especialidad, request/response y consulta SQL |
| Pruebas y entrega | 4, con aportes de todos | Matriz con resultado real, fecha, evidencia y observaciones |

Actualizar en el informe existente los apartados de arquitectura, implementación de Angular, integración REST, seguridad, formularios, pruebas y conclusiones del avance. Mantener el formato y numeración que ya tiene su documento. Cada figura lleva un pie que explique qué demuestra, no solo el nombre de la pantalla.

No afirmar que una prueba en H2 demuestra MySQL. Usar las capturas obtenidas en su instalación para evidenciar la base exigida por el profesor.

## Comprimido final

Incluir `backend`, `frontend`, SQL final con datos, README y el informe actualizado. Verificar que dentro de `frontend` estén `src`, `angular.json`, `package.json` y `package-lock.json`, y dentro de `backend` estén `src`, `pom.xml`, ambos wrappers y `.mvn`.

Excluir `node_modules`, `.angular`, `target`, `.git` y credenciales locales. Descomprimir ese mismo archivo en otra carpeta o computadora y repetir el arranque antes de subirlo.

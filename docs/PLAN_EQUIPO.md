# Trabajo de los cuatro integrantes

## Punto de partida

El paquete ya incluye la implementación completa. La prioridad del grupo pasa a ser integrar con su versión más reciente, verificar en MySQL, corregir diferencias reales y preparar las evidencias. No conviene que cada integrante genere otro proyecto Angular o implemente un login distinto.

Este plan usa tres jornadas de trabajo como referencia porque no se recibió la fecha/hora límite exacta. Si queda menos tiempo, mantener el orden de las fases y trabajar en paralelo después de integrar la base.

## Reparto equilibrado

Las estimaciones se refieren a revisar, adaptar, probar y documentar el código entregado; no a reconstruirlo desde cero. Reservar aproximadamente 5–6 horas por integrante, más el ensayo conjunto.

| Integrante | Responsabilidad | Resultado verificable |
|---|---|---|
| 1 | Base Angular, autenticación, CORS, roles e integración de ramas | Login y rutas protegidas funcionan; 401/403 reales; versiones y configuración compartidas estables |
| 2 | Especialidades, médicos y base de datos | Catálogos con alta/edición/baja controlada; SQL importable con todas las relaciones y datos |
| 3 | Pacientes y atenciones | Validaciones de paciente; atención vinculada; estado ATENDIDA consistente; historial protegido |
| 4 | Citas, pruebas del flujo completo y armado documental | Agenda con filtros, reserva y cancelación; evidencia de persistencia; informe y comprimido coherentes |

Todos entregan sus propias capturas y texto técnico. El integrante 4 compagina el informe; no redacta desde cero el trabajo de los otros tres.

## Integrante 1 — base y seguridad

Archivos bajo su responsabilidad:

- `frontend/src/main.ts`
- `frontend/src/app/app.component.ts`, `.html`, `.scss`
- `frontend/src/app/app.config.ts`, `app.routes.ts`
- `frontend/src/app/core/auth.guard.ts`, `auth.interceptor.ts`
- `frontend/src/app/Servicios/auth.service.ts`
- `frontend/src/app/modelos/auth.ts`
- `frontend/src/app/Componentes/login/login.component.ts`, `.html`, `.scss`
- `frontend/src/app/Componentes/menu/menu.component.ts`, `.html`, `.scss`
- `frontend/src/app/Componentes/sin-permiso/sin-permiso.component.ts`
- `frontend/src/app/shared/feedback.component.ts`, `field-error.component.ts`, `form-utils.ts`
- `frontend/src/environments/environment.ts`, `src/styles.scss`, `src/index.html`, `public/favicon.svg`
- `frontend/angular.json`, `package.json`, `package-lock.json` y archivos `tsconfig*.json`
- `backend/src/main/java/com/clinica/sangabriel/config/CorsConfig.java`, `SecurityConfig.java`, `ApiExceptionHandler.java`
- Revisión de los archivos existentes `JwtAuthenticationFilter.java`, `JwtService.java`, `AuthController.java` y `UsuarioController.java`.
- `backend/src/main/resources/application.properties`, `backend/pom.xml` y `.gitignore` de la raíz.

Pasos:

1. Crear la rama inicial desde el `develop` más reciente y comparar el backend del equipo con este paquete. Conservar correcciones recientes compatibles que no aparecen en el ZIP adjunto.
2. Integrar el conjunto completo una sola vez. Revisar especialmente puerto 8080, contraseña local, clave JWT por entorno y JDK 21.
3. Ejecutar backend y Angular. Probar login válido/incorrecto, perfil, cierre de sesión y recarga de una ruta privada.
4. Probar las tres cuentas. Confirmar que recepción puede consultar médicos pero no crearlos, y que no accede a atenciones.
5. Probar `OPTIONS`, solicitud sin token e inválida, y acceso directo a una ruta prohibida.
6. Revisar que el interceptor solo envía el token a la API configurada y que no se guardan contraseñas ni claves reales en Git.
7. Entregar capturas de login, encabezado Bearer parcialmente oculto, 401 y 403; redactar la explicación del flujo de autenticación.
8. Revisar y fusionar los PR de los demás, manteniendo a `develop` ejecutable.

## Integrante 2 — médicos, especialidades y SQL

Archivos:

- `frontend/src/app/modelos/medico.ts`, `especialidad.ts`
- `frontend/src/app/Servicios/medico.service.ts`, `especialidad.service.ts`
- `frontend/src/app/Componentes/medicos/medicos.component.ts`, `.html`, `.scss`
- `frontend/src/app/Componentes/especialidades/especialidades.component.ts`, `.html`, `.scss`
- `backend/src/main/java/com/clinica/sangabriel/controller/MedicoController.java`, `EspecialidadController.java`
- `backend/src/main/java/com/clinica/sangabriel/service/MedicoService.java`, `EspecialidadService.java`
- `backend/src/main/java/com/clinica/sangabriel/repository/MedicoRepository.java`, `EspecialidadRepository.java`
- Modelos Java `Medico.java`, `Especialidad.java`.
- `database/clinica_san_gabriel.sql` y revisión de `database/esquema_original_recibido.sql`.

Pasos:

1. Importar el SQL completo en una base de pruebas y revisar las siete tablas y claves foráneas. Confirmar que las tres cuentas pueden autenticarse.
2. Desde Angular, crear una especialidad activa, un médico vinculado a ella y un segundo catálogo independiente para probar eliminación.
3. Editar descripción, contacto y estado. Comprobar JSON anidado `especialidad.idEspecialidad`.
4. Intentar registrar DNI/CMP repetidos; verificar 409 con mensaje. Enviar un cuerpo inválido desde Postman y verificar 400.
5. Probar eliminación sin relaciones y rechazo cuando existen referencias. Probar desactivación y que deje de ofrecerse para nuevas citas.
6. Revisar la consulta de médicos con la cuenta de recepción, que será utilizada por el selector de citas.
7. Después del ensayo, exportar la base real de demostración con estructura e INSERT de todas las tablas. Importar esa exportación en otra base de prueba para verificar que funciona.
8. Entregar evidencia de catálogos, relaciones SQL, validación y exportación; redactar el apartado de base de datos y catálogos.

## Integrante 3 — pacientes y atenciones

Archivos:

- `frontend/src/app/modelos/paciente.ts`, `atencion.ts`
- `frontend/src/app/Servicios/paciente.service.ts`, `atencion.service.ts`
- `frontend/src/app/Componentes/pacientes/pacientes.component.ts`, `.html`, `.scss`
- `frontend/src/app/Componentes/atenciones/atenciones.component.ts`, `.html`, `.scss`
- Controladores Java `PacienteController.java`, `AtencionController.java`.
- Servicios Java `PacienteService.java`, `AtencionService.java`.
- Repositorios Java `PacienteRepository.java`, `AtencionRepository.java`.
- Modelos Java `Paciente.java`, `Atencion.java`.

Las rutas de esos archivos Java parten de `backend/src/main/java/com/clinica/sangabriel/` y su subcarpeta `controller`, `service`, `repository` o `model`.

Pasos:

1. Registrar un paciente con datos ficticios, editar su contacto y buscarlo por DNI/nombre.
2. Probar DNI corto/repetido, campos vacíos, correo inválido y fecha de nacimiento futura.
3. Probar eliminación de un paciente sin citas y rechazo de otro vinculado a una cita. No añadir un campo `estado` inexistente en el modelo.
4. Usar una cita creada por el integrante 4. Entrar como médico y registrar una atención con diagnóstico de prueba.
5. Comprobar que la cita pasa a ATENDIDA y que la atención tiene el `id_cita` correcto en MySQL.
6. Intentar repetir la atención y atender una cita cancelada; ambas deben rechazarse sin alterar el historial.
7. Editar la atención, comprobar que la cita no puede cambiarse y consultar el detalle con los textos completos.
8. Entregar capturas de formulario, detalle, errores y estado persistido; redactar el apartado de pacientes/atenciones.

## Integrante 4 — citas y entrega

Archivos:

- `frontend/src/app/modelos/cita.ts`
- `frontend/src/app/Servicios/cita.service.ts`
- `frontend/src/app/Componentes/citas/citas.component.ts`, `.html`, `.scss`
- `backend/src/main/java/com/clinica/sangabriel/controller/CitaController.java`
- `backend/src/main/java/com/clinica/sangabriel/service/CitaService.java`
- `backend/src/main/java/com/clinica/sangabriel/repository/CitaRepository.java`
- `backend/src/main/java/com/clinica/sangabriel/model/Cita.java`
- DTOs Java `CitaRequest.java` y `CitaResponse.java`.
- `README.md`, `docs/`, documento académico final y preparación del comprimido.

Pasos:

1. Revisar con los integrantes 2 y 3 los IDs de datos ficticios disponibles; no fijarlos en el código del frontend.
2. Crear una cita desde Angular seleccionando paciente → especialidad → médico → fecha/hora futura.
3. Verificar en la petición que se mandan los campos de `CitaRequest` y que la respuesta plana se muestra con nombres mediante los catálogos.
4. Probar filtro por fecha y estado; editar/reprogramar; confirmar y cancelar. Verificar que no se puede crear otra cita activa del mismo médico a la misma hora.
5. Entregar una cita confirmada al integrante 3 para probar la atención y luego revisar ATENDIDA en la agenda.
6. Ejecutar el flujo completo tras clonar o descomprimir en una segunda computadora. Coordinar los errores de configuración con el integrante 1.
7. Incorporar al informe los textos/capturas de todos. No describir funcionalidades que no se hayan demostrado.
8. Preparar el ZIP final desde el código integrado de `develop`, no desde una rama individual; comprobar que contiene ambos frameworks, SQL con datos e informe actualizado.

## Orden estricto de integración

### Fase 0 — una base completa y ejecutable

1. Actualizar `develop` con la última versión acordada del equipo.
2. Integrante 1 crea `feature/apf3-integracion` y copia/adapta **el paquete completo**.
3. Integrantes 2, 3 y 4 revisan sus áreas en ese PR. Se ejecutan Maven y el build de Angular.
4. Fusionar a `develop` cuando arranque y pase el flujo mínimo de login → listado protegido.

No se propone un primer PR que importe pantallas todavía inexistentes: el paquete ya las contiene. Por eso la primera integración incluye todas las rutas y sus componentes, y evita una base que no compile.

### Fase 1 — trabajo paralelo sobre esa base

Todos actualizan desde `develop` antes de crear:

| Integrante | Rama |
|---|---|
| 1 | `feature/apf3-seguridad` |
| 2 | `feature/apf3-catalogos-sql` |
| 3 | `feature/apf3-pacientes-atenciones` |
| 4 | `feature/apf3-citas-entrega` |

Ya pueden verificar simultáneamente. Para datos compartidos, cada quien usa su base local; se intercambia el SQL acordado, no un archivo de configuración con contraseñas personales.

### Fase 2 — orden de los PR de corrección

1. Correcciones de configuración/seguridad que bloqueen al resto.
2. Correcciones de catálogos y SQL.
3. Correcciones de pacientes y citas, en paralelo si no cambian contratos compartidos.
4. Correcciones de atenciones que dependan del flujo confirmado de citas.
5. Evidencias finales, informe y empaquetado.

Este orden es de dependencias y fusión, no una instrucción de que los otros esperen sin trabajar. Pueden probar formularios y preparar documentación sobre la base completa desde la Fase 1.

## Reglas de Git / GitHub

- `main`: versión aprobada para entregar. `develop`: integración del APF3. `feature/...`: trabajo individual.
- Nadie hace push directo a `main`. Los cambios entran por PR a `develop` con revisión de al menos otro integrante.
- Solo el integrante 1 modifica `app.routes.ts`, `app.config.ts`, `main.ts`, `angular.json`, dependencias/lock y configuración de seguridad compartida. Los demás solicitan el cambio indicando el archivo y motivo.
- Cada módulo mantiene sus cambios dentro de sus carpetas. No reformatear archivos ajenos en el mismo PR.
- Si cambia un contrato, actualizar simultáneamente DTO/modelo Java, modelo TypeScript, servicio y prueba afectada. Avisar antes de fusionar.
- No borrar archivos del compañero para resolver conflictos; revisar cada bloque y compilar después.
- No subir `node_modules`, `.angular`, `target`, `.git`, claves JWT, tokens ni contraseñas reales.
- En GitHub Desktop: seleccionar la rama base correcta, actualizarla antes de crear la rama y revisar los archivos marcados antes del commit. El repositorio debe ser el mismo que abre VS Code.

Ejemplo por terminal, partiendo de un `develop` existente y actualizado:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/apf3-catalogos-sql
```

Después de los cambios y pruebas:

```bash
git status
git add frontend/src/app/Componentes/medicos frontend/src/app/Componentes/especialidades
git commit -m "Verifica mantenimiento de médicos y especialidades"
git push -u origin feature/apf3-catalogos-sql
```

Agregar también los otros archivos de la tarea que realmente se hayan modificado, revisándolos en `git status`. El ejemplo no pretende incluir todos los archivos de todos los integrantes.

Para incorporar cambios de `develop` a una rama de trabajo:

```bash
git fetch origin
git merge origin/develop
```

Resolver cualquier conflicto antes de hacer push y volver a ejecutar los checks afectados.

Cada PR indica: comportamiento cambiado, archivos compartidos tocados, prueba realizada con su resultado y captura cuando sea una pantalla. El PR final de `develop` a `main` se revisa después del ensayo.

## Jornadas / fases

| Momento | Integrante 1 | Integrante 2 | Integrante 3 | Integrante 4 | Condición de cierre |
|---|---|---|---|---|---|
| Jornada 1, primera hora | Integración inicial y configuración | Compara esquema/SQL | Revisa campos de pacientes/atenciones | Revisa DTO de citas y prepara matriz de pruebas | Todos tienen la misma base de código |
| Jornada 1, resto | Login, guard, interceptor, CORS | CRUD de catálogos y usuarios de prueba | CRUD de pacientes | Reserva, filtros y edición de citas | Login y registro de cita desde Angular |
| Jornada 2 | Roles, 401/403, revisión de PR | Duplicados, referencias, exportación | Atención, edición e integridad | Flujo de extremo a extremo y borrador del informe | Flujos completos en MySQL y PR corregidos |
| Jornada 3, primera parte | Arranque en otra PC y revisión final | Importación del SQL exportado | Capturas finales y revisión de textos | Compagina informe y arma ZIP | Una copia limpia puede ejecutarse |
| Antes de sustentar | Explica seguridad | Explica catálogos/BD | Explica pacientes/atención | Explica cita e integración | Ensayo conjunto de 10–12 minutos |

Si solo queda una jornada: integrar la base en la primera hora; dedicar el siguiente bloque a pruebas paralelas; reservar un bloque conjunto para la atención vinculada y la prueba en otra PC; cerrar con capturas, exportación, informe y ZIP. No utilizar todo el tiempo en cambios de apariencia.

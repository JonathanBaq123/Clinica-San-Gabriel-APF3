# Validación del paquete

Fecha: 19 de noviembre de 2026.

## Comprobaciones realizadas

| Comprobación | Resultado |
|---|---|
| Compilación Angular de producción (`npm run build`) | Correcta; sin errores de TypeScript ni de plantillas |
| Compilación y empaquetado Spring Boot | Correctos |
| Pruebas de integración JUnit + MockMvc + JPA + H2 | 5 pruebas, 0 fallos, 0 errores, 0 omitidas |
| Arranque de Spring Boot con perfil de prueba y servidor en 8080 | Correcto |
| Arranque del servidor de desarrollo Angular | Correcto |

Los cinco escenarios de integración son:

1. CRUD de tablas básicas: validación de datos, DNI/CMP repetidos, edición conservando ID, filtros y eliminación con/sin relaciones.
2. Seguridad: login, perfil sin contraseña, preflight CORS permitido/rechazado, ausencia/token inválido y permisos por rol.
3. Dos reservas simultáneas del mismo médico/fecha/hora: una responde 201 y la otra 409; queda una cita.
4. Cita y atención: DTO plano, edición, confirmación, protección de referencias, diagnóstico inválido, atención única, edición y estado ATENDIDA.
5. Cancelación: impide registrar atención y permite crear otra cita en el turno liberado.

Son pruebas con filtros de seguridad, controladores, servicios y repositorios reales, sobre H2 temporal en modo MySQL. No se sustituyen los servicios por respuestas simuladas.

## Entorno de verificación

- Node.js 24 y Angular 21.2.26; CLI/build 21.2.30; TypeScript 5.9.3.
- Spring Boot 3.3.5 y Java 21.
- La compilación Java en este entorno necesitó especificar `maven.compiler.source=21`, `maven.compiler.target=21` y dejar vacío `maven.compiler.release`, porque la instalación de Java del entorno no incluía los símbolos de compilación del JDK completo. Se ejecutó `package` con esos parámetros y pasó las cinco pruebas. En la computadora del grupo se requiere un **JDK 21 completo** y se utilizan los comandos normales del README.
- El presupuesto de aviso del bundle inicial de Angular se fija en 600 kB; el bundle inicial generado es aproximadamente 556 kB sin comprimir, con Bootstrap incluido localmente.

## Pendiente de comprobar en la computadora del grupo

- Importación del SQL y ejecución con su instalación concreta de MySQL/MariaDB, puerto y credenciales.
- Revisión visual y ejecución manual de todas las pantallas en un navegador de su computadora. No se pudo completar una prueba automatizada de navegador en este entorno por restricciones del ejecutable de Chromium; no se presenta como aprobada.
- Capturas de Angular, Network y consultas SQL con los registros de su demostración.
- Exportación final de la base, actualización del informe del curso y ensayo.

El código está completo y compilado. Estos pendientes son la validación del entorno de entrega y sus evidencias; no hay bloques de código dejados como TODO.

# Clínica San Gabriel — APF3

Proyecto integrado de Spring Boot + Angular, preparado a partir del ZIP, SQL y desglose de la Semana 13 recibidos. Incluye el código completo de las cinco pantallas, autenticación, permisos, formularios, servicios REST y ajustes del servidor. No es necesario generar otra aplicación para usarlo.

## 1. Qué contiene

| Carpeta / archivo | Contenido |
|---|---|
| `backend/` | Spring Boot 3.3.5, Java 21, JPA, MySQL, Spring Security y JWT |
| `frontend/` | Angular 21 standalone, Bootstrap 5.3.8, SCSS, modelos, servicios y componentes |
| `database/clinica_san_gabriel.sql` | Siete tablas y datos ficticios de demostración, incluidos usuarios con contraseñas BCrypt |
| `database/esquema_original_recibido.sql` | SQL adjunto conservado sin cambios; no contiene datos ni tablas de seguridad |
| `docs/ARQUITECTURA_Y_CONTRATOS.md` | Endpoints, JSON, roles y diferencias respecto del código recibido |
| `docs/PLAN_EQUIPO.md` | Responsables, archivos, ramas, orden y fases para los cuatro integrantes |
| `docs/PRUEBAS_Y_SUSTENTACION.md` | Pruebas locales, guion de demostración y evidencias para el informe |
| `docs/VALIDACION.md` | Comprobaciones realizadas y límites de la verificación |
| `docs/ARCHIVOS.md` | Inventario de archivos del código |
| `docs/CODIGO_COMPLETO.md` | Código agrupado por ruta, para consultar y copiar bloques completos |

El informe académico actualizado y las capturas de su MySQL todavía deben prepararlos ustedes. Los documentos de esta carpeta son instrucciones técnicas y un plan de trabajo.

## 2. Requisitos de la computadora

- JDK 21 completo. Verificar `java -version` y `javac -version`; ambos deben indicar 21. El paquete establece `java.version=21` en Maven.
- Node.js 22.12 o posterior dentro de la rama 22, o Node.js 24. Verificar `node --version` y `npm --version`.
- MySQL o el MariaDB de XAMPP, con permisos para crear la base. Revisar el puerto real: normalmente 3306; algunas instalaciones del grupo usan 3307.
- Acceso a Internet para la primera descarga de dependencias Maven y npm.
- Puertos 8080 y 4200 disponibles.

Usar el Maven Wrapper incluido: no hace falta instalar Maven globalmente. Tampoco hace falta instalar Angular CLI de forma global.

## 3. Preparación de la base de datos

1. Descomprimir el proyecto en una carpeta nueva y abrirla en VS Code.
2. Iniciar MySQL desde XAMPP o el servicio local correspondiente.
3. Si ya tienen una base de trabajo con cambios del equipo, exportar una copia y comprobar el esquema antes de mezclarla con esta versión.
4. Importar `database/clinica_san_gabriel.sql` desde phpMyAdmin, MySQL Workbench o el cliente MySQL. El script incluye `CREATE DATABASE` y `USE clinica_san_gabriel`.
5. Comprobar las tablas `especialidades`, `medicos`, `pacientes`, `citas`, `atenciones`, `roles` y `usuarios`.

El script usa `CREATE TABLE IF NOT EXISTS` e inserciones condicionadas: no contiene `DROP TABLE` y no cambia contraseñas de usuarios que ya existen. No migra esquemas incompatibles de otras versiones. Para una base con estructuras distintas, el integrante responsable debe revisar primero las diferencias.

Para probar en otra base sin tocar la existente: cambiar las dos primeras instrucciones del SQL por el nombre de la base de pruebas y configurar `DB_NAME` con ese mismo nombre antes de iniciar el backend.

## 4. Iniciar el backend en Windows / PowerShell

Abrir una terminal en la carpeta raíz del proyecto. Configurar los datos de su instalación; estos valores ejemplifican XAMPP sin contraseña:

```powershell
$env:DB_HOST = "127.0.0.1"
$env:DB_PORT = "3306"
$env:DB_NAME = "clinica_san_gabriel"
$env:DB_USER = "root"
$env:DB_PASSWORD = ""

$claveJwt = New-Object byte[] 32
$generadorJwt = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$generadorJwt.GetBytes($claveJwt)
$generadorJwt.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($claveJwt)

cd backend
.\mvnw.cmd spring-boot:run
```

- Si MySQL usa el puerto 3307, cambiar únicamente `DB_PORT` antes de ejecutar Maven.
- Si MySQL tiene contraseña, escribirla en `DB_PASSWORD` en esa terminal.
- No usar la contraseña anterior `123456` salvo que realmente sea la contraseña de su instalación.
- Mantener esta terminal abierta. El servidor debe indicar que inició en **8080**.
- `JWT_SECRET` se define en la misma terminal del backend; Spring no lee automáticamente un archivo `.env`.
- Al generar una nueva clave o reiniciar con otra, iniciar sesión nuevamente. Los JWT duran una hora.
- No guardar la clave JWT ni credenciales reales en Git.

En Linux/macOS, desde `backend/`:

```bash
export DB_HOST=127.0.0.1
export DB_PORT=3306
export DB_NAME=clinica_san_gabriel
export DB_USER=root
export DB_PASSWORD=''
export JWT_SECRET="$(openssl rand -base64 32)"
bash mvnw spring-boot:run
```

## 5. Iniciar Angular

Abrir una **segunda terminal**, desde la raíz del proyecto:

```powershell
cd frontend
npm ci
npm start
```

Abrir **http://localhost:4200**. Usar `localhost`, porque ese es el origen autorizado por CORS. La primera visita dirige a `/login`.

No ejecutar `ng new` encima de la carpeta incluida. Ya contiene todos los archivos y `package-lock.json`. `npm ci` instala las versiones fijadas en ese archivo.

## 6. Usuarios de demostración

Disponibles después de importar el SQL completo:

| Usuario | Contraseña de demostración | Rol |
|---|---|---|
| `apf3.admin` | `DemoClinica123!` | ADMIN |
| `apf3.recepcion` | `DemoClinica123!` | RECEPCION |
| `apf3.medico` | `DemoClinica123!` | MEDICO |

Son cuentas y datos ficticios para el APF3. El SQL guarda el hash BCrypt, no la contraseña en texto plano. Si esos nombres ya existían con otra contraseña, el script conserva la contraseña anterior.

Para una primera prueba de todas las pantallas, entrar con `apf3.admin`. Después probar los otros roles para verificar las restricciones.

## 7. Qué puede hacerse desde la intranet

| Pantalla | Funciones |
|---|---|
| Login | Autenticación real, recuperación del perfil, mensaje de credenciales inválidas y cierre de sesión |
| Pacientes | Listar, buscar, registrar, editar y eliminar si no tiene citas |
| Especialidades | Listar, buscar, registrar, editar, activar/desactivar y eliminar si no tiene médicos |
| Médicos | Listar, buscar, registrar con especialidad existente, editar, activar/desactivar y eliminar si no tiene citas |
| Citas | Listar, filtrar por fecha/estado, registrar con paciente y médico, editar/reprogramar, confirmar y cancelar |
| Atenciones | Listar, buscar, ver detalle, registrar una atención por cita y editar su información |

La cancelación conserva la cita y libera el turno. Una atención se conserva en el historial y no tiene eliminación física. Para marcar una cita como ATENDIDA se registra su atención, no se selecciona ese estado manualmente.

## 8. Verificaciones antes de integrar

Backend, desde `backend/`:

```powershell
.\mvnw.cmd clean test
.\mvnw.cmd package
```

Las pruebas usan H2 temporal y no modifican MySQL. La ejecución normal usa MySQL. El perfil `test` se reserva a pruebas y no se debe usar para la sustentación de la conexión a MySQL.

Frontend, desde `frontend/`:

```powershell
npm run build
```

El resultado está en `frontend/dist/frontend/browser`. El APF3 requiere también los archivos fuente, por lo que no basta con entregar esa carpeta.

Después seguir `docs/PRUEBAS_Y_SUSTENTACION.md` con MySQL real. Registrar los resultados y exportar el SQL con los datos que efectivamente mostrarán al profesor.

## 9. Comandos CLI equivalentes, solo si quieren reconstruir la estructura

Estos comandos documentan cómo generar una base nueva, siguiendo la clase. **No se ejecutan para arrancar el proyecto descargado.**

Desde una carpeta que todavía no tenga `frontend`:

```powershell
npx --yes @angular/cli@21.2.30 new frontend --directory frontend --routing --style scss --standalone --skip-git --skip-tests --defaults --package-manager npm --file-name-style-guide 2016
cd frontend
npm install bootstrap@5.3.8 zone.js@0.16.2 --save-exact
npx ng generate component Componentes/login --standalone --style scss --skip-tests --type component
npx ng generate component Componentes/menu --standalone --style scss --skip-tests --type component
npx ng generate component Componentes/pacientes --standalone --style scss --skip-tests --type component
npx ng generate component Componentes/medicos --standalone --style scss --skip-tests --type component
npx ng generate component Componentes/especialidades --standalone --style scss --skip-tests --type component
npx ng generate component Componentes/citas --standalone --style scss --skip-tests --type component
npx ng generate component Componentes/atenciones --standalone --style scss --skip-tests --type component
npx ng generate service Servicios/auth --skip-tests
npx ng generate service Servicios/paciente --skip-tests
npx ng generate service Servicios/medico --skip-tests
npx ng generate service Servicios/especialidad --skip-tests
npx ng generate service Servicios/cita --skip-tests
npx ng generate service Servicios/atencion --skip-tests
npx ng generate interface modelos/auth
npx ng generate interface modelos/paciente
npx ng generate interface modelos/medico
npx ng generate interface modelos/especialidad
npx ng generate interface modelos/cita
npx ng generate interface modelos/atencion
npx ng generate guard core/auth --functional --implements CanActivate --skip-tests
npx ng generate interceptor core/auth --functional --skip-tests
```

Los generadores solo crean estructuras vacías. Para reproducir esta implementación, reemplazarlas por los archivos completos de este paquete, incluido `src/main.ts`, `app.config.ts`, `app.routes.ts`, `shared/`, `environment.ts`, estilos, `angular.json`, `package.json` y `package-lock.json`; después ejecutar `npm ci`. En esta entrega las clases llevan los nombres explícitos `AuthService`, `CitasComponent`, etc., aunque la versión del CLI pueda generar nombres abreviados.

## 10. Si algo falla al iniciar

| Síntoma | Revisión |
|---|---|
| `release version 21 not supported` | Instalar un JDK 21 completo y verificar `JAVA_HOME`, `java -version` y `javac -version` en esa terminal |
| `Access denied for user` | Ajustar `DB_USER` y `DB_PASSWORD` |
| `Communications link failure` | Iniciar MySQL y revisar `DB_PORT` |
| `Unknown database` | Importar el SQL y comprobar `DB_NAME` |
| Falta `JWT_SECRET` | Ejecutar el bloque de generación de clave antes de Maven |
| Puerto ocupado | Cerrar la otra instancia. Si cambian 8080, cambiar también `frontend/src/environments/environment.ts` |
| Pantalla indica que no hay conexión | Verificar backend en 8080 y abrir Angular desde `http://localhost:4200` |
| 401 | Revisar credenciales o iniciar sesión de nuevo |
| 403 | Revisar el rol; no quitar las restricciones para ocultar el error |
| 409 | Revisar duplicados, horarios o referencias; el mensaje explica el motivo |

Para la entrega final, comprimir `backend/`, `frontend/`, `database/`, los documentos necesarios y el informe actualizado. Excluir `node_modules`, `.angular`, `target`, `.git` y credenciales locales.

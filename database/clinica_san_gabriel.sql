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

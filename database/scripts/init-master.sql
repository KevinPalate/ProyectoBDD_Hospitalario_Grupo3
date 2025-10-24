-- Script de inicialización para PostgreSQL Master (Quito)
-- Crea el esquema de base de datos y configura replicación

-- especialidades = (id_especialidad, nombre, descripcion, created_at)
-- medicos = (id_medico, id_especialidad, cedula, nombre, apellido, fecha_nacimiento, telefono, email, created_at, updated_at)
-- pacientes = (id_paciente, cedula, nombre, apellido, fecha_nacimiento, genero, tipo_sangre, telefono, email, direccion, created_at, updated_at)
-- centros_medicos = (id_cen_med, nombre, ciudad, direccion, telefono, email, created_at, updated_at)
-- empleados = (id_empleado, id_cen_med, cedula, nombre, apellido, cargo, password_hash, rol, created_at, updated_at)
-- consultas_medicas = (id_consulta, id_cen_med, id_medico, id_paciente, fecha_consulta, hora_consulta, motivo_consulta, costo, estado, observaciones, created_at, updated_at)
-- diagnosticos = (id_diagnostico, id_consulta, descripcion, gravedad, created_at, updated_at)
-- medicamentos_recetados = (id_med_receta, id_consulta, nombre_med, presentacion, dosis, frecuencia, duracion, observaciones, created_at, updated_at)

-- Tabla de especialidades médicas
CREATE TABLE IF NOT EXISTS especialidades (
    id_especialidad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de médicos
CREATE TABLE IF NOT EXISTS medicos (
    id_medico SERIAL PRIMARY KEY,
    id_especialidad INTEGER REFERENCES especialidades(id_especialidad),
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id_paciente SERIAL PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(10) CHECK (genero IN ('Masculino', 'Femenino', 'Otro')),
    tipo_sangre VARCHAR(5),
    telefono VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de centros médicos
CREATE TABLE IF NOT EXISTS centros_medicos (
    id_cen_med SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
    id_empleado SERIAL PRIMARY KEY,
    id_cen_med INTEGER REFERENCES centros_medicos(id_cen_med),
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('admin', 'hospital', 'medico')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de consultas médicas (FRAGMENTADA POR CENTRO MÉDICO)
CREATE TABLE IF NOT EXISTS consultas_medicas (
    id_consulta SERIAL PRIMARY KEY,
    id_cen_med INTEGER NOT NULL REFERENCES centros_medicos(id_cen_med),
    id_medico INTEGER REFERENCES medicos(id_medico),
    id_paciente INTEGER REFERENCES pacientes(id_paciente),
    fecha_consulta DATE NOT NULL,
    hora_consulta TIME NOT NULL,
    motivo_consulta TEXT NOT NULL,
    costo DECIMAL(10,2) DEFAULT 0.00,
    estado VARCHAR(20) DEFAULT 'Programada' CHECK (estado IN ('Programada', 'Realizada', 'Cancelada')),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de diagnósticos
CREATE TABLE IF NOT EXISTS diagnosticos (
    id_diagnostico SERIAL PRIMARY KEY,
    id_consulta INTEGER REFERENCES consultas_medicas(id_consulta),
    descripcion TEXT NOT NULL,
    gravedad VARCHAR(20) CHECK (gravedad IN ('Leve', 'Moderada', 'Grave', 'Crítica')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de medicamentos recetados
CREATE TABLE IF NOT EXISTS medicamentos_recetados (
    id_med_receta SERIAL PRIMARY KEY,
    id_consulta INTEGER REFERENCES consultas_medicas(id_consulta),
    nombre_med VARCHAR(100) NOT NULL,
    presentacion VARCHAR(50),
    dosis VARCHAR(50),
    frecuencia VARCHAR(50),
    duracion VARCHAR(50),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de prueba
INSERT INTO especialidades (nombre, descripcion) VALUES
('Cardiología', 'Especialidad en enfermedades del corazón y sistema cardiovascular'),
('Pediatría', 'Especialidad en salud infantil y adolescente'),
('Traumatología', 'Especialidad en lesiones del sistema musculoesquelético'),
('Dermatología', 'Especialidad en enfermedades de la piel'),
('Ginecología', 'Especialidad en salud femenina y sistema reproductivo');

INSERT INTO centros_medicos (nombre, ciudad, direccion, telefono, email) VALUES
('Hospital Metropolitano Quito', 'Quito', 'Av. Mariana de Jesús Oe3-17', '02-3998000', 'info@metropolitano.ec'),
('Hospital Luis Vernaza Guayaquil', 'Guayaquil', 'Av. Pedro Menéndez Gilbert', '04-3735000', 'contacto@vernaza.ec'),
('Hospital Monte Sinaí Cuenca', 'Cuenca', 'Av. Solano 1-61', '07-3707100', 'administracion@montesinai.ec');

INSERT INTO medicos (id_especialidad, cedula, nombre, apellido, fecha_nacimiento, telefono, email) VALUES
(1, '0101010101', 'Carlos', 'Mendoza', '1975-03-15', '0991234567', 'carlos.mendoza@hospital.com'),
(2, '0202020202', 'Ana', 'García', '1980-07-22', '0992345678', 'ana.garcia@hospital.com'),
(3, '0303030303', 'Luis', 'Rodríguez', '1978-11-30', '0993456789', 'luis.rodriguez@hospital.com'),
(4, '0404040404', 'María', 'Fernández', '1982-05-10', '0994567890', 'maria.fernandez@hospital.com'),
(5, '0505050505', 'Roberto', 'Silva', '1976-09-18', '0995678901', 'roberto.silva@hospital.com');

INSERT INTO pacientes (cedula, nombre, apellido, fecha_nacimiento, genero, tipo_sangre, telefono, email, direccion) VALUES
('0606060606', 'Juan', 'Pérez', '1985-04-12', 'Masculino', 'O+', '0987654321', 'juan.perez@email.com', 'Av. Amazonas N45-20'),
('0707070707', 'María', 'González', '1990-08-25', 'Femenino', 'A+', '0987654322', 'maria.gonzalez@email.com', 'Calle Guayas y Quil'),
('0808080808', 'Pedro', 'Martínez', '1978-12-03', 'Masculino', 'B+', '0987654323', 'pedro.martinez@email.com', 'Av. Shyris 123'),
('0909090909', 'Laura', 'Herrera', '1995-02-18', 'Femenino', 'AB+', '0987654324', 'laura.herrera@email.com', 'Calle Roca 456'),
('1010101010', 'Carlos', 'Ramírez', '1982-07-30', 'Masculino', 'O-', '0987654325', 'carlos.ramirez@email.com', 'Av. 6 de Diciembre');

-- Crear usuario para replicación
CREATE USER replicador REPLICATION LOGIN CONNECTION LIMIT 2 PASSWORD 'Replicador123!';

-- Crear índices para optimización
CREATE INDEX idx_consultas_cen_med ON consultas_medicas(id_cen_med);
CREATE INDEX idx_consultas_fecha ON consultas_medicas(fecha_consulta);
CREATE INDEX idx_empleados_cen_med ON empleados(id_cen_med);
CREATE INDEX idx_medicos_especialidad ON medicos(id_especialidad);
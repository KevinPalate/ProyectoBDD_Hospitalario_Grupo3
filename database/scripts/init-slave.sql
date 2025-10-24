-- Script de inicialización para PostgreSQL Slaves (Guayaquil y Cuenca)
-- Solo crea las estructuras, los datos vendrán por replicación

-- Tablas maestras (solo estructura, datos vendrán de Quito)
CREATE TABLE IF NOT EXISTS especialidades (
    id_especialidad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medicos (
    id_medico SERIAL PRIMARY KEY,
    id_especialidad INTEGER REFERENCES especialidades(id_especialidad),
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    telefono VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pacientes (
    id_paciente SERIAL PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    genero VARCHAR(10) CHECK (genero IN ('Masculino', 'Femenino', 'Otro')),
    tipo_sangre VARCHAR(5),
    telefono VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Tabla fragmentada (cada centro tendrá sus consultas)
CREATE TABLE IF NOT EXISTS consultas_medicas (
    id_consulta SERIAL PRIMARY KEY,
    id_cen_med INTEGER NOT NULL,
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

CREATE TABLE IF NOT EXISTS diagnosticos (
    id_diagnostico SERIAL PRIMARY KEY,
    id_consulta INTEGER REFERENCES consultas_medicas(id_consulta),
    descripcion TEXT NOT NULL,
    gravedad VARCHAR(20) CHECK (gravedad IN ('Leve', 'Moderada', 'Grave', 'Crítica')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Crear los mismos índices para consistencia
CREATE INDEX idx_consultas_cen_med ON consultas_medicas(id_cen_med);
CREATE INDEX idx_consultas_fecha ON consultas_medicas(fecha_consulta);
CREATE INDEX idx_empleados_cen_med ON empleados(id_cen_med);
CREATE INDEX idx_medicos_especialidad ON medicos(id_especialidad);
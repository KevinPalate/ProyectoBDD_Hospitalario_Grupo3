--
-- PostgreSQL database dump
--

\restrict FerecSO1JRk95php6bR3vYln5utXLTk0kkQxmeaXCHZtysF7QKkXEjHAynpHDdo

-- Dumped from database version 13.22 (Debian 13.22-1.pgdg13+1)
-- Dumped by pg_dump version 13.22 (Debian 13.22-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: centros_medicos; Type: TABLE; Schema: public; Owner: adminhospital
--

CREATE TABLE public.centros_medicos (
    id_cen_med integer NOT NULL,
    nombre character varying(100) NOT NULL,
    ciudad character varying(50) NOT NULL,
    direccion text,
    telefono character varying(15),
    email character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.centros_medicos OWNER TO adminhospital;

--
-- Name: centros_medicos_id_cen_med_seq; Type: SEQUENCE; Schema: public; Owner: adminhospital
--

CREATE SEQUENCE public.centros_medicos_id_cen_med_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.centros_medicos_id_cen_med_seq OWNER TO adminhospital;

--
-- Name: centros_medicos_id_cen_med_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminhospital
--

ALTER SEQUENCE public.centros_medicos_id_cen_med_seq OWNED BY public.centros_medicos.id_cen_med;


--
-- Name: consultas_medicas; Type: TABLE; Schema: public; Owner: adminhospital
--

CREATE TABLE public.consultas_medicas (
    id_consulta integer NOT NULL,
    id_cen_med integer NOT NULL,
    id_medico integer,
    id_paciente integer,
    fecha_consulta date NOT NULL,
    hora_consulta time without time zone NOT NULL,
    motivo_consulta text NOT NULL,
    costo numeric(10,2) DEFAULT 0.00,
    estado character varying(20) DEFAULT 'Programada'::character varying,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT consultas_medicas_estado_check CHECK (((estado)::text = ANY ((ARRAY['Programada'::character varying, 'Realizada'::character varying, 'Cancelada'::character varying])::text[])))
);


ALTER TABLE public.consultas_medicas OWNER TO adminhospital;

--
-- Name: consultas_medicas_id_consulta_seq; Type: SEQUENCE; Schema: public; Owner: adminhospital
--

CREATE SEQUENCE public.consultas_medicas_id_consulta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.consultas_medicas_id_consulta_seq OWNER TO adminhospital;

--
-- Name: consultas_medicas_id_consulta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminhospital
--

ALTER SEQUENCE public.consultas_medicas_id_consulta_seq OWNED BY public.consultas_medicas.id_consulta;


--
-- Name: diagnosticos; Type: TABLE; Schema: public; Owner: adminhospital
--

CREATE TABLE public.diagnosticos (
    id_diagnostico integer NOT NULL,
    id_consulta integer,
    descripcion text NOT NULL,
    gravedad character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT diagnosticos_gravedad_check CHECK (((gravedad)::text = ANY ((ARRAY['Leve'::character varying, 'Moderada'::character varying, 'Grave'::character varying, 'Crítica'::character varying])::text[])))
);


ALTER TABLE public.diagnosticos OWNER TO adminhospital;

--
-- Name: diagnosticos_id_diagnostico_seq; Type: SEQUENCE; Schema: public; Owner: adminhospital
--

CREATE SEQUENCE public.diagnosticos_id_diagnostico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.diagnosticos_id_diagnostico_seq OWNER TO adminhospital;

--
-- Name: diagnosticos_id_diagnostico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminhospital
--

ALTER SEQUENCE public.diagnosticos_id_diagnostico_seq OWNED BY public.diagnosticos.id_diagnostico;


--
-- Name: empleados; Type: TABLE; Schema: public; Owner: adminhospital
--

CREATE TABLE public.empleados (
    id_empleado integer NOT NULL,
    id_cen_med integer,
    cedula character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    cargo character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT empleados_rol_check CHECK (((rol)::text = ANY ((ARRAY['admin'::character varying, 'hospital'::character varying, 'medico'::character varying])::text[])))
);


ALTER TABLE public.empleados OWNER TO adminhospital;

--
-- Name: empleados_id_empleado_seq; Type: SEQUENCE; Schema: public; Owner: adminhospital
--

CREATE SEQUENCE public.empleados_id_empleado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.empleados_id_empleado_seq OWNER TO adminhospital;

--
-- Name: empleados_id_empleado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminhospital
--

ALTER SEQUENCE public.empleados_id_empleado_seq OWNED BY public.empleados.id_empleado;


--
-- Name: especialidades; Type: TABLE; Schema: public; Owner: adminhospital
--

CREATE TABLE public.especialidades (
    id_especialidad integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.especialidades OWNER TO adminhospital;

--
-- Name: especialidades_id_especialidad_seq; Type: SEQUENCE; Schema: public; Owner: adminhospital
--

CREATE SEQUENCE public.especialidades_id_especialidad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.especialidades_id_especialidad_seq OWNER TO adminhospital;

--
-- Name: especialidades_id_especialidad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminhospital
--

ALTER SEQUENCE public.especialidades_id_especialidad_seq OWNED BY public.especialidades.id_especialidad;


--
-- Name: medicamentos_recetados; Type: TABLE; Schema: public; Owner: adminhospital
--

CREATE TABLE public.medicamentos_recetados (
    id_med_receta integer NOT NULL,
    id_consulta integer,
    nombre_med character varying(100) NOT NULL,
    presentacion character varying(50),
    dosis character varying(50),
    frecuencia character varying(50),
    duracion character varying(50),
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.medicamentos_recetados OWNER TO adminhospital;

--
-- Name: medicamentos_recetados_id_med_receta_seq; Type: SEQUENCE; Schema: public; Owner: adminhospital
--

CREATE SEQUENCE public.medicamentos_recetados_id_med_receta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.medicamentos_recetados_id_med_receta_seq OWNER TO adminhospital;

--
-- Name: medicamentos_recetados_id_med_receta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminhospital
--

ALTER SEQUENCE public.medicamentos_recetados_id_med_receta_seq OWNED BY public.medicamentos_recetados.id_med_receta;


--
-- Name: medicos; Type: TABLE; Schema: public; Owner: adminhospital
--

CREATE TABLE public.medicos (
    id_medico integer NOT NULL,
    id_especialidad integer,
    cedula character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    fecha_nacimiento date NOT NULL,
    telefono character varying(15),
    email character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.medicos OWNER TO adminhospital;

--
-- Name: medicos_id_medico_seq; Type: SEQUENCE; Schema: public; Owner: adminhospital
--

CREATE SEQUENCE public.medicos_id_medico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.medicos_id_medico_seq OWNER TO adminhospital;

--
-- Name: medicos_id_medico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminhospital
--

ALTER SEQUENCE public.medicos_id_medico_seq OWNED BY public.medicos.id_medico;


--
-- Name: pacientes; Type: TABLE; Schema: public; Owner: adminhospital
--

CREATE TABLE public.pacientes (
    id_paciente integer NOT NULL,
    cedula character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    fecha_nacimiento date NOT NULL,
    genero character varying(10),
    tipo_sangre character varying(5),
    telefono character varying(15),
    email character varying(100),
    direccion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pacientes_genero_check CHECK (((genero)::text = ANY ((ARRAY['Masculino'::character varying, 'Femenino'::character varying, 'Otro'::character varying])::text[])))
);


ALTER TABLE public.pacientes OWNER TO adminhospital;

--
-- Name: pacientes_id_paciente_seq; Type: SEQUENCE; Schema: public; Owner: adminhospital
--

CREATE SEQUENCE public.pacientes_id_paciente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pacientes_id_paciente_seq OWNER TO adminhospital;

--
-- Name: pacientes_id_paciente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminhospital
--

ALTER SEQUENCE public.pacientes_id_paciente_seq OWNED BY public.pacientes.id_paciente;


--
-- Name: centros_medicos id_cen_med; Type: DEFAULT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.centros_medicos ALTER COLUMN id_cen_med SET DEFAULT nextval('public.centros_medicos_id_cen_med_seq'::regclass);


--
-- Name: consultas_medicas id_consulta; Type: DEFAULT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.consultas_medicas ALTER COLUMN id_consulta SET DEFAULT nextval('public.consultas_medicas_id_consulta_seq'::regclass);


--
-- Name: diagnosticos id_diagnostico; Type: DEFAULT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.diagnosticos ALTER COLUMN id_diagnostico SET DEFAULT nextval('public.diagnosticos_id_diagnostico_seq'::regclass);


--
-- Name: empleados id_empleado; Type: DEFAULT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.empleados ALTER COLUMN id_empleado SET DEFAULT nextval('public.empleados_id_empleado_seq'::regclass);


--
-- Name: especialidades id_especialidad; Type: DEFAULT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.especialidades ALTER COLUMN id_especialidad SET DEFAULT nextval('public.especialidades_id_especialidad_seq'::regclass);


--
-- Name: medicamentos_recetados id_med_receta; Type: DEFAULT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.medicamentos_recetados ALTER COLUMN id_med_receta SET DEFAULT nextval('public.medicamentos_recetados_id_med_receta_seq'::regclass);


--
-- Name: medicos id_medico; Type: DEFAULT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.medicos ALTER COLUMN id_medico SET DEFAULT nextval('public.medicos_id_medico_seq'::regclass);


--
-- Name: pacientes id_paciente; Type: DEFAULT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.pacientes ALTER COLUMN id_paciente SET DEFAULT nextval('public.pacientes_id_paciente_seq'::regclass);


--
-- Data for Name: centros_medicos; Type: TABLE DATA; Schema: public; Owner: adminhospital
--

COPY public.centros_medicos (id_cen_med, nombre, ciudad, direccion, telefono, email, created_at, updated_at) FROM stdin;
1	Hospital Metropolitano Quito	Quito	Av. Mariana de Jesús Oe3-17	02-3998000	info@metropolitano.ec	2025-10-24 19:16:58.010961	2025-10-24 19:16:58.010961
2	Hospital Luis Vernaza Guayaquil	Guayaquil	Av. Pedro Menéndez Gilbert	04-3735000	contacto@vernaza.ec	2025-10-24 19:16:58.010961	2025-10-24 19:16:58.010961
3	Hospital Monte Sinaí Cuenca	Cuenca	Av. Solano 1-61	07-3707100	administracion@montesinai.ec	2025-10-24 19:16:58.010961	2025-10-24 19:16:58.010961
\.


--
-- Data for Name: consultas_medicas; Type: TABLE DATA; Schema: public; Owner: adminhospital
--

COPY public.consultas_medicas (id_consulta, id_cen_med, id_medico, id_paciente, fecha_consulta, hora_consulta, motivo_consulta, costo, estado, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: diagnosticos; Type: TABLE DATA; Schema: public; Owner: adminhospital
--

COPY public.diagnosticos (id_diagnostico, id_consulta, descripcion, gravedad, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: empleados; Type: TABLE DATA; Schema: public; Owner: adminhospital
--

COPY public.empleados (id_empleado, id_cen_med, cedula, nombre, apellido, cargo, password_hash, rol, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: especialidades; Type: TABLE DATA; Schema: public; Owner: adminhospital
--

COPY public.especialidades (id_especialidad, nombre, descripcion, created_at) FROM stdin;
1	Cardiología	Especialidad en enfermedades del corazón y sistema cardiovascular	2025-10-24 19:16:58.008097
2	Pediatría	Especialidad en salud infantil y adolescente	2025-10-24 19:16:58.008097
3	Traumatología	Especialidad en lesiones del sistema musculoesquelético	2025-10-24 19:16:58.008097
4	Dermatología	Especialidad en enfermedades de la piel	2025-10-24 19:16:58.008097
5	Ginecología	Especialidad en salud femenina y sistema reproductivo	2025-10-24 19:16:58.008097
\.


--
-- Data for Name: medicamentos_recetados; Type: TABLE DATA; Schema: public; Owner: adminhospital
--

COPY public.medicamentos_recetados (id_med_receta, id_consulta, nombre_med, presentacion, dosis, frecuencia, duracion, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: medicos; Type: TABLE DATA; Schema: public; Owner: adminhospital
--

COPY public.medicos (id_medico, id_especialidad, cedula, nombre, apellido, fecha_nacimiento, telefono, email, created_at, updated_at) FROM stdin;
1	1	0101010101	Carlos	Mendoza	1975-03-15	0991234567	carlos.mendoza@hospital.com	2025-10-24 19:16:58.013819	2025-10-24 19:16:58.013819
2	2	0202020202	Ana	García	1980-07-22	0992345678	ana.garcia@hospital.com	2025-10-24 19:16:58.013819	2025-10-24 19:16:58.013819
3	3	0303030303	Luis	Rodríguez	1978-11-30	0993456789	luis.rodriguez@hospital.com	2025-10-24 19:16:58.013819	2025-10-24 19:16:58.013819
4	4	0404040404	María	Fernández	1982-05-10	0994567890	maria.fernandez@hospital.com	2025-10-24 19:16:58.013819	2025-10-24 19:16:58.013819
5	5	0505050505	Roberto	Silva	1976-09-18	0995678901	roberto.silva@hospital.com	2025-10-24 19:16:58.013819	2025-10-24 19:16:58.013819
\.


--
-- Data for Name: pacientes; Type: TABLE DATA; Schema: public; Owner: adminhospital
--

COPY public.pacientes (id_paciente, cedula, nombre, apellido, fecha_nacimiento, genero, tipo_sangre, telefono, email, direccion, created_at, updated_at) FROM stdin;
1	0606060606	Juan	Pérez	1985-04-12	Masculino	O+	0987654321	juan.perez@email.com	Av. Amazonas N45-20	2025-10-24 19:16:58.017872	2025-10-24 19:16:58.017872
2	0707070707	María	González	1990-08-25	Femenino	A+	0987654322	maria.gonzalez@email.com	Calle Guayas y Quil	2025-10-24 19:16:58.017872	2025-10-24 19:16:58.017872
3	0808080808	Pedro	Martínez	1978-12-03	Masculino	B+	0987654323	pedro.martinez@email.com	Av. Shyris 123	2025-10-24 19:16:58.017872	2025-10-24 19:16:58.017872
4	0909090909	Laura	Herrera	1995-02-18	Femenino	AB+	0987654324	laura.herrera@email.com	Calle Roca 456	2025-10-24 19:16:58.017872	2025-10-24 19:16:58.017872
5	1010101010	Carlos	Ramírez	1982-07-30	Masculino	O-	0987654325	carlos.ramirez@email.com	Av. 6 de Diciembre	2025-10-24 19:16:58.017872	2025-10-24 19:16:58.017872
\.


--
-- Name: centros_medicos_id_cen_med_seq; Type: SEQUENCE SET; Schema: public; Owner: adminhospital
--

SELECT pg_catalog.setval('public.centros_medicos_id_cen_med_seq', 3, true);


--
-- Name: consultas_medicas_id_consulta_seq; Type: SEQUENCE SET; Schema: public; Owner: adminhospital
--

SELECT pg_catalog.setval('public.consultas_medicas_id_consulta_seq', 1, false);


--
-- Name: diagnosticos_id_diagnostico_seq; Type: SEQUENCE SET; Schema: public; Owner: adminhospital
--

SELECT pg_catalog.setval('public.diagnosticos_id_diagnostico_seq', 1, false);


--
-- Name: empleados_id_empleado_seq; Type: SEQUENCE SET; Schema: public; Owner: adminhospital
--

SELECT pg_catalog.setval('public.empleados_id_empleado_seq', 1, false);


--
-- Name: especialidades_id_especialidad_seq; Type: SEQUENCE SET; Schema: public; Owner: adminhospital
--

SELECT pg_catalog.setval('public.especialidades_id_especialidad_seq', 5, true);


--
-- Name: medicamentos_recetados_id_med_receta_seq; Type: SEQUENCE SET; Schema: public; Owner: adminhospital
--

SELECT pg_catalog.setval('public.medicamentos_recetados_id_med_receta_seq', 1, false);


--
-- Name: medicos_id_medico_seq; Type: SEQUENCE SET; Schema: public; Owner: adminhospital
--

SELECT pg_catalog.setval('public.medicos_id_medico_seq', 5, true);


--
-- Name: pacientes_id_paciente_seq; Type: SEQUENCE SET; Schema: public; Owner: adminhospital
--

SELECT pg_catalog.setval('public.pacientes_id_paciente_seq', 5, true);


--
-- Name: centros_medicos centros_medicos_email_key; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.centros_medicos
    ADD CONSTRAINT centros_medicos_email_key UNIQUE (email);


--
-- Name: centros_medicos centros_medicos_pkey; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.centros_medicos
    ADD CONSTRAINT centros_medicos_pkey PRIMARY KEY (id_cen_med);


--
-- Name: consultas_medicas consultas_medicas_pkey; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.consultas_medicas
    ADD CONSTRAINT consultas_medicas_pkey PRIMARY KEY (id_consulta);


--
-- Name: diagnosticos diagnosticos_pkey; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.diagnosticos
    ADD CONSTRAINT diagnosticos_pkey PRIMARY KEY (id_diagnostico);


--
-- Name: empleados empleados_cedula_key; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_cedula_key UNIQUE (cedula);


--
-- Name: empleados empleados_pkey; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_pkey PRIMARY KEY (id_empleado);


--
-- Name: especialidades especialidades_nombre_key; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.especialidades
    ADD CONSTRAINT especialidades_nombre_key UNIQUE (nombre);


--
-- Name: especialidades especialidades_pkey; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.especialidades
    ADD CONSTRAINT especialidades_pkey PRIMARY KEY (id_especialidad);


--
-- Name: medicamentos_recetados medicamentos_recetados_pkey; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.medicamentos_recetados
    ADD CONSTRAINT medicamentos_recetados_pkey PRIMARY KEY (id_med_receta);


--
-- Name: medicos medicos_cedula_key; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_cedula_key UNIQUE (cedula);


--
-- Name: medicos medicos_email_key; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_email_key UNIQUE (email);


--
-- Name: medicos medicos_pkey; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_pkey PRIMARY KEY (id_medico);


--
-- Name: pacientes pacientes_cedula_key; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_cedula_key UNIQUE (cedula);


--
-- Name: pacientes pacientes_email_key; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_email_key UNIQUE (email);


--
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_pkey PRIMARY KEY (id_paciente);


--
-- Name: idx_consultas_cen_med; Type: INDEX; Schema: public; Owner: adminhospital
--

CREATE INDEX idx_consultas_cen_med ON public.consultas_medicas USING btree (id_cen_med);


--
-- Name: idx_consultas_fecha; Type: INDEX; Schema: public; Owner: adminhospital
--

CREATE INDEX idx_consultas_fecha ON public.consultas_medicas USING btree (fecha_consulta);


--
-- Name: idx_empleados_cen_med; Type: INDEX; Schema: public; Owner: adminhospital
--

CREATE INDEX idx_empleados_cen_med ON public.empleados USING btree (id_cen_med);


--
-- Name: idx_medicos_especialidad; Type: INDEX; Schema: public; Owner: adminhospital
--

CREATE INDEX idx_medicos_especialidad ON public.medicos USING btree (id_especialidad);


--
-- Name: consultas_medicas consultas_medicas_id_cen_med_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.consultas_medicas
    ADD CONSTRAINT consultas_medicas_id_cen_med_fkey FOREIGN KEY (id_cen_med) REFERENCES public.centros_medicos(id_cen_med);


--
-- Name: consultas_medicas consultas_medicas_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.consultas_medicas
    ADD CONSTRAINT consultas_medicas_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES public.medicos(id_medico);


--
-- Name: consultas_medicas consultas_medicas_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.consultas_medicas
    ADD CONSTRAINT consultas_medicas_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id_paciente);


--
-- Name: diagnosticos diagnosticos_id_consulta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.diagnosticos
    ADD CONSTRAINT diagnosticos_id_consulta_fkey FOREIGN KEY (id_consulta) REFERENCES public.consultas_medicas(id_consulta);


--
-- Name: empleados empleados_id_cen_med_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_id_cen_med_fkey FOREIGN KEY (id_cen_med) REFERENCES public.centros_medicos(id_cen_med);


--
-- Name: medicamentos_recetados medicamentos_recetados_id_consulta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.medicamentos_recetados
    ADD CONSTRAINT medicamentos_recetados_id_consulta_fkey FOREIGN KEY (id_consulta) REFERENCES public.consultas_medicas(id_consulta);


--
-- Name: medicos medicos_id_especialidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminhospital
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_id_especialidad_fkey FOREIGN KEY (id_especialidad) REFERENCES public.especialidades(id_especialidad);


--
-- PostgreSQL database dump complete
--

\unrestrict FerecSO1JRk95php6bR3vYln5utXLTk0kkQxmeaXCHZtysF7QKkXEjHAynpHDdo


-- Script de configuración de replicación PostgreSQL
-- Ejecutar en el MASTER (Quito)

-- 1. Crear usuario de replicación
CREATE USER replicador REPLICATION LOGIN PASSWORD 'Replicador123!';

-- 2. Configurar permisos de conexión para replicación
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET max_wal_senders = 10;
ALTER SYSTEM SET max_replication_slots = 10;
ALTER SYSTEM SET hot_standby = on;

-- 3. Recargar configuración
SELECT pg_reload_conf();

-- 4. Crear slots de replicación
SELECT pg_create_physical_replication_slot('replication_slot_guayaquil');
SELECT pg_create_physical_replication_slot('replication_slot_cuenca');

-- 5. Verificar configuración
SELECT name, setting FROM pg_settings WHERE name IN ('wal_level', 'max_wal_senders', 'max_replication_slots');
SELECT slot_name, active FROM pg_replication_slots;

-- 6. Verificar usuario de replicación
SELECT usename FROM pg_user WHERE usename = 'replicador';
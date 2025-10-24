const { masterPool, slave1Pool, slave2Pool, getPoolForCenter } = require('../config/database');

class Monitor {
    // Obtener estado de todos los nodos
    static async getEstadoNodos() {
        try {
        const [master, slave1, slave2] = await Promise.all([
            masterPool.query('SELECT 1 as test, NOW() as timestamp'),
            slave1Pool.query('SELECT 1 as test, NOW() as timestamp'),
            slave2Pool.query('SELECT 1 as test, NOW() as timestamp')
        ]);

        return {
            master: { 
            estado: 'conectado', 
            timestamp: master.rows[0].timestamp,
            nombre: 'Quito (Master)',
            puerto: 5432
            },
            slave1: { 
            estado: 'conectado', 
            timestamp: slave1.rows[0].timestamp,
            nombre: 'Guayaquil (Slave 1)',
            puerto: 5433
            },
            slave2: { 
            estado: 'conectado', 
            timestamp: slave2.rows[0].timestamp,
            nombre: 'Cuenca (Slave 2)',
            puerto: 5434
            }
        };
        } catch (error) {
        return {
            master: { estado: 'error', error: error.message },
            slave1: { estado: 'error', error: error.message },
            slave2: { estado: 'error', error: error.message }
        };
        }
    }

    // Obtener estadísticas de fragmentación
    static async getEstadisticasFragmentacion() {
        try {
        const [consultasQuito, consultasGuayaquil, consultasCuenca] = await Promise.all([
            masterPool.query('SELECT COUNT(*) as total FROM consultas_medicas WHERE id_cen_med = 1'),
            slave1Pool.query('SELECT COUNT(*) as total FROM consultas_medicas WHERE id_cen_med = 2'),
            slave2Pool.query('SELECT COUNT(*) as total FROM consultas_medicas WHERE id_cen_med = 3')
        ]);

        const [centros, medicos, pacientes] = await Promise.all([
            masterPool.query('SELECT COUNT(*) as total FROM centros_medicos'),
            masterPool.query('SELECT COUNT(*) as total FROM medicos'),
            masterPool.query('SELECT COUNT(*) as total FROM pacientes')
        ]);

        return {
            fragmentacion: {
            quito: parseInt(consultasQuito.rows[0].total),
            guayaquil: parseInt(consultasGuayaquil.rows[0].total),
            cuenca: parseInt(consultasCuenca.rows[0].total),
            total: parseInt(consultasQuito.rows[0].total) + 
                    parseInt(consultasGuayaquil.rows[0].total) + 
                    parseInt(consultasCuenca.rows[0].total)
            },
            datos_maestros: {
            centros: parseInt(centros.rows[0].total),
            medicos: parseInt(medicos.rows[0].total),
            pacientes: parseInt(pacientes.rows[0].total)
            }
        };
        } catch (error) {
        return { error: error.message };
        }
    }

    // Obtener información del sistema
    static async getInfoSistema() {
        try {
        const [version, databases, connections] = await Promise.all([
            masterPool.query('SELECT version()'),
            masterPool.query("SELECT datname FROM pg_database WHERE datistemplate = false"),
            masterPool.query('SELECT count(*) as connections FROM pg_stat_activity WHERE datname = $1', ['hospital_db'])
        ]);

        return {
            postgres_version: version.rows[0].version.split(',')[0],
            databases: databases.rows.map(db => db.datname),
            connections: parseInt(connections.rows[0].connections),
            timestamp: new Date().toISOString(),
            arquitectura: 'MVC + Bases de Datos Distribuidas',
            fragmentacion: 'Horizontal por centro médico'
        };
        } catch (error) {
        return { error: error.message };
        }
    }

    // Obtener métricas de performance
    static async getMetricasPerformance() {
        try {
        const [masterMetrics, slave1Metrics, slave2Metrics] = await Promise.all([
            masterPool.query(`
            SELECT 
                COUNT(*) as total_tablas,
                SUM(pg_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename))) as tamaño_bytes
            FROM pg_tables 
            WHERE schemaname = 'public'
            `),
            slave1Pool.query('SELECT COUNT(*) as consultas FROM consultas_medicas'),
            slave2Pool.query('SELECT COUNT(*) as consultas FROM consultas_medicas')
        ]);

        return {
            master: {
            tablas: parseInt(masterMetrics.rows[0].total_tablas),
            tamaño_mb: Math.round(parseInt(masterMetrics.rows[0].tamaño_bytes) / 1024 / 1024 * 100) / 100
            },
            slave1: {
            consultas: parseInt(slave1Metrics.rows[0].consultas)
            },
            slave2: {
            consultas: parseInt(slave2Metrics.rows[0].consultas)
            }
        };
        } catch (error) {
        return { error: error.message };
        }
    }
}

module.exports = Monitor;
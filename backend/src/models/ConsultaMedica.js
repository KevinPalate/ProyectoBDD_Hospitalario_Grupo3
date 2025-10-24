const { getPoolForCenter } = require('../config/database');

class ConsultaMedica {
    // Crear nueva consulta (se fragmenta automáticamente por centro)
    static async create(consultaData) {
        const { id_cen_med, id_medico, id_paciente, fecha_consulta, hora_consulta, motivo_consulta, costo } = consultaData;
        
        const pool = getPoolForCenter(id_cen_med);
        
        const result = await pool.query(`
        INSERT INTO consultas_medicas 
            (id_cen_med, id_medico, id_paciente, fecha_consulta, hora_consulta, motivo_consulta, costo)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `, [id_cen_med, id_medico, id_paciente, fecha_consulta, hora_consulta, motivo_consulta, costo]);
        
        return result.rows[0];
    }

    // Obtener consultas por centro médico (fragmentación horizontal)
    static async getByCentro(idCenMed) {
        const pool = getPoolForCenter(idCenMed);
        
        const result = await pool.query(`
        SELECT 
            cm.*,
            m.nombre as medico_nombre,
            m.apellido as medico_apellido,
            p.nombre as paciente_nombre, 
            p.apellido as paciente_apellido
        FROM consultas_medicas cm
        LEFT JOIN medicos m ON cm.id_medico = m.id_medico
        LEFT JOIN pacientes p ON cm.id_paciente = p.id_paciente
        WHERE cm.id_cen_med = $1
        ORDER BY cm.fecha_consulta DESC, cm.hora_consulta DESC
        `, [idCenMed]);
        
        return result.rows;
    }

    // Obtener todas las consultas (solo para admin - consulta distribuida)
    static async getAll() {
        const { masterPool, slave1Pool, slave2Pool } = require('../config/database');
        
        // Consultar a los 3 nodos en paralelo
        const [consultasQuito, consultasGuayaquil, consultasCuenca] = await Promise.all([
        masterPool.query(`SELECT *, 'Quito' as centro FROM consultas_medicas`),
        slave1Pool.query(`SELECT *, 'Guayaquil' as centro FROM consultas_medicas`),
        slave2Pool.query(`SELECT *, 'Cuenca' as centro FROM consultas_medicas`)
        ]);
        
        // Combinar resultados
        return [
        ...consultasQuito.rows,
        ...consultasGuayaquil.rows, 
        ...consultasCuenca.rows
        ];
    }

    // Obtener estadísticas de consultas por centro
    static async getEstadisticas() {
        const { masterPool, slave1Pool, slave2Pool } = require('../config/database');
        
        const [statsQuito, statsGuayaquil, statsCuenca] = await Promise.all([
        masterPool.query(`
            SELECT 
            COUNT(*) as total,
            AVG(costo) as costo_promedio,
            COUNT(*) FILTER (WHERE estado = 'Realizada') as realizadas,
            COUNT(*) FILTER (WHERE estado = 'Programada') as programadas
            FROM consultas_medicas
        `),
        slave1Pool.query(`
            SELECT 
            COUNT(*) as total,
            AVG(costo) as costo_promedio, 
            COUNT(*) FILTER (WHERE estado = 'Realizada') as realizadas,
            COUNT(*) FILTER (WHERE estado = 'Programada') as programadas
            FROM consultas_medicas
        `),
        slave2Pool.query(`
            SELECT 
            COUNT(*) as total,
            AVG(costo) as costo_promedio,
            COUNT(*) FILTER (WHERE estado = 'Realizada') as realizadas, 
            COUNT(*) FILTER (WHERE estado = 'Programada') as programadas
            FROM consultas_medicas
        `)
        ]);
        
        return {
        quito: statsQuito.rows[0],
        guayaquil: statsGuayaquil.rows[0],
        cuenca: statsCuenca.rows[0]
        };
    }
}

module.exports = ConsultaMedica;
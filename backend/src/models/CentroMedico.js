const { masterPool, getPoolForCenter } = require('../config/database');

class CentroMedico {
    // Obtener todos los centros médicos (solo desde Master)
    static async getAll() {
        const result = await masterPool.query(`
        SELECT id_cen_med, nombre, ciudad, direccion, telefono, email, created_at
        FROM centros_medicos 
        ORDER BY nombre
        `);
        return result.rows;
    }

    // Obtener centro médico por ID (desde cualquier nodo)
    static async getById(id) {
        const pool = getPoolForCenter(id);
        const result = await pool.query(`
        SELECT id_cen_med, nombre, ciudad, direccion, telefono, email, created_at
        FROM centros_medicos 
        WHERE id_cen_med = $1
        `, [id]);
        return result.rows[0];
    }

    // Crear nuevo centro médico (solo en Master)
    static async create(nombre, ciudad, direccion, telefono, email) {
        const result = await masterPool.query(`
        INSERT INTO centros_medicos (nombre, ciudad, direccion, telefono, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_cen_med, nombre, ciudad, direccion, telefono, email, created_at
        `, [nombre, ciudad, direccion, telefono, email]);
        return result.rows[0];
    }

    // Obtener estadísticas por centro (usando fragmentación)
    static async getEstadisticas(idCenMed) {
        const pool = getPoolForCenter(idCenMed);
        
        const result = await pool.query(`
        SELECT 
            COUNT(*) as total_consultas,
            COUNT(DISTINCT id_paciente) as pacientes_unicos,
            AVG(costo) as costo_promedio,
            estado,
            COUNT(*) FILTER (WHERE fecha_consulta = CURRENT_DATE) as consultas_hoy
        FROM consultas_medicas 
        WHERE id_cen_med = $1
        GROUP BY estado
        `, [idCenMed]);
        
        return result.rows;
    }
}

module.exports = CentroMedico;
const { masterPool, slave1Pool, slave2Pool } = require('../config/database');

class DemoFragmentacion {
    // Crear consultas de prueba en diferentes centros
    static async crearDatosDemo() {
        console.log('🎯 CREANDO DATOS DE PRUEBA PARA DEMOSTRAR FRAGMENTACIÓN...\n');

        const consultasDemo = [
        // Consultas para Quito (Centro 1)
        { id_cen_med: 1, id_medico: 1, id_paciente: 1, fecha_consulta: '2025-10-25', hora_consulta: '09:00', motivo_consulta: 'Control cardiológico', costo: 50 },
        { id_cen_med: 1, id_medico: 1, id_paciente: 2, fecha_consulta: '2025-10-25', hora_consulta: '10:30', motivo_consulta: 'Chequeo anual', costo: 45 },
        
        // Consultas para Guayaquil (Centro 2)
        { id_cen_med: 2, id_medico: 2, id_paciente: 3, fecha_consulta: '2025-10-26', hora_consulta: '08:00', motivo_consulta: 'Consulta pediátrica', costo: 35 },
        { id_cen_med: 2, id_medico: 2, id_paciente: 4, fecha_consulta: '2025-10-26', hora_consulta: '11:00', motivo_consulta: 'Vacunación', costo: 25 },
        
        // Consultas para Cuenca (Centro 3)
        { id_cen_med: 3, id_medico: 3, id_paciente: 5, fecha_consulta: '2025-10-27', hora_consulta: '14:00', motivo_consulta: 'Revisión traumatológica', costo: 60 },
        { id_cen_med: 3, id_medico: 4, id_paciente: 1, fecha_consulta: '2025-10-27', hora_consulta: '16:00', motivo_consulta: 'Consulta dermatológica', costo: 40 }
        ];

        try {
        for (const consulta of consultasDemo) {
            const pool = consulta.id_cen_med === 1 ? masterPool : 
                        consulta.id_cen_med === 2 ? slave1Pool : slave2Pool;
            
            await pool.query(`
            INSERT INTO consultas_medicas 
            (id_cen_med, id_medico, id_paciente, fecha_consulta, hora_consulta, motivo_consulta, costo, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'Realizada')
            `, Object.values(consulta));
            
            console.log(`✅ Consulta creada en Centro ${consulta.id_cen_med} - ${consulta.motivo_consulta}`);
        }

        console.log('\n🎉 DATOS DE PRUEBA CREADOS EXITOSAMENTE');
        return { success: true, message: 'Datos de prueba creados' };
        } catch (error) {
        console.error('❌ Error creando datos demo:', error);
        return { success: false, error: error.message };
        }
    }

    // Verificar distribución de datos
    static async verificarFragmentacion() {
        console.log('\n🔍 VERIFICANDO FRAGMENTACIÓN HORIZONTAL...\n');

        try {
        const [quito, guayaquil, cuenca] = await Promise.all([
            masterPool.query('SELECT COUNT(*) as total FROM consultas_medicas'),
            slave1Pool.query('SELECT COUNT(*) as total FROM consultas_medicas'),
            slave2Pool.query('SELECT COUNT(*) as total FROM consultas_medicas')
        ]);

        const resultados = {
            quito: parseInt(quito.rows[0].total),
            guayaquil: parseInt(guayaquil.rows[0].total),
            cuenca: parseInt(cuenca.rows[0].total)
        };

        console.log('📊 DISTRIBUCIÓN DE CONSULTAS:');
        console.log(`   Quito (Master): ${resultados.quito} consultas`);
        console.log(`   Guayaquil (Slave 1): ${resultados.guayaquil} consultas`);
        console.log(`   Cuenca (Slave 2): ${resultados.cuenca} consultas`);
        console.log(`   TOTAL: ${resultados.quito + resultados.guayaquil + resultados.cuenca} consultas`);

        return resultados;
        } catch (error) {
        console.error('❌ Error verificando fragmentación:', error);
        return { error: error.message };
        }
    }

    // Probar consultas distribuidas
    static async probarConsultasDistribuidas() {
        console.log('\n🌐 PROBANDO CONSULTAS DISTRIBUIDAS...\n');

        try {
        // Consulta a un centro específico (fragmentación)
        const consultasQuito = await masterPool.query(`
            SELECT cm.*, m.nombre as medico_nombre, p.nombre as paciente_nombre
            FROM consultas_medicas cm
            LEFT JOIN medicos m ON cm.id_medico = m.id_medico
            LEFT JOIN pacientes p ON cm.id_paciente = p.id_paciente
            WHERE cm.id_cen_med = 1
        `);

        const consultasGuayaquil = await slave1Pool.query(`
            SELECT cm.*, m.nombre as medico_nombre, p.nombre as paciente_nombre
            FROM consultas_medicas cm
            LEFT JOIN medicos m ON cm.id_medico = m.id_medico
            LEFT JOIN pacientes p ON cm.id_paciente = p.id_paciente
            WHERE cm.id_cen_med = 2
        `);

        console.log(`✅ Consultas en Quito: ${consultasQuito.rows.length} registros`);
        console.log(`✅ Consultas en Guayaquil: ${consultasGuayaquil.rows.length} registros`);
        console.log('📝 Cada centro solo ve sus propias consultas (fragmentación horizontal)');

        return {
            quito: consultasQuito.rows.length,
            guayaquil: consultasGuayaquil.rows.length
        };
        } catch (error) {
        console.error('❌ Error en consultas distribuidas:', error);
        return { error: error.message };
        }
    }
    }

    // Ejecutar demo si se llama directamente
    if (require.main === module) {
    async function runDemo() {
        await DemoFragmentacion.crearDatosDemo();
        await DemoFragmentacion.verificarFragmentacion();
        await DemoFragmentacion.probarConsultasDistribuidas();
        
        console.log('\n🎊 DEMOSTRACIÓN COMPLETADA');
        console.log('📍 Verifica el dashboard en: http://localhost:3000/monitor/dashboard');
    }

    runDemo();
}

module.exports = DemoFragmentacion;
const Monitor = require('../models/Monitor');
const DemoFragmentacion = require('../scripts/demoFragmentacion');

const monitorController = {

    /**
     * @swagger
     * /monitor/demo:
     *   post:
     *     summary: Ejecutar demostración de fragmentación
     *     tags: [Sistema]
     *     description: Crea datos de prueba y demuestra la fragmentación horizontal
     *     responses:
     *       200:
     *         description: Demostración ejecutada exitosamente
     *       500:
     *         description: Error en la demostración
     */
    ejecutarDemo: async (req, res) => {
    try {
        const resultados = await DemoFragmentacion.crearDatosDemo();
        
        if (resultados.success) {
        // Esperar un poco y verificar la fragmentación
        setTimeout(async () => {
            const fragmentacion = await DemoFragmentacion.verificarFragmentacion();
            const consultas = await DemoFragmentacion.probarConsultasDistribuidas();
            
            res.json({
            success: true,
            message: 'Demostración de fragmentación ejecutada exitosamente',
            resultados: {
                datos_creados: resultados,
                fragmentacion,
                consultas_distribuidas: consultas
            },
            endpoints_para_verificar: [
                'GET /monitor/dashboard',
                'GET /monitor/fragmentacion',
                'GET /consultas/centro/1',
                'GET /consultas/centro/2', 
                'GET /consultas/centro/3'
            ]
            });
        }, 1000);
        } else {
        res.status(500).json({
            success: false,
            error: resultados.error
        });
        }
    } catch (error) {
        res.status(500).json({
        success: false,
        error: error.message
        });
    }
    },

    /**
     * @swagger
     * /monitor/dashboard:
     *   get:
     *     summary: Dashboard completo del sistema distribuido
     *     tags: [Sistema]
     *     description: Retorna información completa del estado del sistema distribuido
     *     responses:
     *       200:
     *         description: Dashboard generado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 sistema:
     *                   type: object
     *                 nodos:
     *                   type: object
     *                 fragmentacion:
     *                   type: object
     *                 metricas:
     *                   type: object
     *       500:
     *         description: Error del servidor
     */
    getDashboard: async (req, res) => {
        try {
        const [nodos, fragmentacion, sistema, metricas] = await Promise.all([
            Monitor.getEstadoNodos(),
            Monitor.getEstadisticasFragmentacion(),
            Monitor.getInfoSistema(),
            Monitor.getMetricasPerformance()
        ]);

        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            sistema,
            nodos,
            fragmentacion,
            metricas,
            resumen: {
            estado_general: Object.values(nodos).every(n => n.estado === 'conectado') ? 'healthy' : 'degraded',
            total_consultas: fragmentacion.fragmentacion?.total || 0,
            nodos_activos: Object.values(nodos).filter(n => n.estado === 'conectado').length
            }
        });
        } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
        }
    },

    /**
     * @swagger
     * /monitor/nodos:
     *   get:
     *     summary: Estado de los nodos PostgreSQL
     *     tags: [Sistema]
     *     description: Verifica el estado de conexión de los 3 nodos distribuidos
     *     responses:
     *       200:
     *         description: Estado de nodos obtenido
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 nodos:
     *                   type: object
     */
    getEstadoNodos: async (req, res) => {
        try {
        const nodos = await Monitor.getEstadoNodos();
        res.json({
            success: true,
            nodos,
            resumen: {
            total_nodos: 3,
            conectados: Object.values(nodos).filter(n => n.estado === 'conectado').length,
            con_errores: Object.values(nodos).filter(n => n.estado === 'error').length
            }
        });
        } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
        }
    },

    /**
     * @swagger
     * /monitor/fragmentacion:
     *   get:
     *     summary: Estadísticas de fragmentación horizontal
     *     tags: [Sistema]
     *     description: Muestra cómo están distribuidos los datos entre los centros médicos
     *     responses:
     *       200:
     *         description: Estadísticas de fragmentación
     */
    getFragmentacion: async (req, res) => {
        try {
        const fragmentacion = await Monitor.getEstadisticasFragmentacion();
        res.json({
            success: true,
            ...fragmentacion
        });
        } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
        }
    }
};

module.exports = monitorController;
const ConsultaMedica = require('../models/ConsultaMedica');

const consultasController = {
    /**
   * @swagger
   * /consultas:
   *   post:
   *     summary: Crear nueva consulta médica
   *     tags: [Consultas Médicas]
   *     description: Crea una nueva consulta médica que se fragmenta automáticamente según el centro médico
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id_cen_med
   *               - id_medico
   *               - id_paciente
   *               - fecha_consulta
   *               - motivo_consulta
   *             properties:
   *               id_cen_med:
   *                 type: integer
   *                 example: 1
   *                 description: "ID del centro médico (1=Quito, 2=Guayaquil, 3=Cuenca) - Determina fragmentación"
   *               id_medico:
   *                 type: integer
   *                 example: 1
   *                 description: "ID del médico"
   *               id_paciente:
   *                 type: integer
   *                 example: 1
   *                 description: "ID del paciente"
   *               fecha_consulta:
   *                 type: string
   *                 format: date
   *                 example: "2025-10-25"
   *                 description: "Fecha de la consulta"
   *               hora_consulta:
   *                 type: string
   *                 example: "09:00"
   *                 description: "Hora de la consulta"
   *               motivo_consulta:
   *                 type: string
   *                 example: "Control cardiológico regular"
   *                 description: "Motivo de la consulta"
   *               costo:
   *                 type: number
   *                 format: float
   *                 example: 50.00
   *                 description: "Costo de la consulta"
   *     responses:
   *       201:
   *         description: Consulta creada exitosamente con fragmentación horizontal
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Consulta creada exitosamente"
   *                 data:
   *                   $ref: '#/components/schemas/ConsultaMedica'
   *                 centro:
   *                   type: integer
   *                   example: 1
   *                 nodo:
   *                   type: string
   *                   example: "Fragmentado por centro"
   *       400:
   *         description: Datos de entrada inválidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Error del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
    create: async (req, res) => {
        try {
        const { id_cen_med, id_medico, id_paciente, fecha_consulta, hora_consulta, motivo_consulta, costo } = req.body;
        
        // Validaciones básicas
        if (!id_cen_med || !id_medico || !id_paciente || !fecha_consulta || !motivo_consulta) {
            return res.status(400).json({
            success: false,
            error: 'Faltan campos requeridos: id_cen_med, id_medico, id_paciente, fecha_consulta, motivo_consulta'
            });
        }

        const nuevaConsulta = await ConsultaMedica.create({
            id_cen_med, id_medico, id_paciente, fecha_consulta, 
            hora_consulta, motivo_consulta, costo: costo || 0
        });
        
        res.status(201).json({
            success: true,
            message: 'Consulta creada exitosamente',
            data: nuevaConsulta,
            centro: id_cen_med,
            nodo: ConsultaMedica.getPoolForCenter ? 'Fragmentado por centro' : 'Master'
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
   * /consultas/centro/{id}:
   *   get:
   *     summary: Obtener consultas por centro médico
   *     tags: [Consultas Médicas]
   *     description: Retorna las consultas de un centro médico específico usando fragmentación horizontal
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del centro médico (1=Quito, 2=Guayaquil, 3=Cuenca)
   *     responses:
   *       200:
   *         description: Consultas obtenidas exitosamente desde el nodo correspondiente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ConsultaMedica'
   *                 count:
   *                   type: integer
   *                   example: 5
   *                 centro:
   *                   type: integer
   *                   example: 1
   *                 fragmentacion:
   *                   type: string
   *                   example: "horizontal"
   *       500:
   *         description: Error del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
    getByCentro: async (req, res) => {
        try {
        const consultas = await ConsultaMedica.getByCentro(req.params.id);
        
        res.json({
            success: true,
            data: consultas,
            count: consultas.length,
            centro: req.params.id,
            fragmentacion: 'horizontal'
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
   * /consultas:
   *   get:
   *     summary: Obtener todas las consultas (distribuida)
   *     tags: [Consultas Médicas]
   *     description: Retorna todas las consultas realizando una consulta distribuida a los 3 nodos PostgreSQL
   *     responses:
   *       200:
   *         description: Consultas obtenidas exitosamente desde los 3 nodos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ConsultaMedica'
   *                 count:
   *                   type: integer
   *                   example: 15
   *                 arquitectura:
   *                   type: string
   *                   example: "distribuida - consulta a 3 nodos"
   *       500:
   *         description: Error del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
    getAll: async (req, res) => {
        try {
        const consultas = await ConsultaMedica.getAll();
        
        res.json({
            success: true,
            data: consultas,
            count: consultas.length,
            arquitectura: 'distribuida - consulta a 3 nodos'
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
   * /consultas/estadisticas:
   *   get:
   *     summary: Obtener estadísticas distribuidas
   *     tags: [Consultas Médicas]
   *     description: Retorna estadísticas consolidadas de consultas desde los 3 nodos PostgreSQL
   *     responses:
   *       200:
   *         description: Estadísticas obtenidas exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     quito:
   *                       type: object
   *                       properties:
   *                         total:
   *                           type: integer
   *                           example: 8
   *                         costo_promedio:
   *                           type: number
   *                           format: float
   *                           example: 48.75
   *                         realizadas:
   *                           type: integer
   *                           example: 6
   *                         programadas:
   *                           type: integer
   *                           example: 2
   *                     guayaquil:
   *                       type: object
   *                     cuenca:
   *                       type: object
   *                 arquitectura:
   *                   type: string
   *                   example: "estadísticas consolidadas desde 3 nodos"
   *       500:
   *         description: Error del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
    getEstadisticas: async (req, res) => {
        try {
        const estadisticas = await ConsultaMedica.getEstadisticas();
        
        res.json({
            success: true,
            data: estadisticas,
            arquitectura: 'estadísticas consolidadas desde 3 nodos'
        });
        } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
        }
    }
};

module.exports = consultasController;
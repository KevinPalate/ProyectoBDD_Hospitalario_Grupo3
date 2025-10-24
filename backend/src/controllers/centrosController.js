const CentroMedico = require('../models/CentroMedico');

const centrosController = {
    /**
   * @swagger
   * /centros:
   *   get:
   *     summary: Obtener todos los centros médicos
   *     tags: [Centros Médicos]
   *     description: Retorna la lista de todos los centros médicos desde el nodo maestro (Quito)
   *     responses:
   *       200:
   *         description: Lista de centros médicos obtenida exitosamente
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
   *                     $ref: '#/components/schemas/CentroMedico'
   *                 count:
   *                   type: integer
   *                   example: 3
   *       500:
   *         description: Error del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
    getAll: async (req, res) => {
        try {
        const centros = await CentroMedico.getAll();
        res.json({
            success: true,
            data: centros,
            count: centros.length
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
   * /centros/{id}:
   *   get:
   *     summary: Obtener centro médico por ID
   *     tags: [Centros Médicos]
   *     description: Retorna un centro médico específico consultando el nodo correspondiente
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del centro médico (1=Quito, 2=Guayaquil, 3=Cuenca)
   *     responses:
   *       200:
   *         description: Centro médico encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/CentroMedico'
   *       404:
   *         description: Centro médico no encontrado
   *       500:
   *         description: Error del servidor
   */
    getById: async (req, res) => {
        try {
        const centro = await CentroMedico.getById(req.params.id);
        if (!centro) {
            return res.status(404).json({
            success: false,
            error: 'Centro médico no encontrado'
            });
        }
        res.json({
            success: true,
            data: centro
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
   * /centros:
   *   post:
   *     summary: Crear nuevo centro médico
   *     tags: [Centros Médicos]
   *     description: Crea un nuevo centro médico en el nodo maestro (Quito) - Solo datos maestros
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nombre
   *               - ciudad
   *             properties:
   *               nombre:
   *                 type: string
   *                 example: "Hospital Regional Ambato"
   *                 description: Nombre del centro médico
   *               ciudad:
   *                 type: string
   *                 example: "Ambato"
   *                 description: Ciudad donde se encuentra el centro
   *               direccion:
   *                 type: string
   *                 example: "Av. Los Shyris 123"
   *                 description: Dirección completa
   *               telefono:
   *                 type: string
   *                 example: "03-2456789"
   *                 description: Teléfono de contacto
   *               email:
   *                 type: string
   *                 example: "info@hospitalregional.ec"
   *                 description: Email de contacto
   *     responses:
   *       201:
   *         description: Centro médico creado exitosamente en el nodo maestro
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
   *                   example: "Centro médico creado exitosamente"
   *                 data:
   *                   $ref: '#/components/schemas/CentroMedico'
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
        const { nombre, ciudad, direccion, telefono, email } = req.body;
        
        if (!nombre || !ciudad) {
            return res.status(400).json({
            success: false,
            error: 'Nombre y ciudad son requeridos'
            });
        }

        const nuevoCentro = await CentroMedico.create(nombre, ciudad, direccion, telefono, email);
        
        res.status(201).json({
            success: true,
            message: 'Centro médico creado exitosamente',
            data: nuevoCentro
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
   * /centros/{id}/estadisticas:
   *   get:
   *     summary: Obtener estadísticas del centro médico
   *     tags: [Centros Médicos]
   *     description: Retorna estadísticas de consultas del centro médico específico usando fragmentación horizontal
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del centro médico (1=Quito, 2=Guayaquil, 3=Cuenca)
   *     responses:
   *       200:
   *         description: Estadísticas obtenidas exitosamente desde el nodo correspondiente
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
   *                     type: object
   *                     properties:
   *                       total_consultas:
   *                         type: integer
   *                         example: 15
   *                       pacientes_unicos:
   *                         type: integer
   *                         example: 12
   *                       costo_promedio:
   *                         type: number
   *                         format: float
   *                         example: 45.50
   *                       estado:
   *                         type: string
   *                         example: "Realizada"
   *                       consultas_hoy:
   *                         type: integer
   *                         example: 3
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
    getEstadisticas: async (req, res) => {
        try {
        const estadisticas = await CentroMedico.getEstadisticas(req.params.id);
        res.json({
            success: true,
            data: estadisticas,
            centro: req.params.id
        });
        } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
        }
    }
};

module.exports = centrosController;
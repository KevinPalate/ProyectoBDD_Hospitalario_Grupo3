const express = require('express');
const cors = require('cors');
const { swaggerUi, specs } = require('./config/swagger');

// Importar middlewares
const errorHandler = require('./middleware/errorHandler');
const loggerMiddleware = require('./middleware/logger');
const { securityHeaders, sanitizeInput } = require('./middleware/security');
const validationMiddleware = require('./middleware/validation');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad y logging
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(loggerMiddleware);

// Middleware
app.use(cors());
app.use(express.json());

// 📚 SWAGGER DOCUMENTATION
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Hospitalaria Distribuida - Grupo 3 UTA'
}));

const centrosRoutes = require('./routes/centrosRoutes');
const consultasRoutes = require('./routes/consultasRoutes');
const monitorRoutes = require('./routes/monitorRoutes');

app.use('/centros', centrosRoutes);
app.use('/consultas', consultasRoutes);
app.use('/monitor', monitorRoutes);
app.use('/auth', authRoutes);

// Rutas básicas
app.get('/', (req, res) => {
    res.json({ 
        message: 'API Sistema Hospitalario Distribuido',
        version: '1.0.0',
        arquitectura: 'MVC + Bases de Datos Distribuidas',
        documentacion: 'http://localhost:3000/api-docs', // ACTUALIZAR
        endpoints: {
            centros: 'http://localhost:3000/centros',
            consultas: 'http://localhost:3000/consultas',
            health: 'http://localhost:3000/health',
            docs: 'http://localhost:3000/api-docs'
        },
        middlewares: ['Error Handling', 'Logging', 'Security', 'Validation']
    });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar estado del sistema distribuido
 *     tags: [Health]
 *     description: Verifica la conexión a los 3 nodos PostgreSQL distribuidos
 *     responses:
 *       200:
 *         description: Sistema saludable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         description: Error en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/health', async (req, res) => {
    const { masterPool, slave1Pool, slave2Pool } = require('./config/database');
    
    try {
        const [master, slave1, slave2] = await Promise.all([
        masterPool.query('SELECT 1 as test'),
        slave1Pool.query('SELECT 1 as test'),
        slave2Pool.query('SELECT 1 as test')
        ]);
        
        res.json({
        status: 'healthy',
        databases: {
            master: 'connected',
            slave1: 'connected', 
            slave2: 'connected'
        }
        });
    } catch (error) {
        res.status(500).json({
        status: 'unhealthy',
        error: error.message
        });
    }
});

// Middleware de errores (DEBE IR AL FINAL)
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Ruta no encontrada: ${req.originalUrl}`,
        availableEndpoints: [
        'GET /',
        'GET /health',
        'GET /api-docs',
        'GET /centros',
        'POST /centros',
        'GET /centros/:id',
        'GET /centros/:id/estadisticas',
        'POST /consultas',
        'GET /consultas/centro/:id',
        'GET /consultas',
        'GET /consultas/estadisticas',
        'GET /monitor/dashboard',
        'GET /monitor/nodos',
        'GET /monitor/fragmentacion',
        'POST /monitor/demo'
        ]
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📊 Arquitectura: 3 nodos PostgreSQL distribuidos`);
    console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log(`🛡️  Middlewares: Error Handling, Logging, Security, Validation`);
    console.log(`🏥 Endpoints disponibles:`);
    console.log(`   http://localhost:${PORT}/ - API Home`);
    console.log(`   http://localhost:${PORT}/health - Health Check`);
    console.log(`   http://localhost:${PORT}/centros - Gestión de centros médicos`);
    console.log(`   http://localhost:${PORT}/consultas - Gestión de consultas médicas (FRAGMENTACIÓN)`);
    console.log(`   http://localhost:${PORT}/api-docs - Documentación Swagger`);
    console.log(`   http://localhost:${PORT}/monitor/dashboard - Dashboard de monitoreo`);
    console.log(`   http://localhost:${PORT}/auth - Autenticación JWT`);
});
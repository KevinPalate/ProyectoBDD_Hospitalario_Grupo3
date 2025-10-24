const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'API Sistema Hospitalario Distribuido - Grupo 3',
        version: '1.0.0',
        description: 'Sistema de gestión hospitalaria con arquitectura MVC y Bases de Datos Distribuidas - Universidad Técnica de Ambato',
        contact: {
            name: 'Grupo 3 - UTA',
            email: 'kpalate4416@uta.edu.ec'
        }
        },
        servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor de desarrollo'
        }
        ],
        tags: [
        {
            name: 'Health',
            description: 'Verificación del sistema distribuido'
        },
        {
            name: 'Centros Médicos',
            description: 'Gestión de centros médicos (datos maestros centralizados)'
        },
        {
            name: 'Consultas Médicas',
            description: 'Gestión de consultas médicas (fragmentación horizontal por centro)'
        },
        {
            name: 'Sistema',
            description: 'Monitoreo y métricas del sistema distribuido'
        }
        ],
        components: {
        schemas: {
            CentroMedico: {
            type: 'object',
            properties: {
                id_cen_med: { type: 'integer', example: 1 },
                nombre: { type: 'string', example: 'Hospital Metropolitano Quito' },
                ciudad: { type: 'string', example: 'Quito' },
                direccion: { type: 'string', example: 'Av. Mariana de Jesús Oe3-17' },
                telefono: { type: 'string', example: '02-3998000' },
                email: { type: 'string', example: 'info@metropolitano.ec' },
                created_at: { type: 'string', format: 'date-time' }
            }
            },
            ConsultaMedica: {
            type: 'object',
            properties: {
                id_consulta: { type: 'integer', example: 1 },
                id_cen_med: { 
                type: 'integer', 
                example: 1, 
                description: 'Determina fragmentación horizontal (1=Quito, 2=Guayaquil, 3=Cuenca)' 
                },
                id_medico: { type: 'integer', example: 1 },
                id_paciente: { type: 'integer', example: 1 },
                fecha_consulta: { type: 'string', format: 'date', example: '2025-10-25' },
                hora_consulta: { type: 'string', example: '09:00' },
                motivo_consulta: { type: 'string', example: 'Control cardiológico regular' },
                costo: { type: 'number', format: 'float', example: 50.00 },
                estado: { type: 'string', example: 'Programada' },
                created_at: { type: 'string', format: 'date-time' }
            }
            },
            Error: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                error: { type: 'string', example: 'Mensaje de error' }
            }
            },
            HealthResponse: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'healthy' },
                databases: {
                type: 'object',
                properties: {
                    master: { type: 'string', example: 'connected' },
                    slave1: { type: 'string', example: 'connected' },
                    slave2: { type: 'string', example: 'connected' }
                }
                }
            }
            }
        }
        }
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
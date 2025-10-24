/**
 * Middleware para manejo centralizado de errores
 * Captura todos los errores y los formatea consistentemente
 */
const errorHandler = (err, req, res, next) => {
    console.error('🔴 Error:', err.message);
    console.error('📋 Stack:', err.stack);

    // Error de validación de PostgreSQL
    if (err.code === '23505') { // unique_violation
        return res.status(409).json({
        success: false,
        error: 'El registro ya existe en la base de datos',
        details: err.detail
        });
    }

    // Error de foreign key violation
    if (err.code === '23503') {
        return res.status(400).json({
        success: false,
        error: 'Referencia inválida - el registro relacionado no existe',
        details: err.detail
        });
    }

    // Error de conexión a base de datos
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        return res.status(503).json({
        success: false,
        error: 'Error de conexión con la base de datos',
        details: 'Verifique que los servicios PostgreSQL estén ejecutándose'
        });
    }

    // Error de validación de datos
    if (err.name === 'ValidationError') {
        return res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: err.message
        });
    }

    // Error genérico del servidor
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
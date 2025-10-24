/**
 * Middleware para logging de requests y responses
 */
const loggerMiddleware = (req, res, next) => {
    const start = Date.now();

    // Log del request entrante
    console.log('📥 Request:', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });

    // Capturar la respuesta original para logging
    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - start;
        
        // Log del response
        console.log('📤 Response:', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
        });

        originalSend.call(this, data);
    };

    next();
};

module.exports = loggerMiddleware;
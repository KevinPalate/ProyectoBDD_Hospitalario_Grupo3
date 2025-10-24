/**
 * Middleware para medidas básicas de seguridad
 */
const securityMiddleware = {
    /**
     * Prevenir ataques básicos de inyección
     */
    sanitizeInput: (req, res, next) => {
        // Función para sanitizar strings
        const sanitize = (value) => {
        if (typeof value === 'string') {
            // Remover o escapar caracteres potencialmente peligrosos
            return value
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .trim();
        }
        return value;
        };

        // Sanitizar body
        if (req.body) {
        Object.keys(req.body).forEach(key => {
            req.body[key] = sanitize(req.body[key]);
        });
        }

        // Sanitizar query params
        if (req.query) {
        Object.keys(req.query).forEach(key => {
            req.query[key] = sanitize(req.query[key]);
        });
        }

        // Sanitizar params
        if (req.params) {
        Object.keys(req.params).forEach(key => {
            req.params[key] = sanitize(req.params[key]);
        });
        }

        next();
    },

    /**
     * Headers de seguridad básicos
     */
    securityHeaders: (req, res, next) => {
        // Prevenir clickjacking
        res.setHeader('X-Frame-Options', 'DENY');
        
        // Prevenir MIME type sniffing
        res.setHeader('X-Content-Type-Options', 'nosniff');
        
        // Política de referrer
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Política de permisos
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');

        next();
    }
};

module.exports = securityMiddleware;
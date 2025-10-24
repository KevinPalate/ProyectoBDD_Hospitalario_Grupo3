const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_hospital_2025_grupo3';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_hospital_2025_grupo3';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const authMiddleware = {
    /**
     * Generar tokens JWT
     */
    generateTokens: (user) => {
        const accessToken = jwt.sign(
        { 
            id: user.id_empleado, 
            cedula: user.cedula,
            rol: user.rol,
            id_cen_med: user.id_cen_med 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
        { 
            id: user.id_empleado,
            type: 'refresh' 
        },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
        );

        return { accessToken, refreshToken };
    },

    /**
     * Verificar token de acceso
     */
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Token de acceso requerido'
        });
        }

        const token = authHeader.substring(7); // Remover "Bearer "

        try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
        } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Token inválido o expirado'
        });
        }
    },

    /**
     * Verificar token de refresh
     */
    verifyRefreshToken: (token) => {
        try {
        return jwt.verify(token, JWT_REFRESH_SECRET);
        } catch (error) {
        throw new Error('Refresh token inválido');
        }
    },

    /**
     * Middleware para requerir autenticación
     */
    requireAuth: (req, res, next) => {
        authMiddleware.verifyToken(req, res, next);
    },

    /**
     * Middleware para requerir rol específico
     */
    requireRole: (roles) => {
        return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
            success: false,
            error: 'Autenticación requerida'
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
            success: false,
            error: 'No tiene permisos para acceder a este recurso'
            });
        }

        next();
        };
    },

    /**
     * Middleware para verificar acceso al centro médico
     */
    requireCentroAccess: (req, res, next) => {
        if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Autenticación requerida'
        });
        }

        // Admin puede acceder a todos los centros
        if (req.user.rol === 'admin') {
        return next();
        }

        // Usuario hospital solo puede acceder a su centro
        const requestedCentroId = parseInt(req.params.id) || parseInt(req.body.id_cen_med);
        
        if (req.user.id_cen_med !== requestedCentroId) {
        return res.status(403).json({
            success: false,
            error: 'Solo puede acceder a los datos de su centro médico'
        });
        }

        next();
    }
};

module.exports = authMiddleware;
const Auth = require('../models/Auth');
const authMiddleware = require('../middleware/auth');

const authController = {
    /**
     * Registro de nuevo usuario
     */
    register: async (req, res) => {
        try {
        const { cedula, nombre, apellido, cargo, id_cen_med, password, rol } = req.body;

        // Validaciones básicas
        if (!cedula || !nombre || !apellido || !cargo || !id_cen_med || !password || !rol) {
            return res.status(400).json({
            success: false,
            error: 'Todos los campos son requeridos'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
            success: false,
            error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        if (!['admin', 'hospital'].includes(rol)) {
            return res.status(400).json({
            success: false,
            error: 'Rol inválido. Debe ser "admin" o "hospital"'
            });
        }

        const newUser = await Auth.register({
            cedula,
            nombre,
            apellido,
            cargo,
            id_cen_med,
            password,
            rol
        });

        // Generar tokens
        const tokens = authMiddleware.generateTokens(newUser);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
            user: newUser,
            tokens
            }
        });

        } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
        }
    },

    /**
     * Login de usuario
     */
    login: async (req, res) => {
        try {
        const { cedula, password } = req.body;

        if (!cedula || !password) {
            return res.status(400).json({
            success: false,
            error: 'Cédula y contraseña son requeridos'
            });
        }

        const user = await Auth.login(cedula, password);

        // Generar tokens
        const tokens = authMiddleware.generateTokens(user);

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
            user,
            tokens
            }
        });

        } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
        }
    },

    /**
     * Refresh token
     */
    refreshToken: async (req, res) => {
        try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
            success: false,
            error: 'Refresh token requerido'
            });
        }

        const decoded = authMiddleware.verifyRefreshToken(refreshToken);
        
        // Obtener usuario
        const user = await Auth.getUserById(decoded.id);
        if (!user) {
            return res.status(401).json({
            success: false,
            error: 'Usuario no encontrado'
            });
        }

        // Generar nuevos tokens
        const tokens = authMiddleware.generateTokens(user);

        res.json({
            success: true,
            message: 'Tokens actualizados',
            data: { tokens }
        });

        } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
        }
    },

    /**
     * Obtener perfil del usuario autenticado
     */
    getProfile: async (req, res) => {
        try {
        const user = await Auth.getUserById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
            success: false,
            error: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: { user }
        });

        } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
        }
    },

    /**
     * Verificar token
     */
    verify: async (req, res) => {
        res.json({
        success: true,
        data: {
            user: req.user,
            valid: true
        }
        });
    }
};

module.exports = authController;
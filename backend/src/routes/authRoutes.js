const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthRequest:
 *       type: object
 *       required:
 *         - cedula
 *         - password
 *       properties:
 *         cedula:
 *           type: string
 *           example: "1712345678"
 *         password:
 *           type: string
 *           example: "miPassword123"
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - cedula
 *         - nombre
 *         - apellido
 *         - cargo
 *         - id_cen_med
 *         - password
 *         - rol
 *       properties:
 *         cedula:
 *           type: string
 *           example: "1712345678"
 *         nombre:
 *           type: string
 *           example: "Juan"
 *         apellido:
 *           type: string
 *           example: "Pérez"
 *         cargo:
 *           type: string
 *           example: "Médico"
 *         id_cen_med:
 *           type: integer
 *           example: 1
 *         password:
 *           type: string
 *           example: "miPassword123"
 *         rol:
 *           type: string
 *           enum: [admin, hospital]
 *           example: "hospital"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             tokens:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Error en los datos de entrada
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh token
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens actualizados
 *       401:
 *         description: Refresh token inválido
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido
 *       401:
 *         description: No autenticado
 */
router.get('/profile', authMiddleware.requireAuth, authController.getProfile);

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verificar token
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido
 */
router.get('/verify', authMiddleware.requireAuth, authController.verify);

module.exports = router;
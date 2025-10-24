const { masterPool } = require('../config/database');
const bcrypt = require('bcryptjs');

class Auth {
    /**
     * Registrar nuevo usuario (empleado)
     */
    static async register(usuarioData) {
        const { cedula, nombre, apellido, cargo, id_cen_med, password, rol } = usuarioData;
        
        // Verificar si el usuario ya existe
        const userExists = await masterPool.query(
        'SELECT id_empleado FROM empleados WHERE cedula = $1 OR usuario = $2',
        [cedula, cedula]
        );

        if (userExists.rows.length > 0) {
        throw new Error('El usuario ya existe');
        }

        // Hash de la contraseña
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Crear usuario
        const result = await masterPool.query(`
        INSERT INTO empleados 
            (cedula, nombre, apellido, cargo, id_cen_med, usuario, password_hash, rol)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id_empleado, cedula, nombre, apellido, cargo, id_cen_med, rol, created_at
        `, [cedula, nombre, apellido, cargo, id_cen_med, cedula, passwordHash, rol]);

        return result.rows[0];
    }

    /**
     * Login de usuario
     */
    static async login(cedula, password) {
        // Buscar usuario
        const result = await masterPool.query(`
        SELECT id_empleado, cedula, nombre, apellido, cargo, id_cen_med, password_hash, rol
        FROM empleados 
        WHERE cedula = $1 OR usuario = $1
        `, [cedula]);

        if (result.rows.length === 0) {
        throw new Error('Credenciales inválidas');
        }

        const user = result.rows[0];

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
        throw new Error('Credenciales inválidas');
        }

        // Remover password_hash del objeto de respuesta
        const { password_hash, ...userWithoutPassword } = user;
        
        return userWithoutPassword;
    }

    /**
     * Obtener usuario por ID
     */
    static async getUserById(id) {
        const result = await masterPool.query(`
        SELECT id_empleado, cedula, nombre, apellido, cargo, id_cen_med, rol, created_at
        FROM empleados 
        WHERE id_empleado = $1
        `, [id]);

        return result.rows[0];
    }

    /**
     * Verificar si usuario existe
     */
    static async userExists(cedula) {
        const result = await masterPool.query(
        'SELECT id_empleado FROM empleados WHERE cedula = $1 OR usuario = $1',
        [cedula]
        );
        return result.rows.length > 0;
    }
}

module.exports = Auth;
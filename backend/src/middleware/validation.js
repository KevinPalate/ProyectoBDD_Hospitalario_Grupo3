/**
 * Middleware para validar datos de entrada en requests
 */
const validationMiddleware = {
    /**
     * Valida la creación de un centro médico
     */
    validateCentroMedico: (req, res, next) => {
        const { nombre, ciudad } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'El nombre del centro médico es requerido y debe ser válido'
        });
        }

        if (!ciudad || typeof ciudad !== 'string' || ciudad.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'La ciudad del centro médico es requerida'
        });
        }

        // Sanitizar datos
        req.body.nombre = nombre.trim();
        req.body.ciudad = ciudad.trim();
        
        if (req.body.direccion) req.body.direccion = req.body.direccion.trim();
        if (req.body.telefono) req.body.telefono = req.body.telefono.trim();
        if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();

        next();
    },

    /**
     * Valida la creación de una consulta médica
     */
    validateConsultaMedica: (req, res, next) => {
        const { id_cen_med, id_medico, id_paciente, fecha_consulta, motivo_consulta } = req.body;

        const errors = [];

        if (!id_cen_med || isNaN(id_cen_med) || id_cen_med < 1 || id_cen_med > 3) {
        errors.push('ID de centro médico inválido. Debe ser 1, 2 o 3');
        }

        if (!id_medico || isNaN(id_medico) || id_medico < 1) {
        errors.push('ID de médico inválido');
        }

        if (!id_paciente || isNaN(id_paciente) || id_paciente < 1) {
        errors.push('ID de paciente inválido');
        }

        if (!fecha_consulta || !isValidDate(fecha_consulta)) {
        errors.push('Fecha de consulta inválida o en formato incorrecto (YYYY-MM-DD)');
        }

        if (!motivo_consulta || typeof motivo_consulta !== 'string' || motivo_consulta.trim().length === 0) {
        errors.push('El motivo de la consulta es requerido');
        }

        if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Errores de validación en los datos de entrada',
            details: errors
        });
        }

        // Sanitizar datos
        req.body.motivo_consulta = motivo_consulta.trim();
        req.body.id_cen_med = parseInt(id_cen_med);
        req.body.id_medico = parseInt(id_medico);
        req.body.id_paciente = parseInt(id_paciente);

        if (req.body.costo) {
        req.body.costo = parseFloat(req.body.costo) || 0;
        }

        next();
    },

    /**
     * Valida parámetros de ID en la URL
     */
    validateIdParam: (req, res, next) => {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id < 1) {
        return res.status(400).json({
            success: false,
            error: 'ID inválido. Debe ser un número positivo'
        });
        }

        req.params.id = id;
        next();
    }
};

// Función auxiliar para validar fechas
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regex)) return false;
    
    const date = new Date(dateString);
    const timestamp = date.getTime();
    
    return typeof timestamp === 'number' && !isNaN(timestamp) && date.toISOString().startsWith(dateString);
}

module.exports = validationMiddleware;
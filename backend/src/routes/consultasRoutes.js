const express = require('express');
const router = express.Router();
const consultasController = require('../controllers/consultasController');

// POST /consultas - Crear consulta (fragmentación automática)
router.post('/', consultasController.create);

// GET /consultas/centro/:id - Consultas por centro (fragmentación horizontal)
router.get('/centro/:id', consultasController.getByCentro);

// GET /consultas - Todas las consultas (consulta distribuida)
router.get('/', consultasController.getAll);

// GET /consultas/estadisticas - Estadísticas distribuidas
router.get('/estadisticas', consultasController.getEstadisticas);

module.exports = router;
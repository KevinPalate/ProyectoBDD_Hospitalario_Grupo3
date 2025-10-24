const express = require('express');
const router = express.Router();
const centrosController = require('../controllers/centrosController');

// GET /centros - Todos los centros médicos
router.get('/', centrosController.getAll);

// GET /centros/:id - Centro médico específico
router.get('/:id', centrosController.getById);

// POST /centros - Crear nuevo centro médico
router.post('/', centrosController.create);

// GET /centros/:id/estadisticas - Estadísticas del centro
router.get('/:id/estadisticas', centrosController.getEstadisticas);

module.exports = router;
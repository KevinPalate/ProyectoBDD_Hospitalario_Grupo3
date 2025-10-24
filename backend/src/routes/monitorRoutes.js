const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');

// POST /monitor/demo - Ejecutar demostración
router.post('/demo', monitorController.ejecutarDemo);   

// GET /monitor/dashboard - Dashboard completo
router.get('/dashboard', monitorController.getDashboard);

// GET /monitor/nodos - Estado de nodos
router.get('/nodos', monitorController.getEstadoNodos);

// GET /monitor/fragmentacion - Estadísticas de fragmentación
router.get('/fragmentacion', monitorController.getFragmentacion);

module.exports = router;
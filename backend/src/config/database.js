const { Pool } = require('pg');

// Configuración para los 3 nodos PostgreSQL
const masterConfig = {
    host: 'localhost',
    port: 5432,
    database: 'hospital_db',
    user: 'adminhospital',
    password: '12345Aa!'
};

const slave1Config = {
    host: 'localhost', 
    port: 5433,
    database: 'hospital_db',
    user: 'adminhospital',
    password: '12345Aa!'
};

const slave2Config = {
    host: 'localhost',
    port: 5434, 
    database: 'hospital_db',
    user: 'adminhospital',
    password: '12345Aa!'
};

// Crear pools de conexión
const masterPool = new Pool(masterConfig);
const slave1Pool = new Pool(slave1Config);
const slave2Pool = new Pool(slave2Config);

// Función para determinar qué nodo usar basado en el centro médico
function getPoolForCenter(idCenMed) {
  // Lógica de fragmentación horizontal
    switch(parseInt(idCenMed)) {
        case 1: // Quito - Master (escritura)
            return masterPool;
        case 2: // Guayaquil - Slave 1 (lectura)
            return slave1Pool; 
        case 3: // Cuenca - Slave 2 (lectura)
            return slave2Pool;
        default:
            return masterPool;
    }
}

module.exports = {
    masterPool,
    slave1Pool,
    slave2Pool,
    getPoolForCenter
};
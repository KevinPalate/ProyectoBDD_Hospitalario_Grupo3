const DemoFragmentacion = require('./src/scripts/demoFragmentacion');

console.log('🚀 INICIANDO DEMOSTRACIÓN DE FRAGMENTACIÓN HORIZONTAL');
console.log('====================================================\n');

async function main() {
    try {
        await DemoFragmentacion.crearDatosDemo();
        await DemoFragmentacion.verificarFragmentacion();
        await DemoFragmentacion.probarConsultasDistribuidas();
        
        console.log('\n🎊 DEMOSTRACIÓN COMPLETADA EXITOSAMENTE!');
        console.log('\n📍 PARA VERIFICAR:');
        console.log('   • Dashboard: http://localhost:3000/monitor/dashboard');
        console.log('   • Fragmentación: http://localhost:3000/monitor/fragmentacion');
        console.log('   • Swagger Docs: http://localhost:3000/api-docs');
        
    } catch (error) {
        console.error('❌ Error en demostración:', error);
    }
}

main();
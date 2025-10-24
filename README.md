# Proyecto BDD Hospitalario - Grupo 3

## Sistema Hospitalario Distribuido con Arquitectura MVC

### Descripción
Sistema distribuido para gestión de múltiples centros médicos con bases de datos distribuidas PostgreSQL, replicación maestro-esclavo y fragmentación horizontal.

### Arquitectura
- **Backend**: Node.js + Express + MVC
- **Base de Datos**: PostgreSQL distribuido (3 nodos)
- **Frontend**: React.js
- **Infraestructura**: Docker + Azure
- **DevOps**: Azure DevOps CI/CD

### Equipo
- Ases Tiban Jeremy Damián
- Palate Moreta Kevin Damián  
- Poveda Gómez William Alberto
- Pullupaxi Chango Daniel

### Universidad
Universidad Técnica de Ambato - Carrera de Tecnologías de la Información

## Objetivo del Proyecto
Desarrollar una aplicación distribuida que utilice la arquitectura MVC para gestionar la información de un sistema hospitalario integrado por múltiples centros médicos, implementando bases de datos distribuidas con replicación y fragmentación horizontal.

## Arquitectura Implementada

### Diagramas de Arquitectura
- [Arquitectura General](docs/architecture/arquitectura-general.md)
- [Base de Datos Distribuida](docs/architecture/bdd-arquitectura.md)
- [Fragmentación Horizontal](docs/architecture/fragmentacion-horizontal.md)
- [Arquitectura MVC](docs/architecture/arquitectura-mvc.md)

### Infraestructura
```bash
# 3 Nodos PostgreSQL en Docker
centro-quito-master (5432)      # Nodo Maestro - Quito
centro-guayaquil-slave (5433)   # Nodo Esclavo - Guayaquil  
centro-cuenca-slave (5434)      # Nodo Esclavo - Cuenca
```

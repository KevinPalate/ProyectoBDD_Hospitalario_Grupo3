# Arquitectura de Base de Datos Distribuida

## Modelo Híbrido: Centralizado + Distribuido

```
┌─────────────────────────────────────────────────────────────────┐
│ ARQUITECTURA BDD DISTRIBUIDA                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐              ┌──────────────────────┐       │
│ │ NODO MASTER     │              │ NODO SLAVE 1         │       │
│ │ Quito (5432)    │◄─REPLICACIÓN─│ Guayaquil (5433)     │       │
│ │                 │              │                      │       │
│ │ • Datos Maestros│              │ • Consultas          │       │
│ │ - Centros       │              │ Centro 2             │       │
│ │ - Médicos       │              │ • Solo Lectura       │       │
│ │ - Pacientes     │              │                      |       │
│ │ • Consultas     │              └──────────────────────┘       │
│ │ Centro 1        │                       |                     │
│ └─────────────────┘                       |                     │
│          │           REPLICACIÓN          |                     │
│          |                                |                     │
│ ┌─────────────────┐              ┌──────────────────────┐       │
│ │ NODO SLAVE 2    │              │ BACKEND API          │       │
│ │ Cuenca (5434)   │◄─────────────│ (Node/Express)       |       │
│ │                 │              │                      │       │
│ │ • Consultas     │              │ • Lógica             │       │
│ │ Centro 3        │              │ Fragmentación        │       │
│ │ • Solo Lectura  │              │ • getPoolForCenter() |       │
│ │                 │              │                      │       │
│ └─────────────────┘              └──────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **Características:**
- **Fragmentación Horizontal**: Consultas divididas por `id_cen_med`
- **Replicación Maestro-Eslavo**: Datos maestros replicados
- **Modelo Híbrido**: Datos centralizados + consultas distribuidas
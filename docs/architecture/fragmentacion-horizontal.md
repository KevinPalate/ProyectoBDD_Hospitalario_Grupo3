# Fragmentación Horizontal por Centro Médico

## Distribución Automática de Consultas

```
┌─────────────────────────────────────────────────────────────────┐
│ FRAGMENTACIÓN HORIZONTAL                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                 CONSULTA: { id_cen_med: 1, ... }                │
│                               │                                 │
│                               ▼                                 │
│                      ┌─────────────────┐                        │
│                      │ BACKEND API     │                        │
│                      │ (Node.js)       │                        │
│                      │                 │                        │
│                      │ • getPoolForCenter()                     │
│                      │ • Lógica de Fragmentación                │
│                      └─────────────────┘                        │
│                               │                                 │
│                               ▼                                 │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│ │ CENTRO 1        │  │ CENTRO 2        │  │ CENTRO 3        │   │
│ │ (Quito)         │  │ (Guayaquil)     │  │ (Cuenca)        │   │
│ │                 │  │                 │  │                 │   │
│ │ • Consultas     │  │ • Consultas     │  │ • Consultas     │   │
│ │ Quito           │  │ Guayaquil       │  │ Cuenca          │   │
│ │ • Escritura     │  │ • Solo Lectura  │  │ • Solo Lectura  │   │
│ │ • Datos Maestros│  │ • Réplica       │  │ • Réplica       │   │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **Lógica de Fragmentación:**
```javascript
function getPoolForCenter(idCenMed) {
  switch(idCenMed) {
    case 1: return masterPool;    // Quito - Escritura
    case 2: return slave1Pool;    // Guayaquil - Lectura  
    case 3: return slave2Pool;    // Cuenca - Lectura
  }
}
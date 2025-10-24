# Arquitectura del Sistema Hospitalario Distribuido

## Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│ SISTEMA HOSPITALARIO DISTRIBUIDO                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐  │
│ │ FRONTEND        │    │ BACKEND         │    │ BASE DE      │  │
│ │ (React)         │    │ (Node/Express)  │    │ DATOS        │  │
│ │                 │    │                 │    │ DISTRIBUIDA  │  │
│ │ • Interfaz Admin│◄──►│ • API RESTful   │◄──►│ • PostgreSQL │  │
│ │ • Interfaz Hosp.│    │ • Arquitectura  │    │ • 3 Nodos    │  │
│ │                 │    │ MVC             │    │ • Replicación│  │
│ └─────────────────┘    └─────────────────┘    └──────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **Flujo de Datos:**
1. **Frontend** → Solicitudes HTTP → **Backend API**
2. **Backend** → Conexiones → **Base de Datos Distribuida**
3. **Fragmentación** automática por centro médico
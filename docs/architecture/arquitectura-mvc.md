# Arquitectura MVC del Backend

## Patrón Modelo-Vista-Controlador

```
┌─────────────────────────────────────────────────────────────────┐
│ ARQUITECTURA MVC - BACKEND                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐       │
│ │ ROUTES      │    │ CONTROLLERS │    │ MODELS          │       │
│ │             │    │             │    │                 │       │
│ │ • /centros  │───►│ • centros-  │───►│ • CentroMedico  │       │
│ │ • /consultas│    │ Controller  │    │ • ConsultaMedica│       │
│ │ • /monitor  │    │ • consultas-│    │ • Monitor       │       │
│ │             │    │ Controller  │    │                 │       │
│ └─────────────┘    └─────────────┘    └─────────────────┘       │
│        │                                        │               │
│        ▼                                        ▼               │
│ ┌─────────────┐                       ┌─────────────────┐       │
│ │ VISTA       │                       │ DATABASE        │       │
│ │ (JSON/HTTP) │                       │ CONFIGURATION   │       │
│ │             │                       │                 │       │
│ │ • Respuestas│                       │ • 3 PostgreSQL  │       │
│ │ JSON        │                       │ Nodos           │       │
│ │ • Swagger   │                       │ • Pools         │       │
│ │ Docs        │                       │ • Fragmentación │       │
│ └─────────────┘                       └─────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **Flujo de Petición:**
1. **Routes** → Recibe petición HTTP
2. **Controllers** → Procesa lógica de negocio  
3. **Models** → Interactúa con base de datos
4. **Database** → 3 nodos distribuidos
5. **Vista** → Retorna JSON al cliente
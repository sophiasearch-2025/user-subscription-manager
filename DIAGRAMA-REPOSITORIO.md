# 📊 Diagrama del Repositorio - User Subscription Manager

Este documento proporciona una visualización completa de la estructura del repositorio, sus scripts y las relaciones entre componentes.

---

## 📁 Estructura del Repositorio

```
user-subscription-manager/
│
├── 📂 src/                          # Código fuente de la aplicación
│   ├── 📂 api/                      # Rutas de la API REST
│   │   ├── auth.routes.js           # Rutas de autenticación
│   │   ├── user.routes.js           # Rutas de usuarios
│   │   ├── subscription.routes.js   # Rutas de suscripciones
│   │   ├── payment.routes.js        # Rutas de pagos
│   │   ├── scheduler.routes.js      # Rutas de tareas programadas
│   │   └── index.js                 # Enrutador principal
│   │
│   ├── 📂 controllers/              # Lógica de negocio
│   │   ├── auth.controller.js       # Control de autenticación
│   │   ├── user.controller.js       # Control de usuarios
│   │   ├── subscription.controller.js  # Control de suscripciones
│   │   └── payment.controller.js    # Control de pagos
│   │
│   ├── 📂 services/                 # Servicios reutilizables
│   │   ├── email.service.js         # 📧 Envío de emails (Gmail/SendGrid)
│   │   ├── notification.service.js  # 🔔 Sistema de notificaciones
│   │   ├── scheduler.service.js     # ⏰ Tareas programadas
│   │   ├── payment.service.js       # 💳 Procesamiento de pagos (Stripe)
│   │   └── security.service.js      # 🔒 Seguridad y validaciones
│   │
│   ├── 📂 models/                   # Modelos de datos
│   │   ├── User.js                  # Modelo de usuario
│   │   ├── Subscription.js          # Modelo de suscripción
│   │   └── Payment.js               # Modelo de pago
│   │
│   ├── 📂 middlewares/              # Middlewares de Express
│   │   ├── auth.middleware.js       # Verificación de autenticación
│   │   └── role.middleware.js       # Verificación de roles
│   │
│   ├── 📂 config/                   # Configuraciones
│   │   ├── firebase.js              # Configuración de Firebase
│   │   └── stripe.js                # Configuración de Stripe
│   │
│   ├── 📂 scripts/                  # Scripts de utilidad
│   │   ├── seed.js                  # 🌱 Poblar BD con datos de prueba
│   │   ├── test-notifications.js    # 📬 Probar sistema de notificaciones
│   │   ├── test-firestore.js        # 🔥 Probar conexión a Firestore
│   │   ├── backup.js                # 💾 Backup de base de datos
│   │   └── example-data.js          # 📝 Datos de ejemplo
│   │
│   ├── 📂 tests/                    # Tests unitarios e integración
│   │   ├── auth.test.js             # Tests de autenticación
│   │   ├── user.test.js             # Tests de usuarios
│   │   └── subscription.test.js     # Tests de suscripciones
│   │
│   ├── 📂 workers/                  # Workers/Procesos en background
│   │   └── email.worker.js          # Worker para procesar emails
│   │
│   └── app.js                       # 🚀 Punto de entrada de la aplicación
│
├── 📂 docs/                         # Documentación
│   ├── arquitectura.md              # Arquitectura del sistema
│   ├── arquitectura-visual.md       # Diagramas visuales
│   ├── notificaciones.md            # Sistema de notificaciones
│   ├── guia-rapida.md              # Guía de inicio rápido
│   └── configurar-sendgrid.md      # Configuración de SendGrid
│
├── 📄 README.md                     # Documentación principal
├── 📄 COMANDOS.md                   # Referencia de comandos
├── 📄 API-ENDPOINTS.md              # Documentación de la API
├── 📄 SISTEMA-NOTIFICACIONES.md     # Sistema de notificaciones
├── 📄 IMPLEMENTACION.md             # Detalles de implementación
├── 📄 INICIO.md                     # Guía de inicio
├── 📄 CHECKLIST.md                  # Lista de verificación
├── 📄 DESPLIEGUE.md                 # Guía de despliegue
│
├── 🐳 Dockerfile                    # Imagen Docker de la aplicación
├── 🐳 docker-compose.yml            # Orquestación de contenedores
│
├── 📦 package.json                  # Dependencias Node.js
├── 📦 package-lock.json             # Lock de dependencias
├── 🐍 requirements.txt              # Dependencias Python (si aplica)
│
├── 🔧 .env.example                  # Plantilla de variables de entorno
├── 🔧 .gitignore                    # Archivos ignorados por Git
└── 🔧 .dockerignore                 # Archivos ignorados por Docker
```

---

## 🛠️ Scripts NPM Disponibles

### Scripts de Desarrollo

| Script | Comando | Descripción |
|--------|---------|-------------|
| **start** | `npm start` | Inicia el servidor en modo producción |
| **dev** | `npm run dev` | Inicia el servidor en modo desarrollo con auto-reload (nodemon) |

### Scripts de Testing

| Script | Comando | Descripción |
|--------|---------|-------------|
| **test:notifications** | `npm run test:notifications` | Prueba el sistema de notificaciones enviando 3 emails de prueba |
| **test:firestore** | `npm run test:firestore` | Verifica la conexión a Firebase Firestore |

### Scripts de Utilidad

| Script | Comando | Descripción |
|--------|---------|-------------|
| **seed** | `npm run seed` | Puebla Firestore con datos de prueba (usuarios, suscripciones, planes) |
| **scheduler** | `npm run scheduler` | Ejecuta manualmente la verificación de suscripciones próximas a vencer |

---

## 🔄 Diagrama de Flujo del Sistema

### Flujo Principal: Crear Suscripción

```
┌─────────────────┐
│   Cliente HTTP  │
└────────┬────────┘
         │
         │ POST /api/subscriptions
         ▼
┌─────────────────────────────┐
│  subscription.routes.js     │
└────────┬────────────────────┘
         │
         │ createSubscription()
         ▼
┌─────────────────────────────┐
│ subscription.controller.js  │
│  • Valida datos             │
│  • Crea doc en Firestore    │
│  • Envía notificación       │
└────────┬────────────────────┘
         │
         ├──────────────────┬────────────────────┐
         ▼                  ▼                    ▼
┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐
│   Firestore  │   │ notification     │   │  Response 201    │
│ (subscriptions)   │   .service.js    │   │  Created         │
└──────────────┘   └────────┬─────────┘   └──────────────────┘
                            │
                            │ sendEmail()
                            ▼
                   ┌──────────────────┐
                   │  email.service.js│
                   │  • Genera HTML   │
                   │  • Envía email   │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │  Gmail / SendGrid│
                   │  SMTP            │
                   └──────────────────┘
                            │
                            ▼
                   📧 Email recibido por usuario
```

### Flujo: Verificación Automática de Suscripciones

```
┌──────────────────────┐
│  Cron Job Externo    │
│  (cron-job.org)      │
│  Ejecuta diariamente │
└──────────┬───────────┘
           │
           │ POST /api/scheduler/run
           ▼
┌──────────────────────────────┐
│  scheduler.routes.js         │
└──────────┬───────────────────┘
           │
           │ runScheduledTasks()
           ▼
┌──────────────────────────────┐
│  scheduler.service.js        │
│  • Consulta Firestore        │
│  • Filtra suscripciones      │
│    próximas a vencer         │
│  • Calcula días restantes    │
└──────────┬───────────────────┘
           │
           │ Por cada suscripción
           ▼
┌──────────────────────────────┐
│  notification.service.js     │
│  • Verifica si ya se envió   │
│    notificación (7/3/1 días) │
│  • Envía email si aplica     │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  email.service.js            │
│  • Template HTML dinámico    │
│  • Envío vía SMTP            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Firestore (notifications)   │
│  • Registra notificación     │
│    enviada para auditoría    │
└──────────────────────────────┘
```

---

## 🗂️ Arquitectura de Componentes

### Capa de Presentación (API)

```
┌──────────────────────────────────────────────────────────┐
│                        API REST                          │
│                  (Express.js Server)                     │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │   Auth   │  │  Users   │  │Subscrip. │  │ Scheduler││
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  ││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘│
└───────┼─────────────┼─────────────┼─────────────┼──────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌───────────────────────────────────────────────────────┐
│              Middlewares (Auth, Validation)           │
└───────────────────────────────────────────────────────┘
```

### Capa de Lógica de Negocio (Controllers & Services)

```
┌──────────────────────────────────────────────────────────┐
│                      Controllers                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │     Auth     │  │    Users     │  │ Subscriptions│  │
│  │  Controller  │  │  Controller  │  │  Controller  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌──────────────────────────────────────────────────────────┐
│                        Services                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │ Security │  │Notification│ │ Scheduler│  │ Payment  ││
│  │ Service  │  │  Service   │ │ Service  │  │ Service  ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│  ┌──────────┐                                           │
│  │  Email   │                                           │
│  │ Service  │                                           │
│  └──────────┘                                           │
└──────────────────────────────────────────────────────────┘
```

### Capa de Datos

```
┌──────────────────────────────────────────────────────────┐
│                      Data Models                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │     User     │  │ Subscription │  │   Payment    │  │
│  │    Model     │  │    Model     │  │    Model     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                   Firebase Firestore                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │  users/  │  │subscript.│  │payments/ │  │notifica. ││
│  │collection│  │collection│  │collection│  │collection││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
└──────────────────────────────────────────────────────────┘
```

### Integraciones Externas

```
┌──────────────────────────────────────────────────────────┐
│                  External Services                       │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Firebase   │  │  Gmail/SMTP  │  │    Stripe    │  │
│  │  (Firestore) │  │  (SendGrid)  │  │  (Payments)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐                                       │
│  │  cron-job.org│                                       │
│  │  (Scheduler) │                                       │
│  └──────────────┘                                       │
└──────────────────────────────────────────────────────────┘
```

---

## 📝 Detalles de Scripts

### 1. `seed.js` - Poblar Base de Datos

**Propósito**: Crear datos de prueba en Firestore

**Qué hace**:
- Crea usuarios de ejemplo
- Crea suscripciones con diferentes fechas de vencimiento:
  - Algunas próximas a vencer (7 días)
  - Algunas próximas a vencer (3 días)
  - Algunas próximas a vencer (1 día)
- Crea planes de suscripción

**Uso**:
```bash
npm run seed
```

**Código interno**:
```javascript
// Crea usuarios
await db.collection('users').doc(userId).set(userData);

// Crea suscripciones
await db.collection('subscriptions').doc(subscriptionId).set(subscriptionData);
```

---

### 2. `test-notifications.js` - Probar Notificaciones

**Propósito**: Verificar que el sistema de notificaciones funcione correctamente

**Qué hace**:
- Detecta el servicio de email configurado (Gmail, SendGrid, Brevo, etc.)
- Verifica las variables de entorno
- Envía 3 emails de prueba:
  1. **Suscripción Recibida** 
  2. **Plan Próximo a Vencer** (7 días)
  3. **Plan Renovado**

**Uso**:
```bash
npm run test:notifications
```

**Salida esperada**:
```
🧪 === PRUEBA 1: Servicio de Email ===
📧 Servicio de email detectado: GMAIL
✅ Configuración correcta

📬 Enviando email de prueba...
✅ Email enviado exitosamente
```

---

### 3. `test-firestore.js` - Probar Firebase

**Propósito**: Verificar la conexión a Firestore

**Qué hace**:
- Verifica que `serviceAccountKey.json` exista
- Verifica que `FIREBASE_PROJECT_ID` esté configurado
- Intenta conectarse a Firestore
- Lista las colecciones existentes

**Uso**:
```bash
npm run test:firestore
```

---

### 4. `scheduler` - Verificar Suscripciones

**Propósito**: Ejecutar manualmente la verificación de suscripciones próximas a vencer

**Qué hace**:
- Consulta todas las suscripciones activas en Firestore
- Calcula días restantes hasta vencimiento
- Envía notificaciones si aplica (7, 3, 1 días antes)
- Registra notificaciones enviadas en Firestore

**Uso**:
```bash
npm run scheduler
```

**Cuándo se ejecuta automáticamente**:
- Configurado con cron job externo (ej: cron-job.org)
- Horario recomendado: Diariamente a las 9:00 AM

---

### 5. `backup.js` - Backup de Base de Datos

**Propósito**: Crear respaldo de datos de Firestore

**Qué hace**:
- Exporta todas las colecciones de Firestore
- Guarda los datos en archivos JSON

**Uso**:
```bash
node src/scripts/backup.js
```

---

## 🔌 Endpoints de la API

### Suscripciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/subscriptions` | Crear nueva suscripción (envía email) |
| GET | `/api/subscriptions/:id` | Obtener suscripción por ID |
| PUT | `/api/subscriptions/:id` | Actualizar suscripción |
| POST | `/api/subscriptions/:id/renew` | Renovar suscripción (envía email) |
| DELETE | `/api/subscriptions/:id` | Cancelar suscripción |

### Scheduler

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/scheduler/run` | Ejecutar verificación de suscripciones |
| POST | `/api/scheduler/check-expiring` | Solo verificar suscripciones próximas a vencer |
| POST | `/api/scheduler/check-expired` | Solo marcar suscripciones expiradas |
| GET | `/api/scheduler/status` | Estado del scheduler |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/users` | Crear usuario |
| GET | `/api/users/:id` | Obtener usuario por ID |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

### Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Verificar estado de la API |
| GET | `/api/health` | Verificar estado detallado |

---

## 🔄 Ciclo de Vida de una Suscripción

```
1. CREAR
   │
   ├─► Usuario envía POST /api/subscriptions
   │   {
   │     "userId": "user123",
   │     "planId": "premium",
   │     "userEmail": "user@example.com",
   │     "userName": "Juan",
   │     "planName": "Plan Premium"
   │   }
   │
   ├─► Controlador crea documento en Firestore
   │   Collection: subscriptions/
   │   {
   │     "status": "active",
   │     "startDate": "2024-11-13",
   │     "expirationDate": "2024-12-13",
   │     ...
   │   }
   │
   └─► Sistema envía email "Suscripción Recibida"
       📧 Template: subscription-received.html

2. MONITOREO DIARIO
   │
   ├─► Cron job ejecuta POST /api/scheduler/run (diariamente)
   │
   ├─► Scheduler consulta suscripciones activas
   │
   ├─► Calcula días restantes
   │
   └─► Si queda 7, 3 o 1 día:
       └─► Envía email "Plan Próximo a Vencer"
           📧 Template: plan-expiring.html
           └─► Registra en Firestore para no duplicar

3. RENOVAR
   │
   ├─► Usuario/Sistema envía POST /api/subscriptions/:id/renew
   │
   ├─► Actualiza expirationDate (+30 días)
   │
   └─► Envía email "Plan Renovado"
       📧 Template: plan-renewed.html

4. EXPIRAR
   │
   ├─► Scheduler detecta que expirationDate < hoy
   │
   ├─► Actualiza status: "active" → "expired"
   │
   └─► (Opcional) Envía email "Suscripción Expirada"
```

---

## 🎨 Templates de Email

El sistema utiliza templates HTML dinámicos:

### 1. Suscripción Recibida
- **Trigger**: Al crear una nueva suscripción
- **Contenido**: 
  - Bienvenida
  - Detalles del plan
  - Fecha de inicio y vencimiento
  - Precio

### 2. Plan Próximo a Vencer
- **Trigger**: 7, 3 y 1 días antes del vencimiento
- **Contenido**:
  - Alerta de vencimiento
  - Días restantes
  - Botón de renovación
  - Detalles del plan

### 3. Plan Renovado
- **Trigger**: Al renovar una suscripción
- **Contenido**:
  - Confirmación de renovación
  - Nueva fecha de vencimiento
  - Detalles del pago

---

## 🔧 Variables de Entorno Necesarias

```env
# Firebase
FIREBASE_PROJECT_ID=tu-proyecto-firebase

# Email Service (Gmail)
SMTP_USER=tucorreo@gmail.com
SMTP_PASS=tu-app-password

# Alternativa: SendGrid
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=tu-api-key

# Frontend
FRONTEND_URL=http://localhost:3000

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_test_...
```

---

## 📊 Dependencias Principales

### Producción

| Paquete | Versión | Uso |
|---------|---------|-----|
| `express` | ^4.18.2 | Framework web |
| `firebase-admin` | ^12.0.0 | SDK de Firebase |
| `nodemailer` | ^6.9.7 | Envío de emails |
| `stripe` | ^19.2.0 | Procesamiento de pagos |
| `node-cron` | ^4.2.1 | Tareas programadas |
| `helmet` | ^7.1.0 | Seguridad HTTP |
| `cors` | ^2.8.5 | CORS |
| `dotenv` | ^16.3.1 | Variables de entorno |
| `express-rate-limit` | ^7.1.5 | Rate limiting |

### Desarrollo

| Paquete | Versión | Uso |
|---------|---------|-----|
| `nodemon` | ^3.0.2 | Auto-reload en desarrollo |

---

## 🚀 Flujo de Despliegue

```
1. Desarrollo Local
   ├── npm install
   ├── Configurar .env
   ├── Agregar serviceAccountKey.json
   └── npm run dev

2. Testing
   ├── npm run test:firestore (verificar conexión)
   ├── npm run test:notifications (probar emails)
   ├── npm run seed (crear datos de prueba)
   └── npm run scheduler (probar verificación)

3. Producción
   ├── Desplegar en Render/Railway/Heroku
   ├── Configurar variables de entorno
   ├── Subir serviceAccountKey.json
   └── Configurar cron job externo (cron-job.org)

4. Monitoreo
   ├── Ver logs del servidor
   ├── Revisar Firebase Console
   └── Verificar emails enviados
```

---

## 📚 Documentos Relacionados

- **README.md** - Documentación principal del proyecto
- **COMANDOS.md** - Referencia rápida de comandos
- **API-ENDPOINTS.md** - Documentación completa de la API
- **SISTEMA-NOTIFICACIONES.md** - Detalles del sistema de notificaciones
- **docs/arquitectura.md** - Arquitectura técnica
- **docs/notificaciones.md** - Guía completa de notificaciones
- **DESPLIEGUE.md** - Guía de despliegue en producción

---

## 🎯 Resumen

Este repositorio implementa un sistema completo de gestión de suscripciones con:

✅ API REST con Express.js  
✅ Base de datos en Firebase Firestore  
✅ Sistema de notificaciones por email  
✅ Verificación automática de suscripciones  
✅ Templates HTML profesionales  
✅ Scripts de utilidad para testing  
✅ Arquitectura modular y escalable  
✅ 100% gratuito (Firebase + Gmail/SendGrid gratuito)  

**Para comenzar**: Consulta `README.md` y `INICIO.md`

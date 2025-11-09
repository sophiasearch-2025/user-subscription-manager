# 📧 Sistema de Notificaciones por Email

Sistema completo de notificaciones automáticas para gestión de suscripciones.

## ✅ Funcionalidades Implementadas

### 1. **Email de Bienvenida** 🎉
- Se envía automáticamente cuando se crea un nuevo usuario
- Plantilla personalizada con el nombre del usuario
- Link a la plataforma

### 2. **Alertas de Expiración de Suscripción** ⏰
El sistema envía notificaciones automáticas en:
- **7 días antes** del vencimiento
- **5 días antes** del vencimiento  
- **3 días antes** del vencimiento
- **1 día antes** del vencimiento

**Características:**
- Solo se envía 1 email por día para cada alerta
- Registra las notificaciones enviadas en Firestore
- Evita duplicados verificando la fecha de última notificación

### 3. **Confirmación de Suscripción Recibida** ✅
- Se envía cuando se crea una nueva solicitud de suscripción
- Incluye ID de suscripción y detalles del plan

### 4. **Confirmación de Renovación** 🔄
- Se envía cuando se renueva una suscripción
- Incluye nueva fecha de vencimiento

## 📁 Archivos del Sistema

### Servicios

**`src/services/email.service.js`**
- Configuración de Gmail SMTP
- Plantillas HTML para los 4 tipos de email
- Funciones de envío: `sendWelcomeEmail()`, `sendPlanExpiringEmail()`, etc.

**`src/services/notification.service.js`**
- Envío de notificaciones individuales
- Registro en Firestore de cada notificación enviada
- Funciones: `sendWelcomeNotification()`, `sendSubscriptionReceivedNotification()`, etc.

**`src/services/scheduler.service.js`**
- Verificación automática de suscripciones
- Función: `checkExpiringSubscriptions()` - Revisa y envía alertas
- Función: `checkExpiredSubscriptions()` - Marca suscripciones expiradas
- Función: `runScheduledTasks()` - Ejecuta todas las tareas

### Scripts de Prueba

**`test-notifications.js`**
- Script completo para testear el sistema
- Muestra estado de suscripciones
- Prueba los 3 tipos de notificaciones

## 🚀 Uso

### Testear el Sistema

```bash
node test-notifications.js
```

Esto ejecutará:
1. Email de bienvenida a un usuario
2. Verificación de suscripciones próximas a expirar
3. Verificación de suscripciones expiradas

### Integrar en tu API

#### Enviar Email de Bienvenida
```javascript
const notificationService = require('./src/services/notification.service');

// Cuando se crea un usuario
await notificationService.sendWelcomeNotification(userId, {
  email: 'usuario@ejemplo.com',
  name: 'Juan Pérez'
});
```

#### Enviar Confirmación de Suscripción
```javascript
await notificationService.sendSubscriptionReceivedNotification({
  userEmail: 'usuario@ejemplo.com',
  userName: 'Juan Pérez',
  planName: 'Plan Premium',
  subscriptionId: 'sub_12345',
  userId: 'user_abc'
});
```

#### Verificar Suscripciones (Tarea Programada)
```javascript
const schedulerService = require('./src/services/scheduler.service');

// Ejecutar diariamente (con cron o similar)
await schedulerService.runScheduledTasks();
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Gmail SMTP
EMAIL_SERVICE=gmail
SMTP_USER=sophiausers@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
EMAIL_FROM=sophiausers@gmail.com

# Firebase
FIREBASE_PROJECT_ID=tu-proyecto-firebase

# Frontend URL (para links en emails)
FRONTEND_URL=http://172.105.21.15:3000
```

### Contraseña de Aplicación de Gmail

1. Ve a: https://myaccount.google.com/apppasswords
2. Crea una contraseña de aplicación llamada "user-subscription-manager"
3. Copia la contraseña y pégala en `SMTP_PASS`

## 📅 Automatización en Producción

### Opción 1: Cron Job (Linux/Mac)

```bash
# Editar crontab
crontab -e

# Ejecutar verificación diaria a las 9 AM
0 9 * * * cd /ruta/al/proyecto && node -e "require('./src/services/scheduler.service').runScheduledTasks()"
```

### Opción 2: Node-Cron (Dentro de la App)

```javascript
// En src/app.js
const cron = require('node-cron');
const schedulerService = require('./services/scheduler.service');

// Ejecutar diariamente a las 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('🕐 Ejecutando tareas programadas...');
  await schedulerService.runScheduledTasks();
});
```

### Opción 3: Endpoint Manual

```javascript
// En src/api/index.js
const schedulerService = require('../services/scheduler.service');

router.post('/admin/run-notifications', async (req, res) => {
  try {
    const results = await schedulerService.runScheduledTasks();
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 📊 Registro de Notificaciones

Todas las notificaciones se registran en Firestore:

**Colección: `notifications`**
```json
{
  "type": "PLAN_EXPIRING",
  "userId": "abc123",
  "email": "usuario@ejemplo.com",
  "subscriptionId": "sub_xyz",
  "daysRemaining": 7,
  "sentAt": "2025-11-09T10:30:00Z",
  "status": "sent"
}
```

**Colección: `subscriptions` (campo lastNotifications)**
```json
{
  "lastNotifications": {
    "expiring_7d": "2025-11-09T10:30:00Z",
    "expiring_5d": "2025-11-11T10:30:00Z",
    "expiring_3d": "2025-11-13T10:30:00Z",
    "expiring_1d": "2025-11-15T10:30:00Z"
  }
}
```

## 🎨 Plantillas de Email

Las plantillas son HTML responsive con:
- ✅ Diseño profesional
- ✅ Compatible con todos los clientes de email
- ✅ Colores diferenciados por tipo:
  - 🎉 Verde para bienvenida
  - ⚠️ Naranja para alertas de expiración
  - ✅ Verde para confirmaciones
  - 🔄 Azul para renovaciones

## ⚡ Límites de Gmail SMTP

- **500 emails/día** (suficiente para la mayoría de casos)
- Si necesitas más, considera SendGrid, Brevo, o Mailgun

## 🔧 Troubleshooting

### Error: "Missing credentials for PLAIN"
- Verifica que `SMTP_USER` y `SMTP_PASS` estén en `.env`
- Asegúrate de que la contraseña de aplicación es correcta

### Error: "Invalid login"
- Verifica que tienes verificación en 2 pasos activada en Gmail
- Genera una nueva contraseña de aplicación

### No se envían notificaciones
- Revisa que las suscripciones tengan el campo `endDate` correctamente
- Verifica que el status sea `active`
- Chequea que no se haya enviado ya hoy (campo `lastNotifications`)

## 📝 Notas Importantes

1. **No se envían emails duplicados**: El sistema verifica `lastNotifications` para cada día de alerta
2. **Zona horaria**: Las fechas se comparan en UTC
3. **Formato de fecha**: `endDate` puede ser Timestamp de Firestore o string ISO
4. **Testing**: Usa `test-notifications.js` para probar sin afectar producción

## 🎯 Próximos Pasos

Para usar en producción:

1. ✅ Configurar Gmail SMTP (ya hecho)
2. ✅ Testear con `node test-notifications.js`
3. ⏳ Programar tarea diaria (cron, node-cron, o endpoint)
4. ⏳ Integrar en controllers (crear usuario → email bienvenida)
5. ⏳ Monitorear colección `notifications` en Firestore

¡El sistema está listo para producción! 🚀

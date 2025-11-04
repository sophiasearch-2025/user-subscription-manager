# 📧 Sistema de Notificaciones por Email con Firebase

## 🎯 Descripción

Sistema de notificaciones automáticas por correo electrónico para gestionar suscripciones de usuarios, **100% GRATUITO usando Firebase y Gmail**.

### ✅ Notificaciones Implementadas:

1. **Solicitud de Suscripción Recibida** - Se envía automáticamente cuando un usuario crea una suscripción
2. **Plan Próximo a Vencer** - Se envía 7, 3 y 1 día antes del vencimiento
3. **Plan Renovado** - Se envía cuando un usuario renueva su plan

---

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con estas variables:

```env
# Firebase
FIREBASE_PROJECT_ID=tu-proyecto-firebase

# SMTP - Gmail (Gratis)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tucorreo@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion

# Frontend (para enlaces en emails)
FRONTEND_URL=https://tu-dominio.com

# Puerto de la aplicación
PORT=3000
```

### 2. Configurar Gmail para Nodemailer (GRATIS)

1. **Ve a tu cuenta de Google**: https://myaccount.google.com/
2. **Seguridad** → **Verificación en dos pasos** (actívala si no la tienes)
3. **Contraseñas de aplicaciones**: https://myaccount.google.com/apppasswords
4. Selecciona "Correo" y "Otro dispositivo"
5. Copia la contraseña generada (16 caracteres)
6. Úsala en `SMTP_PASS` en tu `.env`

### 3. Configurar Firebase (GRATIS)

1. **Crea un proyecto en Firebase**: https://console.firebase.google.com/
2. **Activa Firestore Database** (modo producción)
3. **Descarga las credenciales**:
   - Ve a "Configuración del proyecto" → "Cuentas de servicio"
   - Click en "Generar nueva clave privada"
   - Guarda el archivo como `serviceAccountKey.json` en la raíz del proyecto

### 4. Instalar Dependencias

```bash
npm install
```

---

## 📊 Estructura de Datos en Firestore

### Colección: `users`
```javascript
{
  id: "user123",
  name: "Juan Pérez",
  email: "juan@example.com",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Colección: `subscriptions`
```javascript
{
  id: "sub_123",
  userId: "user123",
  planName: "Plan Premium",
  status: "active", // active, expired, cancelled
  expirationDate: "2024-12-31T23:59:59.000Z",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastExpirationNotification: "2024-12-24T00:00:00.000Z" // última notificación enviada
}
```

### Colección: `notifications` (auditoría)
```javascript
{
  type: "SUBSCRIPTION_RECEIVED", // PLAN_EXPIRING, PLAN_RENEWED
  userId: "user123",
  email: "juan@example.com",
  subscriptionId: "sub_123",
  sentAt: "2024-01-01T00:00:00.000Z",
  status: "sent" // sent, failed
}
```

---

## 🔧 Uso de la API

### 1. Crear Suscripción (envía email automáticamente)

```bash
POST http://localhost:3000/api/subscriptions

{
  "userId": "user123",
  "planId": "plan_premium",
  "userEmail": "usuario@example.com",
  "userName": "Juan Pérez",
  "planName": "Plan Premium"
}
```

### 2. Renovar Suscripción (envía email automáticamente)

```bash
POST http://localhost:3000/api/subscriptions/:subscriptionId/renew

{
  "userEmail": "usuario@example.com",
  "userName": "Juan Pérez",
  "planName": "Plan Premium"
}
```

### 3. Ejecutar Verificación de Suscripciones Manualmente

```bash
POST http://localhost:3000/api/scheduler/run
```

Este endpoint:
- ✅ Verifica suscripciones que vencen en 7, 3 o 1 día
- ✅ Envía emails de notificación
- ✅ Marca suscripciones expiradas

---

## ⏰ Automatización GRATUITA con Cron Jobs Externos

Como Firebase Functions requiere plan Blaze (tarjeta de crédito), usaremos **servicios de cron job externos GRATUITOS**:

### Opción 1: cron-job.org (Recomendado - GRATIS)

1. **Regístrate en**: https://cron-job.org/
2. **Crea un nuevo cron job**:
   - **Título**: "Verificar suscripciones"
   - **URL**: `https://tu-dominio.com/api/scheduler/run`
   - **Método**: POST
   - **Horario**: Todos los días a las 9:00 AM
   - **Formato cron**: `0 9 * * *`

### Opción 2: EasyCron (GRATIS hasta 20 tareas)

1. **Regístrate en**: https://www.easycron.com/
2. Crea un cron job similar al anterior

### Opción 3: Render Cron Jobs (si despliegas en Render)

Si despliegas tu app en Render.com (gratis):
1. Ve a tu servicio en Render
2. Agrega un "Cron Job"
3. Configura para que ejecute diariamente

---

## 🧪 Probar el Sistema

### 1. Iniciar el servidor

```bash
npm run dev
```

### 2. Probar envío de email de suscripción

```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "planId": "premium",
    "userEmail": "tu-email@gmail.com",
    "userName": "Usuario Test",
    "planName": "Plan Premium"
  }'
```

### 3. Probar verificación de suscripciones

```bash
curl -X POST http://localhost:3000/api/scheduler/run
```

### 4. Ejecutar scheduler manualmente desde terminal

```bash
npm run scheduler
```

---

## 📝 Límites del Tier Gratuito

### Gmail / Nodemailer
- ✅ **500 emails por día** (más que suficiente)
- ✅ Sin costo

### Firebase Firestore
- ✅ **1 GB almacenamiento** gratis
- ✅ **50,000 lecturas por día** gratis
- ✅ **20,000 escrituras por día** gratis
- ✅ Sin tarjeta de crédito requerida

### Cron-Job.org
- ✅ **Ilimitados cron jobs** (plan gratuito)
- ✅ Ejecutar cada minuto si es necesario
- ✅ Sin tarjeta de crédito

---

## 🔍 Monitoreo y Logs

### Ver notificaciones enviadas en Firestore

```javascript
// En la consola de Firebase, ve a la colección "notifications"
// Verás todas las notificaciones enviadas con su estado
```

### Logs en la terminal

El sistema muestra logs detallados:
- ✅ Email enviado exitosamente
- ❌ Error al enviar email
- 🔍 Verificación de suscripciones iniciada
- ⏰ Notificación de expiración enviada

---

## 🎨 Personalizar Templates de Email

Los templates HTML están en:
- `src/services/email.service.js`

Puedes editar:
- Colores
- Textos
- Logos
- Estilos CSS

---

## 🐛 Solución de Problemas

### Error: "Invalid login credentials"
- Verifica que `SMTP_USER` y `SMTP_PASS` estén correctos
- Usa una "contraseña de aplicación" de Gmail, NO tu contraseña normal

### Error: "Firebase project not found"
- Verifica que `serviceAccountKey.json` esté en la raíz del proyecto
- Verifica que `FIREBASE_PROJECT_ID` sea correcto

### No se envían notificaciones de expiración
- Verifica que las suscripciones tengan `status: 'active'`
- Verifica que `expirationDate` esté en el futuro
- Ejecuta manualmente: `npm run scheduler`

---

## 📞 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/scheduler/run` | Ejecuta todas las tareas programadas |
| POST | `/api/scheduler/check-expiring` | Solo verifica suscripciones por vencer |
| POST | `/api/scheduler/check-expired` | Solo marca suscripciones expiradas |
| GET | `/api/scheduler/status` | Estado del servicio de scheduler |
| GET | `/api/health` | Estado de la API |

---

## 🎉 ¡Todo Listo!

Ahora tienes un sistema completo de notificaciones por email **100% GRATUITO** sin necesidad de tarjeta de crédito ni servicios complejos como RabbitMQ.

**Ventajas de esta solución:**
- ✅ Sin costos
- ✅ Fácil de configurar
- ✅ Escalable (hasta 500 emails/día)
- ✅ Sin infraestructura compleja
- ✅ Auditoría en Firestore
- ✅ Templates HTML profesionales

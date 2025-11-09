# 📡 API Endpoints - User Subscription Manager

**Base URL:** `http://172.105.21.15:3000`  
**Ambiente local:** `http://localhost:3000`

---

## 🏥 Health & Status

### GET `/health`
Verifica el estado del servidor.

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T20:00:00.000Z",
  "service": "user-subscription-system"
}
```

---

### GET `/`
Información general de la API.

**Respuesta:**
```json
{
  "message": "User Subscription System API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "subscriptions": "/api/subscriptions"
  }
}
```

---

## 📋 Suscripciones

### POST `/api/subscriptions`
Crear una nueva suscripción.

**Body:**
```json
{
  "userId": "user123",
  "planId": "premium",
  "planName": "Plan Premium",
  "startDate": "2025-11-09",
  "endDate": "2025-12-09",
  "price": 9999,
  "status": "active"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Suscripción creada exitosamente",
  "data": {
    "id": "sub_abc123",
    "userId": "user123",
    "planId": "premium",
    "status": "active",
    "createdAt": "2025-11-09T20:00:00.000Z"
  }
}
```

---

### GET `/api/subscriptions`
Obtener todas las suscripciones.

**Query params (opcionales):**
- `status` - Filtrar por estado: `active`, `expired`, `cancelled`
- `userId` - Filtrar por ID de usuario

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub_abc123",
      "userId": "user123",
      "planId": "premium",
      "planName": "Plan Premium",
      "status": "active",
      "startDate": "2025-11-09T00:00:00.000Z",
      "endDate": "2025-12-09T00:00:00.000Z",
      "price": 9999
    }
  ],
  "count": 1
}
```

---

### GET `/api/subscriptions/:id`
Obtener una suscripción específica por ID.

**Parámetros:**
- `id` - ID de la suscripción

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "sub_abc123",
    "userId": "user123",
    "planId": "premium",
    "status": "active",
    "startDate": "2025-11-09T00:00:00.000Z",
    "endDate": "2025-12-09T00:00:00.000Z"
  }
}
```

---

### POST `/api/subscriptions/:id/renew`
Renovar una suscripción existente.

**Parámetros:**
- `id` - ID de la suscripción

**Body:**
```json
{
  "duration": 30
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Suscripción renovada exitosamente",
  "data": {
    "id": "sub_abc123",
    "newEndDate": "2026-01-09T00:00:00.000Z",
    "status": "active"
  }
}
```

---

### DELETE `/api/subscriptions/:id`
Cancelar una suscripción.

**Parámetros:**
- `id` - ID de la suscripción

**Respuesta:**
```json
{
  "success": true,
  "message": "Suscripción cancelada exitosamente",
  "data": {
    "id": "sub_abc123",
    "status": "cancelled"
  }
}
```

---

### POST `/api/subscriptions/check-expiring`
Verificar suscripciones próximas a vencer (usado internamente).

**Respuesta:**
```json
{
  "success": true,
  "checked": 10,
  "notificationsSent": 2
}
```

---

## 🔔 Notificaciones & Scheduler

### POST `/api/admin/run-notifications`
Ejecutar manualmente la verificación de notificaciones.

**Respuesta:**
```json
{
  "success": true,
  "message": "Verificación de notificaciones ejecutada",
  "results": {
    "timestamp": "2025-11-09T20:00:00.000Z",
    "tasks": {
      "expiringCheck": {
        "checked": 10,
        "notificationsSent": 2
      },
      "expiredCount": 0
    }
  }
}
```

---

## 📊 Resumen de Endpoints

| Método | Endpoint | Descripción | Uso |
|--------|----------|-------------|-----|
| **GET** | `/health` | Health check | Monitoreo |
| **GET** | `/` | Info de la API | Documentación |
| **POST** | `/api/subscriptions` | Crear suscripción | Otros sistemas |
| **GET** | `/api/subscriptions` | Listar suscripciones | Otros sistemas |
| **GET** | `/api/subscriptions/:id` | Obtener suscripción | Otros sistemas |
| **POST** | `/api/subscriptions/:id/renew` | Renovar suscripción | Otros sistemas |
| **DELETE** | `/api/subscriptions/:id` | Cancelar suscripción | Otros sistemas |
| **POST** | `/api/subscriptions/check-expiring` | Verificar expiración | Interno/Cron |
| **POST** | `/api/admin/run-notifications` | Ejecutar notificaciones | Admin/Cron |

---

## 🚀 Ejemplos de Uso

### Crear una suscripción desde otro sistema

```bash
curl -X POST http://172.105.21.15:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "planId": "premium",
    "planName": "Plan Premium",
    "startDate": "2025-11-09",
    "endDate": "2025-12-09",
    "price": 9999,
    "status": "active"
  }'
```

### Obtener todas las suscripciones

```bash
curl http://172.105.21.15:3000/api/subscriptions
```

### Obtener suscripciones activas de un usuario

```bash
curl "http://172.105.21.15:3000/api/subscriptions?userId=user123&status=active"
```

### Renovar una suscripción

```bash
curl -X POST http://172.105.21.15:3000/api/subscriptions/sub_abc123/renew \
  -H "Content-Type: application/json" \
  -d '{"duration": 30}'
```

### Cancelar una suscripción

```bash
curl -X DELETE http://172.105.21.15:3000/api/subscriptions/sub_abc123
```

---

## 🔐 Seguridad

- ✅ **CORS habilitado** - Permite requests desde cualquier origen
- ✅ **Rate limiting** - Máximo 100 requests por IP cada 15 minutos en `/api/*`
- ✅ **Helmet.js** - Headers de seguridad configurados
- ⚠️ **Sin autenticación** - Actualmente no requiere tokens (auth no implementado)

---

## 📧 Sistema de Notificaciones Automáticas

El sistema envía emails automáticamente:

### Alertas de Expiración
- **7 días antes** del vencimiento
- **5 días antes** del vencimiento
- **3 días antes** del vencimiento
- **1 día antes** del vencimiento

### Funcionamiento
- Se ejecuta **automáticamente cada día a las 9:00 AM** (zona horaria: America/Santiago)
- También se puede ejecutar manualmente: `POST /api/admin/run-notifications`
- Los emails se envían vía Gmail SMTP

---

## ❌ Errores Comunes

### 404 Not Found
```json
{
  "success": false,
  "message": "Endpoint no encontrado"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error interno del servidor"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Demasiadas peticiones. Intenta de nuevo más tarde."
}
```

---

## 📝 Notas para Otros Sistemas

1. **Base URL:** Usa `http://172.105.21.15:3000` en producción
2. **Content-Type:** Siempre envía `Content-Type: application/json` en POST/PUT
3. **IDs:** Los IDs de suscripciones se generan automáticamente por Firestore
4. **Fechas:** Usa formato ISO 8601: `YYYY-MM-DD` o `YYYY-MM-DDTHH:mm:ss.sssZ`
5. **Status:** Valores válidos: `active`, `expired`, `cancelled`, `pending`

---

## 🔄 Integración Recomendada

Para integrar con otros sistemas:

1. **Crear suscripción** cuando un usuario compra
2. **Consultar estado** periódicamente si es necesario
3. **Renovar** cuando el usuario renueva su plan
4. **Cancelar** cuando el usuario cancela

El sistema se encarga automáticamente de:
- ✅ Enviar notificaciones de expiración
- ✅ Marcar suscripciones como expiradas
- ✅ Registrar todo en Firestore

---

**Última actualización:** 9 de noviembre de 2025  
**Versión API:** 1.0.0

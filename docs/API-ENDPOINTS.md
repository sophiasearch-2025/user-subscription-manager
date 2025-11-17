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

## 👤 Usuarios

### GET `/api/users`
Obtener todos los usuarios.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "uid": "user123",
      "email": "usuario@ejemplo.com",
      "name": "Usuario Ejemplo",
      "company": "Empresa S.A.",
      "createdAt": "2025-11-09T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### GET `/api/users/:uid`
Obtener un usuario específico por UID.

**Parámetros:**
- `uid` - ID único del usuario

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "uid": "user123",
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo",
    "company": "Empresa S.A.",
    "createdAt": "2025-11-09T00:00:00.000Z"
  }
}
```

---

### POST `/api/users`
Crear un nuevo usuario.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "name": "Usuario Ejemplo",
  "company": "Empresa S.A."
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "uid": "user123",
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo",
    "company": "Empresa S.A."
  }
}
```

---

### PUT `/api/users/:uid`
Actualizar un usuario existente.

**Parámetros:**
- `uid` - ID único del usuario

**Body:**
```json
{
  "name": "Nombre Actualizado",
  "company": "Nueva Empresa"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "uid": "user123",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Actualizado",
    "company": "Nueva Empresa"
  }
}
```

---

### DELETE `/api/users/:uid`
Eliminar un usuario.

**Parámetros:**
- `uid` - ID único del usuario

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

---

## 📋 Suscripciones

### POST `/api/subscriptions`
Crear una nueva suscripción.

**Body (campos requeridos):**
```json
{
  "userId": "user123",
  "planId": "plan_premium",
  "userEmail": "usuario@ejemplo.com"
}
```

**Body (campos opcionales):**
```json
{
  "userName": "Usuario Ejemplo",
  "planName": "Plan Premium",
  "precio": 99.99
}
```

**Body completo (ejemplo):**
```json
{
  "userId": "user123",
  "planId": "plan_premium",
  "userEmail": "usuario@ejemplo.com",
  "userName": "Juan Pérez",
  "planName": "Plan Premium",
  "precio": 99.99
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Suscripción creada exitosamente. Notificación enviada por email.",
  "data": {
    "subscriptionId": "abc123xyz",
    "userId": "user123",
    "planId": "plan_premium",
    "status": "active",
    "userEmail": "usuario@ejemplo.com",
    "currentPeriodEnd": "2025-12-17T12:00:00.000Z",
    "notificationSent": true
  }
}
```

**Funcionalidad automática:**
- ✅ Guarda la suscripción en Firebase
- ✅ Envía email de confirmación al usuario
- ✅ Registra la notificación en Firebase (auditoría)
- ✅ Establece período de 30 días por defecto

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

### PATCH `/api/subscriptions/:id` ⭐ **NUEVO**
Actualizar cualquier campo de una suscripción (especialmente el status).

**Parámetros:**
- `id` - ID de la suscripción

**Body (campos opcionales):**
```json
{
  "status": "active",
  "precio": 129.99,
  "plan": "Plan Premium Plus",
  "descripcion": "Actualización de plan",
  "currentPeriodEnd": "2026-01-17T00:00:00.000Z",
  "cancelAtPeriodEnd": false,
  "metadata": {
    "customField": "valor"
  }
}
```

**Campos actualizables:**
- `status` - Estado: `active`, `paused`, `cancelled`, `expired`, `pending`
- `precio` - Precio de la suscripción
- `plan` - Nombre del plan
- `descripcion` - Descripción
- `currentPeriodEnd` - Fecha de vencimiento (ISO 8601)
- `cancelAtPeriodEnd` - Cancelar al final del período
- `metadata` - Metadatos adicionales

**Campos protegidos (se ignoran):**
- `id`, `createdAt`, `userId`

**Respuesta:**
```json
{
  "success": true,
  "message": "Suscripción actualizada exitosamente",
  "data": {
    "id": "sub_abc123",
    "userId": "user123",
    "status": "active",
    "precio": 129.99,
    "plan": "Plan Premium Plus",
    "updatedAt": "2025-11-17T16:00:00.000Z"
  }
}
```

**Nota:** Si el status cambia a `active`, se envía automáticamente un email de renovación al usuario.

---

### POST `/api/subscriptions/:id/renew` ⚠️ **DEPRECADO**
Renovar una suscripción existente.

> **Recomendación:** Usar `PATCH /api/subscriptions/:id` con `{"status": "active"}` en su lugar.

**Parámetros:**
- `id` - ID de la suscripción

**Body:**
```json
{
  "userEmail": "usuario@ejemplo.com",
  "userName": "Usuario",
  "planName": "Plan Premium"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Suscripción renovada y notificación enviada",
  "data": {
    "newExpirationDate": "2026-01-09T00:00:00.000Z"
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
| **GET** | `/api/users` | Listar usuarios | Otros sistemas |
| **GET** | `/api/users/:uid` | Obtener usuario | Otros sistemas |
| **POST** | `/api/users` | Crear usuario | Otros sistemas |
| **PUT** | `/api/users/:uid` | Actualizar usuario | Otros sistemas |
| **DELETE** | `/api/users/:uid` | Eliminar usuario | Otros sistemas |
| **POST** | `/api/subscriptions` | Crear suscripción | Otros sistemas |
| **GET** | `/api/subscriptions` | Listar suscripciones | Otros sistemas |
| **GET** | `/api/subscriptions/:id` | Obtener suscripción | Otros sistemas |
| **PATCH** | `/api/subscriptions/:id` | **Actualizar suscripción** ⭐ | **Otros sistemas** |
| **POST** | `/api/subscriptions/:id/renew` | Renovar suscripción ⚠️ | Deprecado |
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
    "planId": "plan_premium",
    "userEmail": "usuario@ejemplo.com",
    "userName": "Juan Pérez",
    "planName": "Plan Premium",
    "precio": 99.99
  }'
```

### Actualizar status de una suscripción (NUEVO) ⭐

```bash
# Activar/Renovar
curl -X PATCH http://172.105.21.15:3000/api/subscriptions/abc123 \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'

# Pausar
curl -X PATCH http://172.105.21.15:3000/api/subscriptions/abc123 \
  -H "Content-Type: application/json" \
  -d '{"status": "paused"}'

# Cancelar
curl -X PATCH http://172.105.21.15:3000/api/subscriptions/abc123 \
  -H "Content-Type: application/json" \
  -d '{"status": "cancelled"}'
```

### Actualizar múltiples campos

```bash
curl -X PATCH http://172.105.21.15:3000/api/subscriptions/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "precio": 129.99,
    "plan": "Plan Premium Plus",
    "descripcion": "Plan actualizado"
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

**Método recomendado (PATCH):**
```bash
curl -X PATCH http://172.105.21.15:3000/api/subscriptions/abc123 \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'
```

**Método antiguo (deprecado):**
```bash
curl -X POST http://172.105.21.15:3000/api/subscriptions/abc123/renew \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "usuario@ejemplo.com",
    "userName": "Usuario",
    "planName": "Plan Premium"
  }'
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
2. **Content-Type:** Siempre envía `Content-Type: application/json` en POST/PATCH
3. **IDs:** Los IDs de suscripciones se generan automáticamente por Firestore
4. **Fechas:** Usa formato ISO 8601: `YYYY-MM-DD` o `YYYY-MM-DDTHH:mm:ss.sssZ`
5. **Status:** Valores válidos: `active`, `paused`, `cancelled`, `expired`, `pending`
6. **PATCH vs POST:** Usa `PATCH /api/subscriptions/:id` en lugar de `POST /:id/renew` para actualizar

---

## 🔄 Integración Recomendada

Para integrar con otros sistemas:

1. **Crear suscripción** cuando un usuario compra
   - `POST /api/subscriptions` con `userId`, `planId`, `userEmail`
   - El sistema envía email automáticamente

2. **Actualizar status** cuando cambia el estado
   - `PATCH /api/subscriptions/:id` con `{"status": "active"}` para renovar
   - `PATCH /api/subscriptions/:id` con `{"status": "paused"}` para pausar
   - `PATCH /api/subscriptions/:id` con `{"status": "cancelled"}` para cancelar

3. **Consultar estado** periódicamente si es necesario
   - `GET /api/subscriptions/:id` para una específica
   - `GET /api/subscriptions?userId=xxx` para un usuario

4. **Cancelar** cuando el usuario cancela
   - `DELETE /api/subscriptions/:id` o `PATCH` con `status: "cancelled"`

El sistema se encarga automáticamente de:
- ✅ Enviar notificaciones de expiración (7, 3, 1 día antes)
- ✅ Enviar email al crear suscripción
- ✅ Enviar email al cambiar status a `active` (renovación)
- ✅ Marcar suscripciones como expiradas
- ✅ Registrar todo en Firestore

---

**Última actualización:** 17 de noviembre de 2025  
**Versión API:** 1.0.0

**Cambios recientes:**
- ✨ Agregado `PATCH /api/subscriptions/:id` para actualizar cualquier campo
- ✨ Envío automático de email al crear suscripción
- ✨ Envío automático de email al cambiar status a `active`
- ⚠️ `POST /:id/renew` marcado como deprecado (usar PATCH)

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
Crear un nuevo usuario con comprobante de pago (solicitud pendiente).

**Content-Type:** `multipart/form-data`

**Campos del formulario (requeridos):**
- `email` (string) - Email del usuario (único)
- `username` (string) - Nombre de usuario (único)
- `password` (string) - Contraseña (mínimo 6 caracteres)
- `comprobante` (file) - Foto del comprobante de pago (JPG, PNG, WEBP, max 5MB)

**Campos del formulario (opcionales):**
- `name` (string) - Nombre completo
- `company` (string) - Empresa

**Validaciones:**
- ✅ `email` es requerido y único
- ✅ `username` es requerido y único
- ✅ `password` es requerida (mínimo 6 caracteres)
- ✅ `comprobante` es requerido (imagen JPG/PNG/WEBP, máximo 5MB)
- ✅ La contraseña se hashea con bcrypt antes de guardar
- ✅ El comprobante se convierte a binario (base64) y se sube a Firebase Storage

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Usuario registrado con comprobante. Solicitud pendiente de aprobación.",
  "data": {
    "uid": "user_1732454123_abc123",
    "email": "usuario@ejemplo.com",
    "username": "usuario123",
    "name": "Usuario Ejemplo",
    "company": "Empresa S.A.",
    "comprobanteUrl": "https://storage.googleapis.com/.../comprobantes/...",
    "solicitudAprobada": false
  }
}
```

**Errores comunes:**
```json
// Sin comprobante
{
  "success": false,
  "message": "El comprobante de pago es requerido"
}

// Formato inválido
{
  "success": false,
  "message": "Solo se permiten imágenes (JPG, PNG, WEBP)"
}

// Username duplicado
{
  "success": false,
  "message": "El username ya está en uso"
}
```

**Notas importantes:**
- 📸 El comprobante se guarda en Firebase Storage como binario (base64)
- 🔒 La contraseña NO se devuelve en la respuesta por seguridad
- ⏳ El usuario se crea con `solicitudAprobada: false`
- ✉️ Un administrador debe aprobar la solicitud para que el usuario reciba el email de bienvenida
- 👀 El admin puede ver el comprobante en la URL proporcionada para validarlo

---

### GET `/api/users/pending`
Obtener usuarios con solicitudes pendientes (Admin).

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "uid": "user_123",
      "email": "pendiente@ejemplo.com",
      "username": "usuario_pendiente",
      "name": "Usuario Pendiente",
      "company": "Empresa ABC",
      "comprobanteUrl": "https://storage.googleapis.com/.../comprobantes/...",
      "solicitudAprobada": false,
      "createdAt": "2025-11-24T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Nota:** 
- El comprobante NO se devuelve en la lista (es binario/base64, muy grande)
- Se incluye `comprobanteInfo` con metadata del archivo
- Para ver el comprobante, usar: `GET /api/users/:uid/comprobante`

---

### GET `/api/users/:uid/comprobante`
Ver el comprobante de pago de un usuario (Admin).

**Parámetros:**
- `uid` - ID único del usuario

**Respuesta:**
- Devuelve la imagen directamente (JPG/PNG/WEBP)
- Se puede abrir en el navegador o descargar

**Ejemplo:**
```bash
# Ver en navegador
http://172.105.21.15:3000/api/users/user_123/comprobante

# Descargar con curl
curl http://172.105.21.15:3000/api/users/user_123/comprobante -o comprobante.png
```

---

### PATCH `/api/users/:uid/approve` ⭐
Aprobar solicitud de usuario y enviar email de bienvenida (Admin).

**Parámetros:**
- `uid` - ID único del usuario

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario aprobado exitosamente. Email de bienvenida enviado.",
  "data": {
    "uid": "user_123",
    "email": "usuario@ejemplo.com",
    "solicitudAprobada": true,
    "emailSent": true
  }
}
```

**Funcionalidad automática:**
- ✅ Cambia `solicitudAprobada` a `true`
- ✅ Cambia `estado` a `active`
- ✅ **Envía email de bienvenida al usuario**
- ✅ Registra la notificación en Firebase

---

### PATCH `/api/users/:uid/reject`
Rechazar solicitud de usuario (Admin).

**Parámetros:**
- `uid` - ID único del usuario

**Body (opcional):**
```json
{
  "motivo": "Comprobante inválido"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Solicitud rechazada",
  "data": {
    "uid": "user_123",
    "estado": "rejected"
  }
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
| **GET** | `/api/users` | Listar usuarios | Admin |
| **GET** | `/api/users/:uid` | Obtener usuario | Admin |
| **POST** | `/api/users` | **Crear usuario + Comprobante** 📸 | **Frontend** |
| **GET** | `/api/users/pending` | Listar solicitudes pendientes | Admin |
| **GET** | `/api/users/:uid/comprobante` | **Ver comprobante (imagen)** 🖼️ | **Admin** |
| **PATCH** | `/api/users/:uid/approve` | **Aprobar usuario + Email** ⭐ | **Admin** |
| **PATCH** | `/api/users/:uid/reject` | Rechazar solicitud | Admin |
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

### Registrar un nuevo usuario con comprobante (solicitud pendiente)

```bash
# Con cURL
curl -X POST http://172.105.21.15:3000/api/users \
  -F "email=nuevo@ejemplo.com" \
  -F "username=nuevo_usuario" \
  -F "password=micontraseña123" \
  -F "name=Usuario Nuevo" \
  -F "company=Mi Empresa" \
  -F "comprobante=@/ruta/a/tu/comprobante.jpg"
```

**Ejemplo con JavaScript (Frontend):**
```javascript
const formData = new FormData();
formData.append('email', 'nuevo@ejemplo.com');
formData.append('username', 'nuevo_usuario');
formData.append('password', 'micontraseña123');
formData.append('name', 'Usuario Nuevo');
formData.append('company', 'Mi Empresa');
formData.append('comprobante', fileInput.files[0]); // File del input

const response = await fetch('http://172.105.21.15:3000/api/users', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data);
```

**Ejemplo con React:**
```javascript
const [file, setFile] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('email', email);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('name', name);
  formData.append('company', company);
  formData.append('comprobante', file);

  const response = await fetch('http://172.105.21.15:3000/api/users', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (data.success) {
    alert('Usuario registrado! Pendiente de aprobación.');
  }
};
```

### Ver solicitudes pendientes (Admin)

```bash
curl http://172.105.21.15:3000/api/users/pending
```

### Aprobar usuario y enviar email (Admin) ⭐

```bash
# Esto aprueba al usuario Y envía el email de bienvenida automáticamente
curl -X PATCH http://172.105.21.15:3000/api/users/user_123/approve
```

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
- ✅ **Contraseñas hasheadas** - Bcrypt con 10 salt rounds
- ✅ **Contraseñas no expuestas** - No se devuelven en ninguna respuesta
- ⚠️ **Sin autenticación** - Actualmente no requiere tokens (auth no implementado)

---

## 📸 Manejo de Comprobantes de Pago

### Proceso de Subida

1. **Frontend envía imagen** como `multipart/form-data`
2. **Backend recibe archivo** en memoria (buffer)
3. **Conversión a binario (base64):**
   - Buffer → Base64 string
   - Se guarda directamente en Firestore
4. **Metadata guardada:**
   - `comprobanteBase64`: imagen en formato base64
   - `comprobanteInfo`: { filename, mimetype, size, uploadedAt }
5. **Visualización:**
   - El admin accede a `GET /api/users/:uid/comprobante`
   - El backend convierte base64 → imagen
   - Se muestra la imagen directamente

### Formatos Aceptados
- ✅ JPG / JPEG
- ✅ PNG
- ✅ WEBP
- ❌ Tamaño máximo: 5MB

### Almacenamiento

**Firestore (campos en usuario):**
```json
{
  "uid": "user_123",
  "email": "usuario@ejemplo.com",
  "username": "usuario123",
  "comprobanteBase64": "iVBORw0KGgoAAAANSUh...", // Binario
  "comprobanteInfo": {
    "filename": "comprobante.jpg",
    "mimetype": "image/jpeg",
    "size": 245678,
    "uploadedAt": "2025-11-24T10:00:00.000Z"
  },
  "solicitudAprobada": false
}
```

### Validación por Admin

1. Admin obtiene usuarios pendientes: `GET /api/users/pending`
2. Admin ve `comprobanteInfo` con metadata del archivo
3. Admin abre: `GET /api/users/:uid/comprobante` en navegador
4. El navegador muestra la imagen directamente
5. Admin valida que el comprobante sea legítimo
6. Admin aprueba o rechaza según la validación

### Seguridad del Comprobante

- 🔒 Comprobante guardado como base64 en Firestore
- 📄 Metadata separada del binario
- 🚫 El base64 NO se devuelve en listados (muy grande)
- 👀 Solo accesible vía endpoint específico
- 🔮 En producción: agregar autenticación para endpoint de comprobante
- 🗑️ Futura funcionalidad: eliminar comprobantes rechazados

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

### Generales
1. **Base URL:** Usa `http://172.105.21.15:3000` en producción
2. **Content-Type:** 
   - `application/json` para suscripciones y aprobaciones
   - `multipart/form-data` para registro de usuarios (con comprobante)
3. **IDs:** Los IDs se generan automáticamente
4. **Fechas:** Usa formato ISO 8601: `YYYY-MM-DD` o `YYYY-MM-DDTHH:mm:ss.sssZ`

### Usuarios
1. **Registro requiere comprobante:** El frontend debe enviar una imagen del comprobante
2. **Campos únicos:** `email` y `username` deben ser únicos
3. **Contraseña:** Mínimo 6 caracteres, se hashea automáticamente
4. **Comprobante:** JPG/PNG/WEBP, máximo 5MB, se convierte a binario
5. **Aprobación manual:** El admin debe aprobar antes de que el usuario reciba email

### Suscripciones
1. **Status válidos:** `active`, `paused`, `cancelled`, `expired`, `pending`
2. **PATCH vs POST:** Usa `PATCH /api/subscriptions/:id` en lugar de `POST /:id/renew`
3. **Emails automáticos:** Se envían al crear y al cambiar status a `active`

---

## 🔄 Integración Recomendada

### Flujo de Usuario Nuevo

1. **Usuario se registra** en el frontend con comprobante
   - `POST /api/users` (multipart/form-data)
   - Campos: `email`, `username`, `password`, `comprobante` (imagen)
   - Opcional: `name`, `company`
   - El comprobante se convierte a binario (base64) y se sube a Firebase Storage
   - El usuario se crea con `solicitudAprobada: false`
   - NO se envía email todavía

2. **Admin revisa solicitudes**
   - `GET /api/users/pending` para ver solicitudes pendientes
   - Admin ve los datos del usuario
   - Admin hace clic en `comprobanteUrl` para ver la foto del comprobante
   - Admin valida que el comprobante sea válido

3. **Admin aprueba o rechaza**
   - **Aprobar:** `PATCH /api/users/:uid/approve`
     - Cambia `solicitudAprobada` a `true`
     - **✉️ Se envía email de bienvenida automáticamente**
   - **Rechazar:** `PATCH /api/users/:uid/reject` (con motivo opcional)
     - Cambia `estado` a `rejected`

### Flujo de Suscripciones

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

### Automatizaciones del Sistema

El sistema se encarga automáticamente de:
- ✅ Enviar email de bienvenida al aprobar usuario
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

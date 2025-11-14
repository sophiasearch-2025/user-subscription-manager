# Documentación de Base de Datos – Firestore  
Subsistema: **user-subscription-manager**  
Proyecto: **SophiaSearch-2025**

Este documento describe la estructura, colecciones y relaciones del modelo de datos implementado en **Firestore** para la gestión de usuarios, planes, suscripciones, pagos y notificaciones dentro del sistema.

---

## 1. Descripción general

La base de datos está organizada mediante **colecciones** y **documentos** que representan los elementos principales del subsistema:

- **users** → Información general de cada usuario  
- **subscriptions** → Suscripciones activas o inactivas por usuario  
- **plans** → Planes disponibles en la plataforma  
- **payments** → Historial de pagos por usuario  
- **notifications** → Registro de correos/notificaciones enviadas

El modelo está diseñado para funcionar con servicios externos como **Stripe** para pagos recurrentes y con sistemas de notificación mediante SMTP.

---

## 2. Colecciones implementadas

A continuación se describe cada colección junto con sus campos.


## 2.1 Colección: `users`

Información principal del usuario dentro de la plataforma.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `uid` | string | Identificador único del usuario (Firebase Auth). |
| `email` | string | Correo electrónico del usuario. |
| `name` | string | Nombre completo del usuario. |
| `company` | string / null | Empresa o institución (si aplica). |
| `role` | string | Rol asignado (admin, editor, lector, etc.). |
| `estado` | string | Estado de la cuenta (activo / suspendido). |
| `stripeCustomerId` | string | ID del cliente en Stripe. |
| `photoURL` | string | Foto o avatar del usuario. |
| `createdAt` | timestamp | Fecha de creación. |
| `updatedAt` | timestamp | Fecha de última actualización. |

---

## 2.2 Colección: `subscriptions`

Representa una suscripción de un usuario a un plan.

| Campo | Tipo | Descripción |
|--------|-------|-------------|
| `userId` | string | UID del usuario. |
| `planId` | string | Identificador del plan suscrito. |
| `status` | string | Estado (active, canceled, expired). |
| `startDate` | timestamp | Fecha de inicio. |
| `expiresAt` | timestamp | Fecha de expiración. |
| `stripeSubscriptionId` | string | ID de la suscripción en Stripe. |
| `createdAt` | timestamp | Fecha de creación. |
| `updatedAt` | timestamp | Última modificación. |

---

## 2.3 Colección: `plans`

Define los planes disponibles en la plataforma.

| Campo | Tipo | Descripción |
|--------|--------|-------------|
| `name` | string | Nombre del plan. |
| `description` | string | Descripción detallada. |
| `price` | number | Costo del plan. |
| `interval` | string | Frecuencia: monthly o yearly. |
| `features` | array | Lista de funcionalidades incluidas. |
| `isActive` | boolean | Determina si el plan está disponible. |

---

## 2.4 Colección: `payments`

Registro de todos los pagos hechos por los usuarios.

| Campo | Tipo | Descripción |
|--------|--------|-------------|
| `userId` | string | Identificador del usuario que pagó. |
| `subscriptionId` | string | Suscripción asociada al pago. |
| `amount` | number | Monto pagado. |
| `currency` | string | Moneda usada (ej. USD). |
| `status` | string | success / failed. |
| `stripeChargeId` | string | ID del cargo realizado en Stripe. |
| `description` | string | Información adicional del pago. |
| `createdAt` | timestamp | Fecha de registro. |
| `updatedAt` | timestamp | Última actualización. |

---

## 2.5 Colección: `notifications`

Historial de notificaciones enviadas.

| Campo | Tipo | Descripción |
|--------|--------|-------------|
| `userId` | string | Usuario destinatario. |
| `type` | string | Tipo de mensaje (bienvenida, pago, expiración, etc.). |
| `status` | string | Estado: sent / failed. |
| `recipient` | string | Correo al que se envió. |
| `subject` | string | Asunto del correo. |
| `sentAt` | timestamp | Fecha de envío. |
| `failedAt` | timestamp / null | Fecha de fallo (si aplica). |
| `error` | string / null | Error devuelto por el proveedor de correo. |

---

## 3. Relaciones entre colecciones

```
users (1)───┬───(N) subscriptions
            │
            ├───(N) payments
            │
            └───(N) notifications

plans (1)───┬───(N) subscriptions
```

### Explicación:
- Un usuario puede tener **0 o muchas suscripciones**.  
- Una suscripción pertenece a **un solo plan**.  
- Un usuario puede tener **muchos pagos**, cada uno asociado a una suscripción.  
- Las notificaciones se registran por usuario.

---

## 4. Consideraciones y reglas

- Todos los timestamps deben registrarse en **UTC**.  
- No se elimina información:  
  - **Se desactiva**, no se borra (por cumplimiento de auditoría).  
- Stripe es la **fuente de verdad** para pagos:  
  - Firestore replica el estado actual.  
- Los `role` deben ser validados desde el backend para evitar escalamiento de privilegios.  
- Las suscripciones deben sincronizarse con Stripe mediante webhooks.

---

## 5. Ejemplos de documentos

### Ejemplo de usuario (`users`)
```json
{
  "uid": "Yf2Xg7L9",
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "role": "lector",
  "estado": "activo",
  "stripeCustomerId": "cus_32jf92ks",
  "photoURL": "https://avatar.com/user1.png",
  "createdAt": "2025-11-12T18:00:00Z"
}
```

### Ejemplo de suscripción (`subscriptions`)
```json
{
  "userId": "Yf2Xg7L9",
  "planId": "plan_basic",
  "status": "active",
  "startDate": "2025-11-12T18:05:00Z",
  "expiresAt": "2025-12-12T18:05:00Z",
  "stripeSubscriptionId": "sub_JD39ds728"
}
```

---

## 6. Pendientes / Futuras mejoras

- Normalización de `company` como subcolección.  
- Historial de cambios de roles.  
- Colección `auditLogs` para auditoría avanzada.  
- Indexación avanzada para consultas rápidas por usuario y período.  

---

> Esta documentación debe actualizarse con cada cambio en la estructura de la base de datos o al implementar nuevas integraciones (Stripe, SMTP, etc.).

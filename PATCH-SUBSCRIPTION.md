# Actualizar Suscripción con PATCH

## Endpoint

```
PATCH http://172.105.21.15:3000/api/subscriptions/:id
```

## Descripción

Permite actualizar cualquier campo de una suscripción, especialmente útil para cambiar el `status`.

---

## Casos de Uso

### 1. Cambiar Status de Suscripción

#### Activar/Renovar Suscripción
```bash
curl -X PATCH http://172.105.21.15:3000/api/subscriptions/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Suscripción actualizada exitosamente",
  "data": {
    "id": "abc123",
    "status": "active",
    "updatedAt": "2025-11-17T16:00:00.000Z"
  }
}
```

**Nota:** Si el status cambia a `active`, automáticamente se envía un email de renovación al usuario.

---

#### Pausar Suscripción
```bash
curl -X PATCH http://172.105.21.15:3000/api/subscriptions/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paused"
  }'
```

---

#### Cancelar Suscripción
```bash
curl -X PATCH http://172.105.21.15:3000/api/subscriptions/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "cancelled"
  }'
```

---

### 2. Actualizar Múltiples Campos

```bash
curl -X PATCH http://172.105.21.15:3000/api/subscriptions/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "precio": 129.99,
    "plan": "Plan Premium Plus"
  }'
```

---

### 3. Extender Fecha de Vencimiento

```bash
curl -X PATCH http://172.105.21.15:3000/api/subscriptions/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "currentPeriodEnd": "2026-01-17T00:00:00.000Z"
  }'
```

---

## Campos Actualizables

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `status` | string | Estado: `active`, `paused`, `cancelled`, `expired` |
| `precio` | number | Precio de la suscripción |
| `plan` | string | Nombre del plan |
| `descripcion` | string | Descripción de la suscripción |
| `currentPeriodEnd` | string (ISO date) | Fecha de vencimiento |
| `cancelAtPeriodEnd` | boolean | Cancelar al final del período |
| `metadata` | object | Metadatos adicionales |

**Campos protegidos** (no se pueden actualizar):
- `id` - Se ignora automáticamente
- `createdAt` - Se ignora automáticamente
- `userId` - Para cambiar el usuario, crear nueva suscripción

---

## Ejemplos de Integración Frontend

### JavaScript/Fetch

```javascript
async function actualizarSuscripcion(subscriptionId, cambios) {
  const response = await fetch(
    `http://172.105.21.15:3000/api/subscriptions/${subscriptionId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cambios)
    }
  );

  const data = await response.json();
  return data;
}

// Uso:
actualizarSuscripcion('abc123', { status: 'active' });
```

---

### React Example

```jsx
import { useState } from 'react';

function UpdateSubscriptionButton({ subscriptionId }) {
  const [loading, setLoading] = useState(false);

  const activarSuscripcion = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(
        `http://172.105.21.15:3000/api/subscriptions/${subscriptionId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'active' })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('✅ Suscripción activada');
      } else {
        alert('❌ Error: ' + data.message);
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={activarSuscripcion} disabled={loading}>
      {loading ? 'Procesando...' : 'Activar Suscripción'}
    </button>
  );
}
```

---

### Axios Example

```javascript
import axios from 'axios';

const actualizarStatus = async (subscriptionId, nuevoStatus) => {
  try {
    const response = await axios.patch(
      `http://172.105.21.15:3000/api/subscriptions/${subscriptionId}`,
      { status: nuevoStatus }
    );

    console.log('Actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};

// Uso:
actualizarStatus('abc123', 'active');
```

---

## Respuestas

### Éxito (200 OK)
```json
{
  "success": true,
  "message": "Suscripción actualizada exitosamente",
  "data": {
    "id": "abc123",
    "userId": "user_001",
    "status": "active",
    "plan": "Plan Premium",
    "precio": 99.99,
    "updatedAt": "2025-11-17T16:00:00.000Z"
  }
}
```

### Error 400 - ID Faltante
```json
{
  "success": false,
  "message": "ID de suscripción es requerido"
}
```

### Error 404 - No Encontrada
```json
{
  "success": false,
  "message": "Suscripción no encontrada"
}
```

### Error 500 - Error del Servidor
```json
{
  "success": false,
  "message": "Error al actualizar suscripción",
  "error": "mensaje específico del error"
}
```

---

## Comparación: POST vs PATCH

### ❌ Método Antiguo (POST /renew)
```javascript
// Deprecado - Evitar usar
POST /api/subscriptions/abc123/renew
Body: { userEmail, userName, planName }
```

### ✅ Método Nuevo (PATCH)
```javascript
// Recomendado - RESTful
PATCH /api/subscriptions/abc123
Body: { status: 'active' }
```

**Ventajas del PATCH:**
- ✅ Más RESTful
- ✅ Más flexible (actualiza cualquier campo)
- ✅ Menos endpoints necesarios
- ✅ Estándar HTTP correcto

---

## Estados Disponibles

| Status | Descripción | Uso |
|--------|-------------|-----|
| `active` | Suscripción activa | Usuario puede usar el servicio |
| `paused` | Suscripción pausada | Temporalmente deshabilitada |
| `cancelled` | Suscripción cancelada | Usuario canceló |
| `expired` | Suscripción vencida | Se venció el período |
| `pending` | Pendiente de pago | Esperando confirmación |

---

## Notificaciones Automáticas

El sistema envía emails automáticamente cuando:

- **Status cambia a `active`**: Envía email de renovación/activación
- **En otros casos**: No envía email (puedes implementarlo si necesitas)

---

## Testing

### Probar con cURL

```bash
# 1. Crear una suscripción
curl -X POST http://172.105.21.15:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user",
    "planId": "plan_basic",
    "userEmail": "test@example.com"
  }'

# Guardar el ID de la respuesta (ej: "abc123")

# 2. Actualizar el status
curl -X PATCH http://172.105.21.15:3000/api/subscriptions/abc123 \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'

# 3. Verificar cambios
curl http://172.105.21.15:3000/api/subscriptions/abc123
```

---

## Endpoints Relacionados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/subscriptions` | Crear nueva suscripción |
| GET | `/api/subscriptions` | Listar todas |
| GET | `/api/subscriptions/:id` | Obtener una específica |
| **PATCH** | **`/api/subscriptions/:id`** | **Actualizar (nuevo)** |
| DELETE | `/api/subscriptions/:id` | Cancelar suscripción |
| POST | `/api/subscriptions/:id/renew` | Renovar (deprecado) |

---

**Última actualización:** 17 de noviembre de 2025

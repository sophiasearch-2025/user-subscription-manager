# Guía de Pruebas - Notificaciones por Email

## Cómo Funciona el Sistema

Cuando el **frontend** crea una suscripción, el **backend automáticamente**:

1. ✅ Valida los datos requeridos
2. ✅ Guarda la suscripción en Firebase
3. ✅ Envía notificación por email al usuario
4. ✅ Registra la notificación en Firebase (auditoría)
5. ✅ Responde al frontend con el resultado

---

## Flujo de Integración Frontend → Backend

### 1. Frontend hace el request

```javascript
// Ejemplo con fetch desde React/JavaScript
const crearSuscripcion = async () => {
  const response = await fetch('http://172.105.21.15:3000/api/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: 'user_12345',           // ID del usuario (requerido)
      planId: 'plan_premium',         // ID del plan (requerido)
      userEmail: 'usuario@ejemplo.com', // Email (requerido para notificación)
      userName: 'Juan Pérez',         // Nombre del usuario (opcional)
      planName: 'Plan Premium',       // Nombre del plan (opcional)
      precio: 99.99                   // Precio del plan (opcional)
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

### 2. Backend procesa automáticamente

El backend:
- Guarda en Firestore
- Envía email automáticamente
- No necesitas hacer otra llamada

### 3. Respuesta del backend

```json
{
  "success": true,
  "message": "Suscripción creada exitosamente. Notificación enviada por email.",
  "data": {
    "subscriptionId": "abc123xyz",
    "userId": "user_12345",
    "planId": "plan_premium",
    "status": "active",
    "userEmail": "usuario@ejemplo.com",
    "currentPeriodEnd": "2025-12-17T12:00:00.000Z",
    "notificationSent": true
  }
}
```

---

## Probar desde la Terminal

### Prueba Completa (con email)

```bash
curl -X POST http://172.105.21.15:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "planId": "plan_basic",
    "userEmail": "tu-email@gmail.com",
    "userName": "Usuario Prueba",
    "planName": "Plan Básico",
    "precio": 49.99
  }'
```

### Prueba Mínima (solo campos requeridos)

```bash
curl -X POST http://172.105.21.15:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_002",
    "planId": "plan_premium",
    "userEmail": "test@example.com"
  }'
```

### Verificar que funcionó

```bash
# 1. Ver la suscripción creada
curl http://172.105.21.15:3000/api/subscriptions

# 2. Ver logs del servidor
docker-compose logs -f api | grep "Notificación"
```

---

## Verificar Email Enviado

### Opción 1: Revisar Firebase Console

1. Ve a Firebase Console → Firestore
2. Busca la colección `notifications`
3. Verifica que haya un documento con:
   - `type: "SUBSCRIPTION_RECEIVED"`
   - `email: "tu-email@example.com"`
   - `status: "sent"`
   - `sentAt: <timestamp>`

### Opción 2: Revisar Logs del Servidor

```bash
# En el servidor
docker-compose logs api | grep -A 5 "Enviando notificación"
```

Deberías ver:
```
📧 Enviando notificación de suscripción recibida...
✅ Email enviado exitosamente a: usuario@ejemplo.com
✅ Notificación registrada en Firebase: usuario@ejemplo.com
```

### Opción 3: Revisar tu Bandeja de Entrada

- Revisa tu email (incluye spam/promotions)
- Busca email con asunto: "¡Suscripción Recibida!"
- Contenido: Confirmación de suscripción con ID

---

## Casos de Prueba

### ✅ Caso 1: Suscripción Exitosa

**Request:**
```json
{
  "userId": "user_123",
  "planId": "plan_premium",
  "userEmail": "test@example.com",
  "userName": "Test User",
  "planName": "Plan Premium"
}
```

**Resultado Esperado:**
- ✅ 201 Created
- ✅ Suscripción en Firebase
- ✅ Email enviado
- ✅ Notificación registrada

---

### ❌ Caso 2: Falta userId

**Request:**
```json
{
  "planId": "plan_basic",
  "userEmail": "test@example.com"
}
```

**Resultado Esperado:**
```json
{
  "success": false,
  "message": "userId es requerido"
}
```

---

### ❌ Caso 3: Falta planId

**Request:**
```json
{
  "userId": "user_123",
  "userEmail": "test@example.com"
}
```

**Resultado Esperado:**
```json
{
  "success": false,
  "message": "planId es requerido"
}
```

---

### ❌ Caso 4: Falta userEmail

**Request:**
```json
{
  "userId": "user_123",
  "planId": "plan_basic"
}
```

**Resultado Esperado:**
```json
{
  "success": false,
  "message": "userEmail es requerido para enviar notificación"
}
```

---

## Probar desde Postman

### 1. Configurar Request

- **Method:** POST
- **URL:** `http://172.105.21.15:3000/api/subscriptions`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "userId": "user_postman_001",
    "planId": "plan_premium",
    "userEmail": "tu-email@gmail.com",
    "userName": "Usuario Postman",
    "planName": "Plan Premium",
    "precio": 99.99
  }
  ```

### 2. Enviar Request

Click en "Send"

### 3. Verificar Respuesta

Deberías recibir:
```json
{
  "success": true,
  "message": "Suscripción creada exitosamente. Notificación enviada por email.",
  "data": {
    "subscriptionId": "...",
    "notificationSent": true
  }
}
```

### 4. Verificar Email

Revisa tu bandeja de entrada

---

## Integración con Frontend

### React Example

```jsx
import { useState } from 'react';

function SubscriptionForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://172.105.21.15:3000/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_12345',
          planId: 'plan_premium',
          userEmail: 'usuario@ejemplo.com',
          userName: 'Juan Pérez',
          planName: 'Plan Premium',
          precio: 99.99
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ ¡Suscripción creada! Revisa tu email.');
      } else {
        setMessage('❌ Error: ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Error de conexión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Procesando...' : 'Suscribirse'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
```

### Vue.js Example

```vue
<template>
  <div>
    <button @click="suscribirse" :disabled="loading">
      {{ loading ? 'Procesando...' : 'Suscribirse' }}
    </button>
    <p v-if="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      mensaje: ''
    }
  },
  methods: {
    async suscribirse() {
      this.loading = true;
      
      try {
        const response = await fetch('http://172.105.21.15:3000/api/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'user_12345',
            planId: 'plan_premium',
            userEmail: 'usuario@ejemplo.com',
            userName: 'Juan Pérez',
            planName: 'Plan Premium',
            precio: 99.99
          })
        });

        const data = await response.json();

        if (data.success) {
          this.mensaje = '✅ ¡Suscripción creada! Revisa tu email.';
        } else {
          this.mensaje = '❌ Error: ' + data.message;
        }
      } catch (error) {
        this.mensaje = '❌ Error de conexión: ' + error.message;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
```

---

## Troubleshooting

### El email no llega

1. **Verifica en Firebase:**
   ```bash
   # Ir a Firebase Console → Firestore → notifications
   # Buscar el documento más reciente
   # Ver campo "status": debe ser "sent"
   ```

2. **Revisa logs del servidor:**
   ```bash
   docker-compose logs api | grep -E "Email|Notificación"
   ```

3. **Verifica configuración de email:**
   ```bash
   # En el servidor
   cat .env | grep EMAIL
   ```

### Error 400: userId/planId requerido

- Asegúrate de enviar todos los campos requeridos en el body
- Verifica que el Content-Type sea `application/json`

### Error 500

- Revisa los logs: `docker-compose logs api`
- Verifica que Firebase esté configurado correctamente
- Verifica que `serviceAccountKey.json` exista

---

## Resumen

**Lo que debes hacer desde el frontend:**

1. Hacer un `POST` a `/api/subscriptions`
2. Enviar los datos requeridos: `userId`, `planId`, `userEmail`
3. ¡Listo! El backend se encarga del resto automáticamente

**El backend automáticamente:**

1. ✅ Valida los datos
2. ✅ Guarda en Firebase
3. ✅ Envía el email
4. ✅ Registra la notificación
5. ✅ Responde al frontend

**No necesitas:**
- ❌ Llamar otro endpoint para enviar email
- ❌ Manejar el envío de email desde frontend
- ❌ Preocuparte por Firebase desde frontend

---

**Última actualización:** 17 de noviembre de 2025

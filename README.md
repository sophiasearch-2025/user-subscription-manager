# User Subscription System

Sistema de gestión de usuarios y suscripciones con notificaciones por email usando RabbitMQ.

## 🏗️ Arquitectura

- **API Node.js + Express**: Endpoints REST para gestión de suscripciones
- **Firebase**: Base de datos (Firestore)
- **RabbitMQ**: Sistema de mensajería para colas de notificaciones
- **Email Worker**: Procesador de cola para envío de emails
- **Nodemailer**: Servicio de envío de emails

## 📋 Requisitos Previos

- Docker Desktop instalado
- Node.js 18+ (para desarrollo local)
- Cuenta de Firebase configurada
- Cuenta de email para envío (Gmail recomendado)

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repo>
cd user-subscription-manager
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
# Firebase
FIREBASE_PROJECT_ID=tu-proyecto-real
FIREBASE_CLIENT_EMAIL=tu-email@firebase.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Email (Gmail)
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-de-aplicacion
```

**Nota para Gmail**: Necesitas crear una "Contraseña de aplicación":
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en dos pasos (actívala)
3. Contraseñas de aplicaciones → Genera una nueva
4. Usa esa contraseña en `SMTP_PASS`

### 3. Instalar dependencias
```bash
npm install
```

## 🐳 Uso con Docker

### Levantar todos los servicios
```bash
docker-compose up
```

Esto iniciará:
- **RabbitMQ** en `http://localhost:15672` (interfaz web)
  - Usuario: `admin`
  - Password: `rabbitmq123`
- **API** en `http://localhost:3000`
- **Email Worker** procesando la cola

### Levantar en segundo plano
```bash
docker-compose up -d
```

### Ver logs
```bash
# Todos los servicios
docker-compose logs -f

# Solo el worker de emails
docker-compose logs -f email-worker

# Solo la API
docker-compose logs -f api
```

### Detener servicios
```bash
docker-compose down
```

### Reconstruir después de cambios
```bash
docker-compose up --build
```

## 📧 Sistema de Notificaciones

### Tipos de notificaciones implementadas:

1. **Suscripción Recibida**: Confirma que se recibió la solicitud
2. **Plan por Vencer**: Avisa cuando quedan X días
3. **Plan Renovado**: Confirma la renovación exitosa

### Cómo usar el sistema de notificaciones:

```javascript
const notificationService = require('./services/notification.service');

// 1. Notificar suscripción recibida
await notificationService.sendSubscriptionReceivedNotification({
  userEmail: 'usuario@example.com',
  userName: 'Juan Pérez',
  planName: 'Plan Premium',
  subscriptionId: 'sub_12345'
});

// 2. Notificar plan próximo a vencer
await notificationService.sendPlanExpirationNotification({
  userEmail: 'usuario@example.com',
  userName: 'Juan Pérez',
  planName: 'Plan Premium',
  expirationDate: '2025-12-01',
  daysRemaining: 7
});

// 3. Notificar renovación
await notificationService.sendPlanRenewalNotification({
  userEmail: 'usuario@example.com',
  userName: 'Juan Pérez',
  planName: 'Plan Premium',
  newExpirationDate: '2026-12-01'
});
```

## 🔧 Desarrollo Local (sin Docker)

### 1. Instalar RabbitMQ localmente
```bash
brew install rabbitmq
brew services start rabbitmq
```

### 2. Iniciar la API
```bash
npm start
```

### 3. Iniciar el Worker (en otra terminal)
```bash
npm run worker
```

## 🧪 Probar el Sistema

### 1. Acceder a RabbitMQ Management
Abre `http://localhost:15672` en tu navegador
- Usuario: `admin`
- Password: `rabbitmq123`

### 2. Enviar una notificación de prueba

Puedes usar el servicio directamente en tu código o crear un endpoint de prueba:

```javascript
// En tu controlador o ruta de prueba
app.post('/test/notification', async (req, res) => {
  try {
    await notificationService.sendSubscriptionReceivedNotification({
      userEmail: 'tu-email@gmail.com',
      userName: 'Prueba',
      planName: 'Plan Test',
      subscriptionId: 'test_123'
    });
    res.json({ message: 'Notificación enviada a la cola' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Verificar en los logs
```bash
docker-compose logs -f email-worker
```

Deberías ver:
```
📨 Procesando mensaje tipo: SUBSCRIPTION_RECEIVED
📧 Destinatario: tu-email@gmail.com
✅ Email enviado: <message-id>
✅ Mensaje procesado exitosamente
```

## 📁 Estructura del Proyecto

```
/user-subscription-manager
├── src/
│   ├── api/                      # Rutas de la API
│   ├── controllers/              # Lógica de negocio
│   ├── models/                   # Modelos de datos
│   ├── services/
│   │   ├── email.service.js      # ✅ Envío de emails con plantillas HTML
│   │   ├── notification.service.js # ✅ Envío a cola RabbitMQ
│   │   ├── payment.service.js
│   │   └── security.service.js
│   ├── workers/
│   │   └── email.worker.js       # ✅ Procesador de cola
│   ├── middlewares/
│   ├── config/
│   └── app.js
├── docker-compose.yml            # ✅ Configurado con RabbitMQ
├── Dockerfile                    # ✅ Imagen de Node.js
├── .env.example                  # ✅ Variables de entorno
└── package.json                  # ✅ Dependencias agregadas
```

## 🔍 Troubleshooting

### El worker no se conecta a RabbitMQ
- Espera unos segundos, RabbitMQ tarda en iniciarse
- Verifica los logs: `docker-compose logs rabbitmq`

### Los emails no se envían
- Verifica tu `SMTP_USER` y `SMTP_PASS` en `.env`
- Si usas Gmail, asegúrate de tener una "Contraseña de aplicación"
- Revisa los logs del worker: `docker-compose logs email-worker`

### Mensaje permanece en la cola
- Revisa los logs para ver el error
- Accede a RabbitMQ Management y revisa la cola manualmente

## 📚 Próximos Pasos

1. Implementar los controladores (`subscription.controller.js`)
2. Integrar Firebase para almacenar usuarios y suscripciones
3. Crear endpoints en la API para crear/renovar suscripciones
4. Implementar un cron job para verificar planes próximos a vencer
5. Agregar tests automatizados

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT


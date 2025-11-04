# User Subscription System

Sistema de gestión de usuarios y suscripciones con notificaciones automáticas por email usando **Firebase y Gmail** - **100% GRATUITO**.

## 🏗️ Arquitectura

- **API Node.js + Express**: Endpoints REST para gestión de suscripciones
- **Firebase Firestore**: Base de datos en la nube (gratis hasta 1GB)
- **Nodemailer + Gmail**: Servicio de envío de emails (500 emails/día gratis)
- **Scheduler Service**: Verificación periódica de suscripciones
- **Cron Jobs Externos**: Automatización gratuita con servicios como cron-job.org

## ✨ Características

✅ Notificaciones automáticas por email  
✅ Verificación de suscripciones próximas a vencer (7, 3, 1 días antes)  
✅ Templates HTML profesionales  
✅ Auditoría de notificaciones en Firebase  
✅ Sin colas complejas (RabbitMQ removido)  
✅ 100% gratuito - Sin tarjeta de crédito  

## 📋 Requisitos Previos

- Node.js 18+ 
- Cuenta de Firebase (plan gratuito)
- Cuenta de Gmail (para envío de emails)

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <tu-repo>
cd user-subscription-manager
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase

1. Crea un proyecto en https://console.firebase.google.com/
2. Activa Firestore Database
3. Descarga las credenciales:
   - Ve a "Configuración del proyecto" → "Cuentas de servicio"
   - Click en "Generar nueva clave privada"
   - Guarda el archivo como `serviceAccountKey.json` en la raíz del proyecto

### 4. Configurar Gmail

1. Ve a https://myaccount.google.com/apppasswords
2. Genera una "contraseña de aplicación"
3. Copia la contraseña (16 caracteres)

### 5. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
# Firebase
FIREBASE_PROJECT_ID=tu-proyecto-firebase

# Email (Gmail)
SMTP_USER=tucorreo@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion-google

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 6. Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📧 Sistema de Notificaciones

### Notificaciones implementadas:

1. **Suscripción Recibida**: Se envía automáticamente cuando un usuario crea una suscripción
2. **Plan por Vencer**: Notifica 7, 3 y 1 día antes del vencimiento
3. **Plan Renovado**: Confirma la renovación exitosa

### API Endpoints

#### Crear Suscripción (envía email automáticamente)
```bash
POST http://localhost:3000/api/subscriptions
Content-Type: application/json

{
  "userId": "user123",
  "planId": "plan_premium",
  "userEmail": "usuario@example.com",
  "userName": "Juan Pérez",
  "planName": "Plan Premium"
}
```

#### Renovar Suscripción (envía email automáticamente)
```bash
POST http://localhost:3000/api/subscriptions/:subscriptionId/renew
Content-Type: application/json

{
  "userEmail": "usuario@example.com",
  "userName": "Juan Pérez",
  "planName": "Plan Premium"
}
```

#### Verificar Suscripciones Manualmente
```bash
POST http://localhost:3000/api/scheduler/run
```

Este endpoint verifica todas las suscripciones activas y envía notificaciones a las que estén próximas a vencer.

## ⏰ Automatización con Cron Jobs (GRATIS)

Para que el sistema verifique automáticamente las suscripciones todos los días, usa un servicio de cron jobs externo gratuito:

### Opción 1: cron-job.org (Recomendado)

1. Regístrate en https://cron-job.org/
2. Crea un nuevo cron job:
   - **URL**: `https://tu-dominio.com/api/scheduler/run`
   - **Método**: POST
   - **Horario**: Todos los días a las 9:00 AM
   - **Formato cron**: `0 9 * * *`

### Opción 2: EasyCron

1. Regístrate en https://www.easycron.com/
2. Configura un cron job similar

### Opción 3: Ejecutar manualmente desde terminal

```bash
npm run scheduler
```

## 🧪 Probar el Sistema

### 1. Verificar configuración de email
```bash
curl http://localhost:3000/api/health
```

### 2. Enviar una notificación de prueba

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

### 3. Ejecutar verificación de suscripciones

```bash
curl -X POST http://localhost:3000/api/scheduler/run
```

## 📁 Estructura del Proyecto

```
/user-subscription-manager
├── src/
│   ├── api/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── subscription.routes.js
│   │   ├── scheduler.routes.js        # ✅ NUEVO: Rutas para cron jobs
│   │   └── index.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── subscription.controller.js
│   ├── services/
│   │   ├── email.service.js           # ✅ Envío de emails con plantillas HTML
│   │   ├── notification.service.js    # ✅ ACTUALIZADO: Sin RabbitMQ
│   │   ├── scheduler.service.js       # ✅ NUEVO: Verificación de suscripciones
│   │   ├── payment.service.js
│   │   └── security.service.js
│   ├── config/
│   │   └── firebase.js                # Configuración de Firebase
│   ├── middlewares/
│   ├── models/
│   └── app.js
├── docs/
│   ├── arquitectura.md
│   └── notificaciones.md              # ✅ NUEVA: Documentación completa
├── .env.example                       # ✅ ACTUALIZADO: Sin RabbitMQ
├── package.json                       # ✅ ACTUALIZADO: Sin amqplib
├── serviceAccountKey.json             # ⚠️ Agregar manualmente (Firebase)
└── README.md
```

## � Documentación Adicional

Para más detalles sobre el sistema de notificaciones, consulta:
- **[docs/notificaciones.md](docs/notificaciones.md)** - Guía completa de notificaciones

## 🔍 Solución de Problemas

### Los emails no se envían
- Verifica tu `SMTP_USER` y `SMTP_PASS` en `.env`
- Si usas Gmail, asegúrate de tener una "Contraseña de aplicación"
- Prueba con: `npm run scheduler`

### Error: "Firebase project not found"
- Verifica que `serviceAccountKey.json` esté en la raíz del proyecto
- Verifica que `FIREBASE_PROJECT_ID` sea correcto en `.env`

### No se envían notificaciones de expiración
- Verifica que tengas suscripciones con `status: 'active'` en Firestore
- Ejecuta manualmente: `curl -X POST http://localhost:3000/api/scheduler/run`

## 💰 Costos (TODO GRATIS)

| Servicio | Límite Gratuito | Costo Mensual |
|----------|----------------|---------------|
| Firebase Firestore | 1 GB + 50K lecturas/día | $0 |
| Gmail/Nodemailer | 500 emails/día | $0 |
| cron-job.org | Ilimitado | $0 |
| **TOTAL** | - | **$0** |

## 🎯 Próximos Pasos

1. ✅ Sistema de notificaciones implementado
2. ⏳ Agregar más tipos de notificaciones (bienvenida, recordatorios, etc.)
3. ⏳ Dashboard para ver estadísticas de notificaciones
4. ⏳ Soporte para templates de email personalizables

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación en `docs/notificaciones.md`
2. Verifica los logs del servidor
3. Prueba los endpoints manualmente con curl o Postman

---

**¡Sistema 100% funcional y gratuito!** 🎉
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


# 🚀 Guía Rápida - Sistema de Notificaciones

## ⚡ Inicio Rápido (5 minutos)

### 1. Configurar Servicio de Email (Elige UNO)

#### Opción A: SendGrid (Recomendado - SIN verificación en 2 pasos)
```bash
# 1. Regístrate en https://sendgrid.com/
# 2. Verifica tu email
# 3. Crea un API Key en Settings → API Keys
# 4. Copia el API Key (empieza con SG.)
```

#### Opción B: Brevo (300 emails/día)
```bash
# 1. Regístrate en https://www.brevo.com/
# 2. Ve a Settings → SMTP & API
# 3. Genera un API Key
```

#### Opción C: Gmail (Solo si tienes 2FA)
```bash
# 1. Ve a https://myaccount.google.com/apppasswords
# 2. Genera una contraseña de aplicación
# 3. Cópiala (16 caracteres sin espacios)
```

**👉 Guía detallada de SendGrid**: [docs/configurar-sendgrid.md](./configurar-sendgrid.md)

### 2. Configurar Firebase

```bash
# 1. Crea un proyecto en https://console.firebase.google.com/
# 2. Activa Firestore Database
# 3. Descarga serviceAccountKey.json
# 4. Colócalo en la raíz del proyecto
```

### 3. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita `.env`:
```env
FIREBASE_PROJECT_ID=tu-proyecto-id

# Opción A: SendGrid (Recomendado)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=notificaciones@tuapp.com

# Opción B: Brevo
# EMAIL_SERVICE=brevo
# BREVO_API_KEY=tu-api-key
# EMAIL_FROM=notificaciones@tuapp.com

# Opción C: Gmail
# EMAIL_SERVICE=gmail
# SMTP_USER=tucorreo@gmail.com
# SMTP_PASS=abcd efgh ijkl mnop
# EMAIL_FROM no es necesario con Gmail

FRONTEND_URL=http://localhost:3000
```

### 4. Instalar e Iniciar

```bash
npm install
npm run seed          # Crear datos de prueba
npm run dev           # Iniciar servidor
```

### 5. Probar

En otra terminal:
```bash
# Opción 1: Probar emails directamente
npm run test:notifications

# Opción 2: Probar verificación de suscripciones
curl -X POST http://localhost:3000/api/scheduler/run
```

✅ ¡Revisa tu email!

---

## 📧 Endpoints Disponibles

### Verificar Estado
```bash
curl http://localhost:3000/api/health
```

### Crear Suscripción (envía email automático)
```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "planId": "plan_premium",
    "userEmail": "tucorreo@gmail.com",
    "userName": "Tu Nombre",
    "planName": "Plan Premium"
  }'
```

### Verificar Suscripciones (envía emails de expiración)
```bash
curl -X POST http://localhost:3000/api/scheduler/run
```

---

## ⏰ Configurar Cron Job (Automatización)

### Con cron-job.org (GRATIS)

1. **Regístrate**: https://cron-job.org/
2. **Nuevo cron job**:
   - URL: `https://tu-dominio.com/api/scheduler/run`
   - Método: POST
   - Horario: `0 9 * * *` (todos los días a las 9 AM)

### Con servidor Linux (crontab)

```bash
crontab -e
```

Agregar:
```bash
# Ejecutar verificación de suscripciones diariamente a las 9 AM
0 9 * * * curl -X POST http://tu-servidor:3000/api/scheduler/run
```

---

## 🔍 Verificar en Firebase

1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto
3. Ve a Firestore Database
4. Verás las colecciones:
   - `users` - Usuarios
   - `subscriptions` - Suscripciones
   - `plans` - Planes
   - `notifications` - Registro de notificaciones enviadas

---

## 🐛 Problemas Comunes

### "Invalid login credentials"
- ✅ Usa contraseña de **aplicación**, no tu contraseña normal de Gmail
- ✅ Genera una nueva en: https://myaccount.google.com/apppasswords

### "Firebase project not found"
- ✅ Verifica que `serviceAccountKey.json` esté en la raíz
- ✅ Verifica `FIREBASE_PROJECT_ID` en `.env`

### "No se envían notificaciones"
- ✅ Verifica que tengas suscripciones con `status: 'active'`
- ✅ Verifica que `expirationDate` esté en el futuro
- ✅ Ejecuta `npm run seed` para crear datos de prueba

### "Cannot find module"
- ✅ Ejecuta `npm install` de nuevo

---

## 📊 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| Iniciar servidor | `npm run dev` | Modo desarrollo con nodemon |
| Producción | `npm start` | Iniciar en producción |
| Probar emails | `npm run test:notifications` | Envía 3 emails de prueba |
| Crear datos | `npm run seed` | Poblar Firestore con datos de ejemplo |
| Verificar suscripciones | `npm run scheduler` | Ejecutar verificación manualmente |

---

## 📚 Documentación Completa

- **Sistema de Notificaciones**: [docs/notificaciones.md](./notificaciones.md)
- **README Principal**: [README.md](../README.md)

---

## 🎉 ¡Listo!

Tu sistema está configurado y funcionando. Ahora:

1. ✅ Los usuarios reciben email cuando crean una suscripción
2. ✅ El sistema verifica automáticamente suscripciones por vencer
3. ✅ Se envían notificaciones 7, 3 y 1 día antes del vencimiento
4. ✅ Todo es GRATIS (sin tarjeta de crédito)

**Siguiente paso**: Configura un cron job en cron-job.org para automatizar completamente el sistema.

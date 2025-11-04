# ✅ Checklist de Verificación - Sistema de Notificaciones

## 📋 Antes de Empezar

### 1. Requisitos de Software
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Git instalado (opcional)

### 2. Cuentas Necesarias
- [ ] Cuenta de Gmail creada
- [ ] Cuenta de Firebase creada (https://firebase.google.com/)

---

## 🔧 Configuración

### 3. Servicio de Email (Elige una opción)

#### Opción A: SendGrid (Recomendado - 100 emails/día GRATIS)
- [ ] Cuenta creada en https://sendgrid.com/
- [ ] API Key generada
- [ ] API Key copiada
- [ ] Dominio verificado (opcional, o usa "From" genérico)

#### Opción B: Brevo (ex-Sendinblue) (300 emails/día GRATIS)
- [ ] Cuenta creada en https://www.brevo.com/
- [ ] API Key generada (Settings → SMTP & API)
- [ ] API Key copiada

#### Opción C: Resend (100 emails/día GRATIS, más moderno)
- [ ] Cuenta creada en https://resend.com/
- [ ] API Key generada
- [ ] API Key copiada

#### Opción D: Mailgun (100 emails/día en trial)
- [ ] Cuenta creada en https://www.mailgun.com/
- [ ] API Key generada
- [ ] Dominio configurado (o usa sandbox)

### 4. Firebase - Configuración
- [ ] Proyecto de Firebase creado
- [ ] Firestore Database activado
- [ ] Archivo `serviceAccountKey.json` descargado
- [ ] `serviceAccountKey.json` colocado en la raíz del proyecto
- [ ] Project ID copiado

### 5. Variables de Entorno
- [ ] Archivo `.env` creado (copiado de `.env.example`)
- [ ] `FIREBASE_PROJECT_ID` configurado
- [ ] `SMTP_USER` configurado (tu email de Gmail)
- [ ] `SMTP_PASS` configurado (contraseña de aplicación)
- [ ] `FRONTEND_URL` configurado (opcional)

---

## 📦 Instalación

### 6. Dependencias
- [ ] `npm install` ejecutado sin errores
- [ ] Todas las dependencias instaladas

---

## 🧪 Pruebas

### 7. Probar Configuración de Email
```bash
npm run test:notifications
```
- [ ] Script ejecutado sin errores
- [ ] Mensaje "✅ Conexión al servicio de email OK"
- [ ] 3 emails recibidos en tu bandeja de entrada:
  - [ ] Email de "Solicitud Recibida"
  - [ ] Email de "Plan por Vencer"
  - [ ] Email de "Plan Renovado"

### 8. Crear Datos de Prueba en Firestore
```bash
npm run seed
```
- [ ] Script ejecutado sin errores
- [ ] Mensaje "✅ SEED COMPLETADO EXITOSAMENTE"
- [ ] Datos visibles en Firebase Console:
  - [ ] Colección `users` con 2 usuarios
  - [ ] Colección `subscriptions` con 4 suscripciones
  - [ ] Colección `plans` con 3 planes

### 9. Iniciar Servidor
```bash
npm run dev
```
- [ ] Servidor iniciado en puerto 3000
- [ ] Sin errores en la consola

### 10. Probar Endpoints
En otra terminal:

#### Health Check
```bash
curl http://localhost:3000/api/health
```
- [ ] Respuesta: `{"success": true, ...}`

#### Verificar Suscripciones
```bash
curl -X POST http://localhost:3000/api/scheduler/run
```
- [ ] Respuesta exitosa
- [ ] Emails de notificación recibidos (para suscripciones que vencen en 7, 3 o 1 día)
- [ ] Colección `notifications` creada en Firestore

#### Crear Nueva Suscripción
```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "planId": "plan_premium",
    "userEmail": "TU_EMAIL@gmail.com",
    "userName": "Tu Nombre",
    "planName": "Plan Premium"
  }'
```
- [ ] Respuesta exitosa
- [ ] Email de confirmación recibido

---

## 📊 Verificar en Firebase Console

### 11. Colecciones en Firestore
Ve a https://console.firebase.google.com/ → Tu Proyecto → Firestore Database

- [ ] Colección `users` existe y tiene datos
- [ ] Colección `subscriptions` existe y tiene datos
- [ ] Colección `plans` existe y tiene datos
- [ ] Colección `notifications` se crea después de enviar notificaciones

### 12. Verificar Notificaciones Enviadas
En la colección `notifications`:
- [ ] Documentos con `type: "SUBSCRIPTION_RECEIVED"`
- [ ] Documentos con `type: "PLAN_EXPIRING"`
- [ ] Todos los documentos tienen `status: "sent"`
- [ ] Cada documento tiene `sentAt` con timestamp

---

## ⏰ Automatización (Opcional)

### 13. Configurar Cron Job
Opción 1: cron-job.org
- [ ] Cuenta creada en https://cron-job.org/
- [ ] Cron job configurado:
  - [ ] URL: `https://tu-dominio.com/api/scheduler/run`
  - [ ] Método: POST
  - [ ] Horario: `0 9 * * *` (9 AM diario)
  - [ ] Cron job activado

Opción 2: Servidor Linux (crontab)
- [ ] Crontab configurado
- [ ] Comando de prueba ejecutado manualmente

---

## 🐛 Solución de Problemas

### 14. Si algo falla:

#### Emails no se envían
- [ ] Verificado `SMTP_USER` y `SMTP_PASS` en `.env`
- [ ] Confirmado que es "contraseña de aplicación", no contraseña normal
- [ ] Probado regenerar contraseña de aplicación

#### Error de Firebase
- [ ] Verificado `serviceAccountKey.json` en la raíz del proyecto
- [ ] Verificado `FIREBASE_PROJECT_ID` en `.env`
- [ ] Firestore Database activado en Firebase Console

#### No se envían notificaciones de expiración
- [ ] Verificado que hay suscripciones con `status: "active"`
- [ ] Verificado que `expirationDate` está en el futuro
- [ ] Ejecutado `npm run seed` para crear datos de prueba
- [ ] Ejecutado `npm run scheduler` manualmente

#### "Cannot find module"
- [ ] Ejecutado `npm install` de nuevo
- [ ] Verificado que `node_modules` existe
- [ ] Eliminado `node_modules` y ejecutado `npm install` de nuevo

---

## 📝 Logs y Debugging

### 15. Verificar Logs
Durante la ejecución, deberías ver:

#### Al iniciar el servidor:
```
✅ Conectado a Firestore
✅ Servicio de email configurado correctamente
🚀 Servidor corriendo en puerto 3000
```

#### Al ejecutar scheduler:
```
🔍 Iniciando verificación de suscripciones...
✅ Notificación enviada a usuario@email.com (7 días)
✅ Verificación completada: X revisadas, Y notificaciones enviadas
```

#### Al enviar notificación:
```
📧 Enviando notificación de suscripción recibida...
✅ Email enviado: <message-id>
✅ Notificación de suscripción enviada: usuario@email.com
```

- [ ] Logs aparecen correctamente
- [ ] Sin errores en la consola

---

## ✅ Verificación Final

### 16. Sistema Funcionando
- [ ] Servidor iniciado sin errores
- [ ] Emails de prueba recibidos correctamente
- [ ] Datos en Firestore visibles
- [ ] Endpoints respondiendo correctamente
- [ ] Notificaciones registradas en Firebase
- [ ] Sistema listo para producción

---

## 🎉 ¡Felicidades!

Si todos los checks están marcados, tu sistema está:
✅ Correctamente configurado  
✅ Funcionando perfectamente  
✅ Listo para producción  
✅ 100% gratuito  

### Próximos Pasos:
1. Despliega tu API en un servicio como Render o Railway
2. Configura un cron job en cron-job.org
3. ¡Disfruta de tu sistema de notificaciones automatizado!

---

## 📚 Documentación de Referencia

- **Guía Rápida**: `docs/guia-rapida.md`
- **Documentación Completa**: `docs/notificaciones.md`
- **Resumen de Implementación**: `IMPLEMENTACION.md`
- **README**: `README.md`

---

**¿Problemas?** Revisa la sección de "Solución de Problemas" en `docs/notificaciones.md`

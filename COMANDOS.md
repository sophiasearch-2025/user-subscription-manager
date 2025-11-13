# ⚡ Comandos Útiles - Referencia Rápida

## 🚀 Desarrollo

### Iniciar el servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

### Probar el sistema
```bash
# Probar envío de emails (envía 3 emails de prueba)
npm run test:notifications

# Crear datos de prueba en Firestore
npm run seed

# Ejecutar verificación de suscripciones manualmente
npm run scheduler
```

---

## 🧪 Testing con cURL

### 1. Verificar estado de la API
```bash
curl http://localhost:3000/api/health
```

### 2. Crear una suscripción (envía email automáticamente)
```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "planId": "plan_premium",
    "userEmail": "tu-email@gmail.com",
    "userName": "Tu Nombre",
    "planName": "Plan Premium"
  }'
```

### 3. Verificar suscripciones (envía emails de expiración)
```bash
curl -X POST http://localhost:3000/api/scheduler/run
```

### 4. Solo verificar suscripciones próximas a vencer
```bash
curl -X POST http://localhost:3000/api/scheduler/check-expiring
```

### 5. Solo marcar suscripciones expiradas
```bash
curl -X POST http://localhost:3000/api/scheduler/check-expired
```

### 6. Estado del scheduler
```bash
curl http://localhost:3000/api/scheduler/status
```

---

## 🔥 Firebase

### Ver datos en Firebase Console
```bash
# Abre la consola de Firebase en tu navegador
open https://console.firebase.google.com/

# O manualmente:
# 1. Ve a https://console.firebase.google.com/
# 2. Selecciona tu proyecto
# 3. Ve a Firestore Database
```

### Estructura de colecciones
```
Firestore Database
├── users/              (Usuarios registrados)
├── subscriptions/      (Suscripciones activas/expiradas)
├── plans/              (Planes disponibles)
└── notifications/      (Historial de notificaciones enviadas)
```

---

## 📧 Gmail

### Generar contraseña de aplicación
```bash
# Abre en tu navegador:
open https://myaccount.google.com/apppasswords

# O manualmente:
# 1. Ve a https://myaccount.google.com/
# 2. Seguridad → Verificación en dos pasos (actívala)
# 3. Contraseñas de aplicaciones → Genera una nueva
# 4. Copia la contraseña (16 caracteres)
# 5. Úsala en SMTP_PASS en tu .env
```

---

## 🐛 Debugging

### Ver logs del servidor
```bash
# Simplemente ejecuta en modo dev
npm run dev

# Los logs mostrarán:
# - Conexión a Firebase
# - Configuración de email
# - Notificaciones enviadas
# - Errores (si hay)
```

### Verificar variables de entorno
```bash
# Mostrar variables configuradas (sin valores sensibles)
cat .env | grep -v "PASS\|KEY"
```

### Limpiar e reinstalar dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Consultas de Base de Datos

### Node.js (para scripts)
```javascript
const { db } = require('./src/config/firebase');

// Obtener todas las suscripciones activas
const snapshot = await db.collection('subscriptions')
  .where('status', '==', 'active')
  .get();

snapshot.forEach(doc => {
  console.log(doc.id, doc.data());
});

// Obtener suscripciones que vencen pronto
const now = new Date();
const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

const snapshot = await db.collection('subscriptions')
  .where('status', '==', 'active')
  .where('expirationDate', '<=', sevenDaysFromNow.toISOString())
  .get();
```

---

## ⏰ Configurar Cron Job

### Opción 1: cron-job.org (Recomendado - GRATIS)
```bash
# 1. Regístrate en https://cron-job.org/
# 2. Crear nuevo cron job:
#    - Título: "Verificar suscripciones"
#    - URL: https://tu-dominio.com/api/scheduler/run
#    - Método: POST
#    - Horario: 0 9 * * * (diario a las 9 AM)
```

### Opción 2: crontab (Linux/Mac)
```bash
# Editar crontab
crontab -e

# Agregar línea (ejecutar diariamente a las 9 AM):
0 9 * * * curl -X POST http://tu-servidor:3000/api/scheduler/run

# Ver crontab actual
crontab -l

# Eliminar crontab
crontab -r
```

### Opción 3: Windows Task Scheduler
```powershell
# Crear tarea programada con PowerShell
$action = New-ScheduledTaskAction -Execute "curl" -Argument "-X POST http://localhost:3000/api/scheduler/run"
$trigger = New-ScheduledTaskTrigger -Daily -At 9am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "Verificar Suscripciones"
```

---

## 🚢 Despliegue

### Render.com (GRATIS)
```bash
# 1. Crea cuenta en https://render.com/
# 2. Conecta tu repositorio de GitHub
# 3. Crear nuevo Web Service:
#    - Build Command: npm install
#    - Start Command: npm start
# 4. Agregar variables de entorno:
#    - FIREBASE_PROJECT_ID
#    - SMTP_USER
#    - SMTP_PASS
#    - FRONTEND_URL
# 5. Agregar serviceAccountKey.json como archivo
# 6. Deploy!
```

### Railway (GRATIS)
```bash
# 1. Instala Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Inicializar proyecto
railway init

# 4. Deploy
railway up

# 5. Agregar variables de entorno
railway variables set FIREBASE_PROJECT_ID=tu-proyecto
railway variables set SMTP_USER=tu-email@gmail.com
railway variables set SMTP_PASS=tu-password
```

### Heroku (GRATIS con limitaciones)
```bash
# 1. Instala Heroku CLI
brew install heroku/brew/heroku

# 2. Login
heroku login

# 3. Crear app
heroku create tu-app-name

# 4. Configurar variables
heroku config:set FIREBASE_PROJECT_ID=tu-proyecto
heroku config:set SMTP_USER=tu-email@gmail.com
heroku config:set SMTP_PASS=tu-password

# 5. Deploy
git push heroku main
```

---

## 🔍 Monitoreo

### Ver notificaciones enviadas
```bash
# En Firebase Console, ve a:
# Firestore Database → notifications

# O con código:
const snapshot = await db.collection('notifications')
  .orderBy('sentAt', 'desc')
  .limit(10)
  .get();

snapshot.forEach(doc => {
  const notif = doc.data();
  console.log(`${notif.type} → ${notif.email} (${notif.status})`);
});
```

### Ver suscripciones que vencen pronto
```javascript
const now = new Date();
const snapshot = await db.collection('subscriptions')
  .where('status', '==', 'active')
  .get();

const expiringSoon = [];
snapshot.forEach(doc => {
  const sub = doc.data();
  const daysUntil = Math.ceil(
    (new Date(sub.expirationDate) - now) / (1000 * 60 * 60 * 24)
  );
  if (daysUntil <= 7) {
    expiringSoon.push({ ...sub, daysUntil });
  }
});

console.log('Suscripciones que vencen pronto:', expiringSoon);
```

---

## 🛠️ Mantenimiento

### Actualizar dependencias
```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar todas
npm update

# Actualizar a última versión (cuidado)
npm install package@latest
```

### Limpiar Firestore (¡CUIDADO!)
```bash
# Ejecutar script de limpieza (elimina TODO)
node -e "
const { db } = require('./src/config/firebase');
const collections = ['users', 'subscriptions', 'plans', 'notifications'];
collections.forEach(async col => {
  const snapshot = await db.collection(col).get();
  snapshot.docs.forEach(doc => doc.ref.delete());
});
"
```

### Backup de Firestore
```bash
# Exportar datos
gcloud firestore export gs://[BUCKET_NAME]

# O usar el script de backup
node src/scripts/backup.js
```

---

## 📚 Recursos Útiles

### Documentación
- Firebase: https://firebase.google.com/docs
- Nodemailer: https://nodemailer.com/
- Express: https://expressjs.com/

### Herramientas
- Postman: https://www.postman.com/
- Firebase Console: https://console.firebase.google.com/
- cron-job.org: https://cron-job.org/

### Tutoriales
- Gmail App Passwords: https://support.google.com/accounts/answer/185833
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup
- Cron Expressions: https://crontab.guru/

---

## 💡 Tips

### Desarrollo más rápido
```bash
# Usar alias en tu .bashrc o .zshrc
alias dev='npm run dev'
alias test-notif='npm run test:notifications'
alias seed='npm run seed'
```

### Debugging de emails
```bash
# Si no recibes emails, verifica:
1. Spam folder
2. SMTP_USER y SMTP_PASS en .env
3. Logs del servidor
4. Probar con: npm run test:notifications
```

### Performance
```bash
# Firebase tiene límites, optimiza consultando solo lo necesario:
# - Usa .limit() en queries
# - Usa índices compuestos para queries complejas
# - Cachea resultados frecuentes
```

---

## 🎯 Atajos de Teclado (VS Code)

```
Ctrl/Cmd + `        → Abrir terminal
Ctrl/Cmd + Shift + ` → Nueva terminal
Ctrl/Cmd + P        → Buscar archivo
Ctrl/Cmd + Shift + F → Buscar en proyecto
```

---

**¿Más ayuda?** Consulta la documentación en `docs/` o `CHECKLIST.md`

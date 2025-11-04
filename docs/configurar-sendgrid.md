# 📧 Guía: Configurar SendGrid (SIN verificación en 2 pasos)

## 🎯 ¿Por qué SendGrid?

- ✅ **100 emails/día GRATIS** (más que suficiente)
- ✅ **NO requiere verificación en 2 pasos**
- ✅ **NO requiere número de teléfono**
- ✅ **Solo necesitas un email**
- ✅ Configuración en 5 minutos

---

## 🚀 Configuración Paso a Paso (5 minutos)

### 1. Crear Cuenta en SendGrid

1. Ve a https://sendgrid.com/
2. Click en **"Start for Free"**
3. Completa el formulario:
   - Email
   - Contraseña
   - Nombre/Empresa (puedes poner cualquier cosa)
4. **Verifica tu email** (revisa tu bandeja de entrada)

### 2. Completar el Onboarding

Después de verificar el email, SendGrid te pedirá información:

1. **¿Cómo vas a enviar emails?**
   - Selecciona: **"Integrate using our Web API or SMTP relay"**

2. **Información adicional** (opcional):
   - Role: Developer
   - Company size: Just me
   - Email purpose: Transactional (notificaciones)

### 3. Crear API Key

1. En el dashboard, ve a **Settings** → **API Keys**
2. Click en **"Create API Key"**
3. Configura:
   - **API Key Name**: `notifications-app`
   - **API Key Permissions**: **Full Access** (o "Mail Send")
4. Click en **"Create & View"**
5. **¡IMPORTANTE!** Copia la API Key (solo se muestra una vez)
   - Ejemplo: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 4. Configurar en tu Proyecto

Edita tu archivo `.env`:

```env
# Firebase
FIREBASE_PROJECT_ID=tu-proyecto-firebase

# SendGrid
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=notificaciones@tudominio.com

# URLs
FRONTEND_URL=http://localhost:3000
PORT=3000
```

**Nota sobre EMAIL_FROM**:
- Puedes usar cualquier email mientras estés en modo sandbox
- Ejemplo: `notificaciones@tuapp.com`, `noreply@ejemplo.com`
- Los emails se enviarán correctamente

### 5. Probar el Sistema

```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Probar envío de emails
npm run test:notifications
```

Si todo está bien, verás:
```
✅ Conexión al servicio de email OK
✅ Email de suscripción enviado
✅ Email de expiración enviado
✅ Email de renovación enviado
```

**¡Revisa tu bandeja de entrada!** Deberías recibir 3 emails.

---

## 🎨 Configuración Avanzada (Opcional)

### Verificar Dominio (para producción)

Si quieres que los emails vengan de tu dominio real:

1. Ve a **Settings** → **Sender Authentication**
2. Click en **"Authenticate Your Domain"**
3. Sigue las instrucciones para agregar registros DNS
4. Usa tu dominio en `EMAIL_FROM`

**No es necesario para desarrollo/pruebas.**

### Verificar Single Sender (alternativa rápida)

1. Ve a **Settings** → **Sender Authentication**
2. Click en **"Verify a Single Sender"**
3. Completa el formulario con tu email
4. Verifica el email que te enviarán
5. Usa ese email en `EMAIL_FROM`

---

## 🐛 Solución de Problemas

### Error: "The provided authorization grant is invalid"
- ❌ API Key incorrecta
- ✅ Verifica que copiaste la API Key completa
- ✅ Debe empezar con `SG.`

### Error: "The from address does not match a verified Sender Identity"
- ⚠️ Solo en producción después de enviar muchos emails
- ✅ Verifica un "Single Sender" en SendGrid
- ✅ O verifica tu dominio completo

### No recibo emails
- ✅ Revisa tu carpeta de **Spam**
- ✅ Verifica que `EMAIL_FROM` esté configurado
- ✅ Verifica los logs del servidor

### Error: "Cannot find module 'nodemailer'"
```bash
npm install nodemailer
```

---

## 📊 Límites de SendGrid (Plan Gratuito)

| Característica | Límite Gratuito |
|----------------|-----------------|
| Emails por día | 100 |
| Emails por mes | 3,000 |
| Duración | Para siempre |
| API Keys | Ilimitadas |
| Soporte | Documentación |

**Para un sistema de notificaciones de suscripciones, 100 emails/día es MÁS que suficiente.**

---

## 🔄 Alternativas (si necesitas más emails/día)

### Brevo (ex-Sendinblue) - 300 emails/día
1. Registrate en https://www.brevo.com/
2. Ve a **Settings** → **SMTP & API**
3. Genera un API Key
4. Configura en `.env`:
   ```env
   EMAIL_SERVICE=brevo
   BREVO_API_KEY=tu-api-key
   EMAIL_FROM=notificaciones@tudominio.com
   ```

### Resend - 100 emails/día (más moderno)
1. Registrate en https://resend.com/
2. Genera un API Key
3. Configura en `.env`:
   ```env
   EMAIL_SERVICE=resend
   RESEND_API_KEY=re_xxxxxxxxxx
   EMAIL_FROM=notificaciones@tudominio.com
   ```

---

## ✅ Checklist Final

- [ ] Cuenta de SendGrid creada
- [ ] Email verificado
- [ ] API Key creada y copiada
- [ ] `.env` configurado con `SENDGRID_API_KEY`
- [ ] `EMAIL_FROM` configurado
- [ ] `npm install` ejecutado
- [ ] `npm run test:notifications` ejecutado exitosamente
- [ ] 3 emails recibidos en tu bandeja

---

## 🎉 ¡Listo!

Ahora tienes un sistema de emails funcional **sin necesidad de**:
- ❌ Verificación en 2 pasos
- ❌ Número de teléfono
- ❌ Configuración compleja
- ❌ Infraestructura propia

**Solo necesitaste**:
- ✅ Un email para registrarte
- ✅ 5 minutos de configuración
- ✅ Copiar una API Key

---

## 📞 Siguiente Paso

Continúa con el **[CHECKLIST.md](../CHECKLIST.md)** en el paso 4 (Configuración de Firebase).

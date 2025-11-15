# Guía de Despliegue - Sistema de Gestión de Suscripciones

## Información del Servidor

```
IP: 172.105.21.15
Usuario: root
Password: ##info229uach
Conexión: ssh root@172.105.21.15
```

---

## Objetivo

Desplegar la API en el servidor para que **otros equipos puedan consumir los endpoints**.

**URL de la API:** `http://172.105.21.15:3000/api`

---

## PASO 1: Preparar el Servidor

### 1.1 Conectarse al Servidor

Desde tu terminal:

```bash
ssh root@172.105.21.15
# Password: ##info229uach
```

### 1.2 Instalar Docker

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install curl wget git -y

# Instalar Docker y Docker Compose
sudo apt install docker.io docker-compose -y

# Habilitar Docker
sudo systemctl enable --now docker

# Verificar instalación
docker --version
docker-compose --version
```

**Salida esperada:**
```
Docker version 24.x.x
docker-compose version 1.29.x
```

---

## PASO 2: Clonar el Proyecto en el Servidor

```bash
# Ir al directorio de proyectos
cd /opt

# Clonar el repositorio
git clone https://github.com/sophiasearch-2025/user-subscription-manager.git

# Entrar al directorio
cd user-subscription-manager

# Cambiar a la branch correcta
git checkout merge-main-basedatos

# Verificar que estás en la branch correcta
git branch
```

---

## PASO 3: Configurar Variables de Entorno

### 3.1 Crear archivo .env en el servidor

```bash
nano .env
```

### 3.2 Pegar esta configuración:

```bash
# Configuración de la aplicación
NODE_ENV=production
PORT=3000
SECRET_KEY=tu-clave-super-secreta-cambiala-123456

# Firebase
FIREBASE_PROJECT_ID=tu-proyecto-firebase-id

# Servicio de Email - Resend
EMAIL_SERVICE=resend
RESEND_API_KEY=re_CDuyapBZ_J4RxAwxocXRnpJFmc5HRCsjp
EMAIL_FROM=onboarding@resend.dev

# Stripe (si lo usas)
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# URLs
FRONTEND_URL=http://172.105.21.15:3000
```

**Guardar:** `Ctrl + X` → `Y` → `Enter`

---

## PASO 4: Subir Credenciales de Firebase

Necesitas el archivo `serviceAccountKey.json` en el servidor.

### Opción A: Copiar desde tu máquina (RECOMENDADO)

Abre una **nueva terminal en tu máquina local** (no en el servidor):

```bash
# Navega a donde tienes el archivo
cd /Users/francisco/github/user-subscription-manager

# Copia el archivo al servidor
scp serviceAccountKey.json root@172.105.21.15:/opt/user-subscription-manager/
```

### Opción B: Crear manualmente en el servidor

```bash
# En el servidor
nano serviceAccountKey.json
# Pega el contenido completo
# Guardar: Ctrl+X → Y → Enter
```

---

## PASO 5: Desplegar con Docker

```bash
# Asegúrate de estar en el directorio del proyecto
cd /opt/user-subscription-manager

# Construir la imagen Docker
docker-compose build

# Levantar los contenedores
docker-compose up -d

# Ver el estado
docker-compose ps
```

**Salida esperada:**
```
NAME                 STATUS          PORTS
subscription-api     Up 30 seconds   0.0.0.0:3000->3000/tcp
```

---

## PASO 6: Verificar que Funciona

### 6.1 Ver logs

```bash
# Ver logs en tiempo real
docker-compose logs -f api

# Busca esta línea:
# Servidor corriendo en puerto 3000
```

### 6.2 Probar desde el servidor

```bash
curl http://localhost:3000/api/subscriptions
```

### 6.3 Probar desde tu máquina local

Abre una terminal en tu máquina:

```bash
curl http://172.105.21.15:3000/api/subscriptions
```

### 6.4 Probar desde el navegador

Abre: `http://172.105.21.15:3000/api/subscriptions`

---

## Endpoints Disponibles para Otros Equipos

### Base URL
```
http://172.105.21.15:3000/api
```

### Endpoints Principales

#### Usuarios

```bash
# Listar usuarios
GET http://172.105.21.15:3000/api/users

# Obtener usuario específico
GET http://172.105.21.15:3000/api/users/:uid

# Crear usuario
POST http://172.105.21.15:3000/api/users
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "name": "Usuario Ejemplo",
  "company": "Empresa S.A."
}

# Actualizar usuario
PUT http://172.105.21.15:3000/api/users/:uid

# Eliminar usuario
DELETE http://172.105.21.15:3000/api/users/:uid
```

#### Suscripciones

```bash
# Listar todas las suscripciones
GET http://172.105.21.15:3000/api/subscriptions

# Ver una suscripción específica
GET http://172.105.21.15:3000/api/subscriptions/:id

# Obtener suscripciones de un usuario
GET http://172.105.21.15:3000/api/subscriptions/user/:userId

# Crear nueva suscripción
POST http://172.105.21.15:3000/api/subscriptions
Content-Type: application/json

{
  "userId": "user123",
  "planId": "plan_premium",
  "userEmail": "usuario@ejemplo.com",
  "userName": "Usuario Ejemplo",
  "planName": "Plan Premium"
}

# Actualizar suscripción
PUT http://172.105.21.15:3000/api/subscriptions/:id

# Renovar suscripción
POST http://172.105.21.15:3000/api/subscriptions/:id/renew

# Eliminar suscripción
DELETE http://172.105.21.15:3000/api/subscriptions/:id
```

#### Pagos

```bash
# Listar pagos
GET http://172.105.21.15:3000/api/payments

# Obtener pago específico
GET http://172.105.21.15:3000/api/payments/:id

# Obtener pagos de un usuario
GET http://172.105.21.15:3000/api/payments/user/:userId

# Crear pago
POST http://172.105.21.15:3000/api/payments

# Webhook de Stripe
POST http://172.105.21.15:3000/api/payments/webhook/stripe
```

#### Scheduler (Tareas Programadas)

```bash
# Ejecutar todas las verificaciones
POST http://172.105.21.15:3000/api/scheduler/run

# Verificar suscripciones próximas a vencer
POST http://172.105.21.15:3000/api/scheduler/check-expiring

# Marcar suscripciones expiradas
POST http://172.105.21.15:3000/api/scheduler/check-expired
```

#### Health Check

```bash
# Verificar estado de la API
GET http://172.105.21.15:3000/api/health
```

---

## Actualizar el Código (cuando hagas cambios)

Cuando modifiques tu código y lo subas a GitHub:

```bash
# 1. Conectarse al servidor
ssh root@172.105.21.15

# 2. Ir al proyecto
cd /opt/user-subscription-manager

# 3. Bajar cambios
git pull origin merge-main-basedatos

# 4. Reconstruir y reiniciar
docker-compose down
docker-compose build
docker-compose up -d

# 5. Verificar
docker-compose logs -f api
```

---

## Comandos Útiles

### Ver estado de contenedores
```bash
docker-compose ps
```

### Ver logs
```bash
# Tiempo real
docker-compose logs -f api

# Últimas 100 líneas
docker-compose logs --tail=100 api
```

### Reiniciar
```bash
# Reiniciar solo la API
docker-compose restart api

# Reiniciar todo
docker-compose restart
```

### Detener
```bash
# Detener (no borra)
docker-compose stop

# Detener y borrar
docker-compose down
```

### Ejecutar comandos dentro del contenedor
```bash
# Abrir terminal
docker-compose exec api sh

# Ejecutar comando específico
docker-compose exec api npm run seed
```

---

## Solución de Problemas

### Puerto 3000 ya en uso

```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### No se puede conectar a Docker

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Ver logs de error

```bash
docker-compose logs api
docker logs subscription-api
```

### Contenedor se detiene inmediatamente

```bash
# Ver qué pasó
docker-compose logs api

# Ver estado detallado
docker inspect subscription-api
```

### Firewall bloqueando el puerto

```bash
# Ubuntu/Debian
sudo ufw allow 3000/tcp
sudo ufw reload

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

## Checklist Final

Antes de hablar con tu profesor, verifica:

- [ ] Conectado al servidor vía SSH
- [ ] Docker instalado y funcionando
- [ ] Proyecto clonado en `/opt/user-subscription-manager`
- [ ] Archivo `.env` configurado
- [ ] `serviceAccountKey.json` en el servidor
- [ ] `docker-compose up -d` ejecutado
- [ ] Contenedor corriendo (`docker-compose ps`)
- [ ] API responde: `curl http://172.105.21.15:3000/api/subscriptions`
- [ ] Sin errores en logs: `docker-compose logs api`

---

## Preguntas para el Profesor

Cuando hables con tu profesor, pregunta sobre:

1. **Dominio**: ¿Usaremos un dominio (api.proyecto.com) en lugar de IP?
2. **HTTPS**: ¿Necesitamos certificado SSL?
3. **Firewall**: ¿Qué puertos abrir/cerrar?
4. **Monitoreo**: ¿Cómo monitorear la API en producción?
5. **CI/CD**: ¿Deploy automático desde GitHub?
6. **Base de datos**: ¿Firebase en producción o cambiar a PostgreSQL?

---

## Para Compartir con Otros Equipos

Comparte esta información con otros equipos:

```
API de Gestión de Usuarios y Suscripciones

Base URL: http://172.105.21.15:3000/api

Endpoints disponibles:
• GET  /users               - Listar usuarios
• GET  /users/:uid          - Obtener usuario
• POST /users               - Crear usuario
• GET  /subscriptions       - Listar suscripciones
• GET  /subscriptions/:id   - Ver suscripción
• POST /subscriptions       - Crear suscripción
• PUT  /subscriptions/:id   - Actualizar suscripción
• GET  /payments            - Listar pagos
• POST /scheduler/run       - Ejecutar verificaciones

Ejemplo de request:
curl -X POST http://172.105.21.15:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user123",
    "planId":"plan_premium",
    "userEmail":"usuario@ejemplo.com",
    "userName":"Usuario Ejemplo",
    "planName":"Plan Premium"
  }'

Documentación completa: Ver README.md del proyecto
```

---

## Requisitos del Sistema

### Software necesario en el servidor

| Herramienta | Versión | Descripción |
|-------------|---------|-------------|
| **Sistema operativo** | Ubuntu 20.04+ | Entorno base para ejecución |
| **Docker** | 24.x+ | Containerización |
| **Docker Compose** | 1.29.x+ | Orquestación de contenedores |
| **Git** | 2.x+ | Control de versiones |

### Infraestructura mínima

- **CPU:** 2 núcleos o superior  
- **RAM:** 2 GB mínimo (4 GB recomendado)  
- **Almacenamiento:** 5 GB libres para Docker y dependencias  
- **Conectividad:** Acceso a internet para instalación de paquetes

---

**Última actualización:** 14 de noviembre de 2025


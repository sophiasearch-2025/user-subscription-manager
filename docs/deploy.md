# Despliegue del subsistema user-subscription-manager

El propósito de este subsistema es **administrar las cuentas, roles y accesos de los usuarios**, así como la **gestión de planes de suscripción y pagos** dentro del software de noticias de prensa.  
Este módulo permite garantizar una administración centralizada y segura de usuarios, manteniendo la integridad de la información y facilitando la integración con otros subsistemas.

---
## 1. Requisitos

### 1.1 Software necesario

| Herramienta | Versión recomendada | Descripción |
|--------------|--------------------|--------------|
| **Sistema operativo** | Ubuntu 20.04+, macOS 12+, Windows 10+ | Entorno base para ejecución local o en servidor. |
| **Node.js** | ≥ 16.x | Entorno de ejecución del backend. |
| **npm / Yarn** | Última estable | Instalación de dependencias y ejecución de scripts. |
| **PostgreSQL** | ≥ 13.x | Base de datos para almacenamiento de usuarios y suscripciones. |
| **Git** | ≥ 2.x | Clonación del repositorio y control de versiones. |
| **Docker / Docker Compose** *(opcional)* | Última estable | Alternativa para despliegue en contenedores. |

---

### 1.2 Infraestructura mínima

- **CPU:** 2 núcleos o superior  
- **RAM:** 2 GB mínimo (4 GB recomendado)  
- **Almacenamiento:** 2 GB libres para dependencias y base de datos  
- **Conectividad:** acceso a internet para instalación de paquetes y APIs externas

---
## 2. Instalación y configuración

### 2.1 Clonación del repositorio

Clona el repositorio oficial desde GitHub en tu entorno local o servidor:

```bash
git clone https://github.com/sophiasearch-2025/user-subscription-manager.git
cd user-subscription-manager
```

---
### 2.2 Instalación de dependencias

Instala las dependencias necesarias con **npm** o **yarn** según tu entorno de trabajo:

```bash
npm install
# o
yarn install
```

---
## 3. Despliegue / Ejecución

Para iniciar el proyecto en modo desarrollo:

```bash
npm run dev
```

Para ejecutar en modo producción:

```bash
npm run build
npm start
```

El servidor se ejecutará por defecto en:

```
http://localhost:3000
```

---
## 4. Pruebas y verificaciones

### 4.1 Verificación del servicio

Ejecuta el servidor (modo desarrollo o producción) y confirma que esté en funcionamiento:

```bash
npm run dev
# o en producción
npm start
```

Luego, abre tu navegador o usa `cURL` para acceder al endpoint principal:

```bash
curl http://localhost:3000/health
```

**Resultado esperado:**

```json
{
  "status": "ok",
  "message": "user-subscription-manager running"
}
```

---
### 4.2 Verificación de conexión a la base de datos

Comprueba en los logs de la consola que la conexión a PostgreSQL se estableció con éxito.  
Deberías ver un mensaje similar a:

```
Database connection established successfully
```

Si hay errores, revisa las credenciales configuradas en el archivo `.env` y asegúrate de que el servicio de PostgreSQL esté corriendo.

---
### 4.3 Prueba de creación de usuario

Envía una solicitud **POST** al endpoint de creación de usuario (por ejemplo):

```bash
curl -X POST http://localhost:3000/api/users   -H "Content-Type: application/json"   -d '{
    "name": "Usuario Prueba",
    "email": "usuario@ejemplo.com",
    "password": "123456"
  }'
```

**Respuesta esperada:**

```json
{
  "message": "User created successfully",
  "userId": 1
}
```

---
### 4.4 Prueba de suscripción

Verifica que se puedan crear y listar planes de suscripción.  
Ejemplo de solicitud **GET**:

```bash
curl http://localhost:3000/api/subscriptions
```

La respuesta debe mostrar los planes disponibles o las suscripciones activas del usuario.

---
### 4.5 Verificación del envío de correos

Si tienes configurado el servicio SMTP en el `.env`, prueba el envío de notificaciones (por ejemplo, al crear un nuevo usuario o suscripción).  
Revisa el buzón del correo destinatario y los logs del servidor:

```bash
tail -f logs/app.log
```


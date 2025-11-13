# Arquitectura del Sistema de Notificaciones

## 📐 Visión General

El sistema implementa un patrón de **arquitectura orientada a eventos** usando RabbitMQ como broker de mensajería para desacoplar el envío de notificaciones por email del flujo principal de la aplicación.

## 🏗️ Componentes

### 1. API REST (Node.js + Express)
- **Puerto**: 3000
- **Responsabilidades**:
  - Recibir peticiones HTTP
  - Ejecutar lógica de negocio
  - **Publicar mensajes** a la cola de RabbitMQ
  - Responder inmediatamente al cliente (sin esperar el email)

### 2. RabbitMQ
- **Puerto AMQP**: 5672 (conexión desde código)
- **Puerto Management**: 15672 (interfaz web)
- **Responsabilidades**:
  - Recibir mensajes de la API
  - Almacenar mensajes en cola persistente
  - Distribuir mensajes al worker
  - Reintentar en caso de fallos

### 3. Email Worker
- **Tipo**: Proceso independiente (microservicio)
- **Responsabilidades**:
  - Consumir mensajes de la cola
  - Generar HTML del email según el tipo
  - Enviar email usando Nodemailer
  - Confirmar procesamiento (ACK) o rechazar (NACK)

### 4. Firebase (Firestore)
- **Uso**: Base de datos para almacenar usuarios y suscripciones
- **No incluido en Docker**: Servicio externo de Google

## 🔄 Flujo de Notificaciones

### Caso 1: Nueva Suscripción

```
Cliente HTTP
    ↓
[POST /api/subscriptions]
    ↓
Controller crea suscripción en Firebase
    ↓
Controller publica mensaje a RabbitMQ
    ↓
Response 201 Created (inmediato)

--- Asíncrono ---

RabbitMQ guarda mensaje en cola
    ↓
Email Worker consume mensaje
    ↓
Worker genera HTML del email
    ↓
Worker envía email vía SMTP
    ↓
Worker confirma (ACK) a RabbitMQ
    ↓
Usuario recibe email
```

### Caso 2: Plan Próximo a Vencer

```
Cron Job o Scheduler
    ↓
[POST /api/subscriptions/check-expiring]
    ↓
Controller consulta Firebase
    ↓
Por cada suscripción próxima a vencer:
    ↓
    Publica mensaje a RabbitMQ
    ↓
    (El resto es igual al Caso 1)
```

## 📦 Estructura de Mensajes

### Mensaje en RabbitMQ (JSON)

```json
{
  "type": "SUBSCRIPTION_RECEIVED | PLAN_EXPIRING | PLAN_RENEWED",
  "to": "usuario@example.com",
  "subject": "Asunto del email",
  "data": {
    "userName": "Juan Pérez",
    "planName": "Plan Premium",
    "subscriptionId": "sub_12345",
    "expirationDate": "2025-12-01T00:00:00Z",
    "daysRemaining": 7,
    "timestamp": "2025-11-03T12:00:00Z"
  }
}
```

## 🎯 Ventajas de Esta Arquitectura

### 1. **Desacoplamiento**
- La API no espera a que se envíe el email
- Respuesta rápida al usuario (< 100ms)
- El worker puede estar en otro servidor

### 2. **Tolerancia a Fallos**
- Si el servicio de email falla, el mensaje queda en cola
- Se reintenta automáticamente
- No se pierden notificaciones

### 3. **Escalabilidad**
- Puedes tener múltiples workers procesando en paralelo
- La cola actúa como buffer en picos de tráfico

### 4. **Observabilidad**
- Interfaz web de RabbitMQ para monitorear colas
- Logs separados por servicio
- Métricas de mensajes procesados

## 🔐 Seguridad

### Variables de Entorno
- Todas las credenciales en `.env`
- Nunca commitear `.env` al repositorio
- Usar `.env.example` como plantilla

### Rate Limiting
- Límite de 100 requests por IP cada 15 minutos
- Protege contra spam de notificaciones

### SMTP Seguro
- Conexión TLS/STARTTLS
- Usar contraseñas de aplicación (no password real)

## 📊 Monitoreo

### RabbitMQ Management UI
```
http://localhost:15672
Usuario: admin
Password: rabbitmq123
```

**Qué monitorear:**
- Número de mensajes en cola
- Tasa de mensajes/segundo
- Mensajes sin ACK
- Conexiones activas

### Logs
```bash
# Ver logs del worker
docker-compose logs -f email-worker

# Ver logs de la API
docker-compose logs -f api

# Ver logs de RabbitMQ
docker-compose logs -f rabbitmq
```

## 🚀 Despliegue en Producción

### Consideraciones

1. **RabbitMQ**
   - Usar RabbitMQ como servicio (CloudAMQP, AWS MQ)
   - Configurar clustering para alta disponibilidad
   - Habilitar persistencia de mensajes

2. **Email Worker**
   - Desplegar en múltiples instancias
   - Usar Docker Swarm o Kubernetes
   - Configurar auto-scaling según la cola

3. **Email Service**
   - Usar servicio profesional (SendGrid, AWS SES, Mailgun)
   - Mejor deliverability que Gmail
   - Mejor tracking y analytics

4. **Monitoreo**
   - Integrar con Prometheus + Grafana
   - Alertas cuando la cola crece mucho
   - Logs centralizados (ELK Stack)

## 🔄 Cron Jobs Recomendados

### Verificar Planes que Vencen
```bash
# Ejecutar diariamente a las 9 AM
0 9 * * * curl -X POST http://api:3000/api/subscriptions/check-expiring
```

### Opciones de Implementación:
1. **Node-cron** (dentro de la API)
2. **Cron de Linux** (si despliegas en servidor)
3. **AWS EventBridge** (si usas AWS)
4. **Cloud Scheduler** (si usas GCP)

## 📚 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 18+ | Runtime de JavaScript |
| Express | 4.x | Framework web |
| RabbitMQ | 3.12 | Message broker |
| amqplib | 0.10 | Cliente de RabbitMQ |
| Nodemailer | 6.x | Envío de emails |
| Firebase Admin | 12.x | SDK de Firebase |
| Docker | 24+ | Containerización |

## 🧪 Testing

### Prueba Manual
```bash
./test-notifications.sh
```

### Tests Unitarios (TODO)
```javascript
// src/tests/subscription.test.js
describe('Subscription Controller', () => {
  it('should send notification when creating subscription', async () => {
    // Mockear RabbitMQ
    // Llamar a createSubscription
    // Verificar que se publicó mensaje
  });
});
```

## 🐛 Troubleshooting Común

### "Connection refused to RabbitMQ"
**Solución**: Espera 10-15 segundos después de `docker-compose up`. RabbitMQ tarda en iniciar.

### "Email not sent"
**Verificar**:
1. Variables `SMTP_USER` y `SMTP_PASS` correctas
2. Gmail: Usar contraseña de aplicación
3. Verificar logs del worker: `docker-compose logs email-worker`

### "Message stuck in queue"
**Causas**:
1. Worker no está corriendo
2. Error al procesar mensaje (ver logs)
3. SMTP bloqueando conexión

**Solución**: 
- Reiniciar worker: `docker-compose restart email-worker`
- Purgar cola desde Management UI si es necesario

## 📖 Referencias

- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Docker Compose Reference](https://docs.docker.com/compose/)


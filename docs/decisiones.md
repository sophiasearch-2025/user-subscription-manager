# Decisiones importantes del subsistema user-subscription-manager

Este documento registra las **decisiones técnicas y de diseño** más relevantes tomadas durante el desarrollo del subsistema **user-subscription-manager** del ecosistema **SophiaSearch-2025**.  
Su propósito es proporcionar trazabilidad y justificación de los cambios que afectan la arquitectura, la implementación y la integración con otros módulos.

---

## 1. Elección del entorno tecnológico

| Decisión | Descripción | Motivo | Fecha | Estado |
|-----------|--------------|--------|--------|--------|
| **Uso de Node.js + Express.js** | Se decidió implementar la API del subsistema con Node.js y Express.js. | Permite un desarrollo ágil, escalabilidad, buena integración con servicios externos (Stripe, SMTP) y compatibilidad con los demás subsistemas. | 2025-10-20 | Aprobado |
| **Base de datos PostgreSQL** | Se seleccionó PostgreSQL como motor de base de datos principal. | Soporta relaciones, transacciones seguras y extensiones JSON, ideal para gestionar usuarios y suscripciones. | 2025-10-21 | Aprobado |
| **Lenguaje JavaScript / TypeScript (en futuras versiones)** | Se inició con JavaScript, con posibilidad de migrar a TypeScript. | Facilita el desarrollo inicial y luego garantiza tipado fuerte para mantenibilidad. | 2025-10-25 | En evaluación |

---

## 2. Arquitectura y diseño del sistema

| Decisión | Descripción | Motivo | Fecha | Estado |
|-----------|--------------|--------|--------|--------|
| **Arquitectura modular basada en servicios** | Dividir la aplicación en servicios: `User Service`, `Subscription Service`, `Notification Service`, `Payment Service`. | Facilita el mantenimiento, escalabilidad y la futura transición a microservicios. | 2025-10-30 | Aprobado |
| **Integración con Stripe para pagos** | Uso de la API de Stripe para gestionar pagos y renovaciones automáticas. | Evita desarrollar un sistema de pagos desde cero y garantiza seguridad y cumplimiento normativo. | 2025-11-02 | Aprobado |
| **Autenticación mediante JWT** | Implementar tokens JWT para la autenticación y autorización de usuarios. | Es un estándar seguro y ligero para servicios RESTful. | 2025-11-03 | Aprobado |
| **Notificaciones con servicio SMTP externo** | Uso de un proveedor de correo (SendGrid / Mailgun). | Centraliza el envío de correos y mejora la confiabilidad. | 2025-11-05 | Aprobado |

---

## 3. Integración con otros subsistemas

| Decisión | Descripción | Motivo | Fecha | Estado |
|-----------|--------------|--------|--------|--------|
| **Comunicación vía API REST** | Interacción con `admin-interface`, `user-interface` y `data-storage-manager` mediante endpoints REST. | Mantiene independencia entre módulos y facilita la escalabilidad. | 2025-11-06 | Aprobado |
| **Definición de endpoints comunes** | Estandarizar las rutas REST para compatibilidad entre subsistemas. | Mejora la interoperabilidad y reduce errores de integración. | 2025-11-07 | Aprobado |
| **Gestión centralizada de usuarios** | El `user-subscription-manager` será el único responsable de la gestión de usuarios. | Evita duplicidad y mejora la seguridad. | 2025-11-08 | Aprobado |

---

## 4. Seguridad y manejo de datos

| Decisión | Descripción | Motivo | Fecha | Estado |
|-----------|--------------|--------|--------|--------|
| **Cifrado de contraseñas con bcrypt** | Las contraseñas se almacenan cifradas antes de guardarse en la base de datos. | Cumple buenas prácticas de seguridad. | 2025-11-09 | Aprobado |
| **Variables sensibles en archivo .env** | Toda la configuración sensible se almacena en variables de entorno. | Mejora la seguridad y evita exponer credenciales en el código. | 2025-11-09 | Aprobado |
| **Uso de HTTPS en producción** | Todo el tráfico hacia la API debe estar cifrado con HTTPS. | Protege la transmisión de datos sensibles. | 2025-11-10 | Aprobado |

---

## 5. Decisiones futuras (planeadas para v1.0)

| Decisión | Descripción | Motivo | Estado |
|-----------|--------------|--------|--------|
| **Implementación de reportes automáticos** | Generar reportes de usuarios y pagos en tiempo real. | Mejora la trazabilidad del sistema. | En desarrollo |
| **Sistema de auditoría y monitoreo** | Registro centralizado de logs y métricas del sistema. | Permite detectar fallas y evaluar rendimiento. |  Pendiente |
| **Migración a microservicios** | Separar cada servicio en contenedores independientes (Docker / Kubernetes). | Aumenta la escalabilidad y disponibilidad. | Pendiente |

---

## 6. Resumen de impacto de decisiones

| Área | Decisiones que afectan | Impacto |
|------|------------------------|----------|
| **Backend** | Node.js, Express, JWT, PostgreSQL | Aumenta la modularidad y seguridad. |
| **Infraestructura** | Docker, entorno .env, HTTPS | Mejora la portabilidad y despliegue. |
| **Integración externa** | Stripe, SMTP, APIs REST | Facilita la interoperabilidad con servicios externos. |
| **Seguridad** | Cifrado, tokens, logs, HTTPS | Refuerza la protección de datos. |

---


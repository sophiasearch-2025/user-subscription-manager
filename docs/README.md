# User Subscription Manager

## 1. Propósito

El propósito de este subsistema es **administrar las cuentas, roles y accesos de los usuarios**, así como la **gestión de planes de suscripción y pagos** dentro del software de noticias de prensa.  
Este módulo permite garantizar una administración centralizada y segura de usuarios, manteniendo la integridad de la información y facilitando la integración con otros subsistemas.

---

## 2. Interacción con otros subsistemas

El **User Subscription Manager** interactúa con los siguientes componentes del ecosistema **SophiaSearch-2025**:

- **admin-interface:** Entrega el listado de usuarios registrados.

- **user-interface:** Entrega de los tipos de usuarios y los términos y condiciones de uso.

---

## 3. Documentación interna

La documentación técnica y operativa del subsistema se encuentra distribuida en los siguientes archivos:

- [Arquitectura del subsistema](./architecture.md)  
  Descripción de la estructura del sistema, diagramas de componentes, API y organización del repositorio.

- [Requisitos del sistema](./requirements.md)  
  Detalle de requerimientos funcionales y no funcionales del subsistema.

- [Despliegue](./deploy.md)  
  Instrucciones para la instalación, configuración y ejecución del subsistema.

- [Endpoints](./API-ENDPOINTS.md)  
  Instrucciones del uso de la API.
  
- [Decisiones](./decisiones.md)  
  Decisiones mas importantes tomadas para este trabajo.

---

## 4. Estado del subsistema

**Funcionalidades completadas:**
- Gestión de usuarios  
- Gestión de suscripciones  
- Notificaciones por correo electrónico 
- Endpoints de Suscripciones

**En desarrollo:**
- Sistema de pagos con Stripe  

---

## Repositorios relacionados

- [media-data-collector](https://github.com/sophiasearch-2025/media-data-collector)  
- [admin-interface](https://github.com/sophiasearch-2025/admin-interface)  
- [user-interface](https://github.com/sophiasearch-2025/user-interface)  
- [data-storage-manager](https://github.com/sophiasearch-2025/data-storage-manager)  
- [news-query-analysis](https://github.com/sophiasearch-2025/news-query-analysis)

# Requisitos del subsistema user-subscription-manager

## Requisitos funcionales

| ID | Requisito funcional | Descripción |
|----|---------------------|--------------|
| RF-01 | **Registro de usuario** | El sistema debe permitir el registro de nuevos usuarios con datos básicos (nombre, correo, contraseña, etc). |
| RF-02 | **Autenticación de usuario** | El sistema debe permitir que los usuarios inicien sesión mediante correo y contraseña. |
| RF-03 | **Gestión de roles** | El sistema debe asignar roles a los usuarios (por ejemplo: lector, editor, administrador). |
| RF-04 | **Gestión de suscripciones** | El sistema debe permitir crear, editar y eliminar planes de suscripción. |
| RF-05 | **Asignación de plan a usuario** | El sistema debe permitir asignar un plan de suscripción a un usuario. |
| RF-06 | **Notificaciones por correo** | El sistema debe enviar notificaciones por correo electrónico (confirmaciones, renovaciones, alertas). |
| RF-07 | **Procesamiento de pagos** | El sistema debe integrarse con Stripe para realizar cobros automáticos y mantener registros de pago. |
| RF-08 | **Consulta de usuarios** | El sistema debe permitir consultar la lista de usuarios registrados. |
| RF-09 | **Consulta de suscripciones activas** | El sistema debe mostrar las suscripciones activas por usuario. |
| RF-10 | **Integración con otros subsistemas** | Debe exponer endpoints REST que permitan el consumo por otros módulos (ej. admin-interface, news-query-analysis). |

---

## Requisitos no funcionales

| ID | Requisito no funcional | Descripción |
|----|------------------------|-------------|
| RNF-01 | **Disponibilidad** | El sistema debe estar disponible al menos el 99% del tiempo. |
| RNF-02 | **Seguridad** | Todas las contraseñas deben almacenarse en formato cifrado (bcrypt o similar). |
| RNF-03 | **Escalabilidad** | Debe soportar la incorporación de nuevos usuarios y suscripciones sin afectar el rendimiento. |
| RNF-04 | **Rendimiento** | Las respuestas de la API deben tener un tiempo de respuesta menor a 300 ms en promedio. |
| RNF-05 | **Compatibilidad** | El subsistema debe ser compatible con Node.js 16+ y PostgreSQL 13+. |
| RNF-06 | **Mantenibilidad** | El código debe seguir estándares de documentación y buenas prácticas de arquitectura. |
| RNF-07 | **Interoperabilidad** | Debe comunicarse con otros subsistemas mediante API REST y autenticación con tokens JWT. |
| RNF-08 | **Confiabilidad** | En caso de error, el sistema debe registrar logs y permitir recuperación de sesiones. |
| RNF-09 | **Usabilidad** | La API debe ofrecer mensajes claros de error y éxito en formato JSON. |
| RNF-10 | **Privacidad** | Debe cumplir con normas de protección de datos y privacidad del usuario. |


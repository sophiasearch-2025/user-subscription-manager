# 📥 Protocolo Consolidado de Integración y Despliegue (Local y Remoto)

Este documento describe los pasos de puesta en marcha para los siguientes subsistemas:

- **User Interface (Frontend)**
- **Admin Interface (Frontend)**
- **Data Storage Manager (API / Base de Datos)**

**Servidor Principal:** `172.105.21.15`  
**Red Docker:** `red_arqui` (comunicación interna entre contenedores)

---

## 📌 Requisitos Mínimos Comunes

| Software | Versión mínima recomendada | Utilizado por |
|--------|---------------------------|---------------|
| **Node.js** | v18.0 o superior | Admin Interface, User Interface |
| **npm** | v8.0 o superior | Admin Interface, User Interface |
| **Docker** | Versión reciente | Todos |
| **Docker Compose** | Versión reciente | Todos |
| **Git** | Versión reciente | Todos |
| **Python** | Python 3 | Data Storage Manager (scripts de ingesta) |

---

## 1. Data Storage Manager (Base de Datos y API de Ingesta)

Este subsistema utiliza los siguientes servicios, orquestados mediante **Docker Compose**:

- PostgreSQL
- Elasticsearch
- RabbitMQ
- API de Ingesta
- Workers de procesamiento

### A. Prueba Local (Docker Compose)

1. Clonar el repositorio:

```bash
git clone https://github.com/sophiasearch-2025/data-storage-manager.git
cd data-storage-manager
```

2. Iniciar todos los servicios en modo *detached*:

```bash
docker-compose up -d
```

3. Verificación de servicios (entorno local):

| Servicio | URL Local | Credenciales |
|--------|----------|--------------|
| API Ingesta | http://localhost:8080 | N/A |
| RabbitMQ Management | http://localhost:15672 | guest / guest |
| PostgreSQL | localhost:5432 | postgres / postgres123 |

4. Ingestar datos (usando Python 3):

```bash
python3 scripts/ingest_output.py /ruta/a/output.json
```

---

### B. Despliegue en Servidor (172.105.21.15)

1. Acceder al servidor:

```bash
ssh root@172.105.21.15
```

2. Clonar el repositorio y levantar los servicios:

```bash
git clone https://github.com/sophiasearch-2025/data-storage-manager.git
cd data-storage-manager/[carpeta_docker]
sudo docker-compose up -d
```

---

## 2. Admin Interface (Interfaz de Administración)

Frontend de gestión desarrollado con **Next.js**, desplegado mediante Docker.

### A. Prueba Local (Docker Compose)

1. Clonar el repositorio:

```bash
git clone https://github.com/sophiasearch-2025/admin-interface.git
cd admin-interface
```

2. Crear la red Docker (si no existe):

```bash
docker network create red_arqui
```

3. Construir y ejecutar el contenedor:

```bash
docker-compose up -d --build
```

4. Verificación (local o remota):

- URL: `http://172.105.21.15:3003`
- Credenciales de prueba:
  - `admin / admin123`
  - `test / test`

---

### B. Despliegue en Servidor (172.105.21.15)

1. Acceder al servidor y clonar el repositorio:

```bash
ssh root@172.105.21.15
git clone https://github.com/sophiasearch-2025/admin-interface.git
cd admin-interface
```

2. Levantar el contenedor:

```bash
docker network create red_arqui  # Opcional, si no existe
sudo docker-compose up -d --build
```

---

## 3. User Interface (Interfaz Web de Usuario)

Frontend principal de búsqueda desarrollado con **Next.js / React**.

### A. Prueba Local (Servidor de Desarrollo)

1. Clonar el repositorio:

```bash
git clone https://github.com/sophiasearch-2025/user-interface.git
cd user-interface
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

4. Verificación:

- Abrir `http://localhost:3000` en el navegador

---

### B. Despliegue en Servidor (172.105.21.15)

1. Acceder al servidor y clonar el repositorio:

```bash
ssh root@172.105.21.15
git clone https://github.com/sophiasearch-2025/user-interface.git
cd user-interface
```

2. Levantar el componente (asumiendo configuración Docker en el repositorio):

```bash
sudo docker-compose up -d --build
```

3. Verificación:

- Acceder a `http://172.105.21.15:3000`

---

## 📎 Suposiciones y Convenciones Adoptadas

Dado que este documento corresponde a una **entrega formal académica** y algunos detalles técnicos aún no están definidos, se adoptan las siguientes suposiciones para mantener coherencia y completitud:

- **Puertos asumidos**: Los puertos mencionados en este documento (3000, 3003, 8080, 5432, 15672) se utilizan únicamente como **referencia estándar**, sin implicar una configuración definitiva.
- **Direcciones IP y URLs**: No se asume el uso obligatorio de direcciones específicas en entornos futuros. Las direcciones indicadas cumplen un rol ilustrativo.
- **Health checks**: Actualmente **no existen endpoints ni mecanismos de health check implementados** para los subsistemas.
- **Variables de entorno**: No se documentan variables `.env` debido a que no forman parte del alcance actual de la entrega.

---

## 🔄 Orden de Despliegue Recomendado

Para evitar dependencias no resueltas entre subsistemas, el orden de despliegue debe ser siempre el siguiente:

1. **Data Storage Manager (Backend)**  
   Base de datos, mensajería, API de ingesta y workers.

2. **Admin Interface (Frontend)**  
   Interfaz administrativa que depende del backend.

3. **User Interface (Frontend UI)**  
   Interfaz final de búsqueda para usuarios.

Este orden aplica tanto para **entornos locales** como para **despliegues remotos**.

---

## 📎 Notas Finales

- Todos los contenedores deben compartir la red Docker `red_arqui` para permitir la comunicación interna.
- El uso de `docker-compose` se considera suficiente para los fines del proyecto, sin requerir orquestadores adicionales.
- Este protocolo está diseñado como **documentación técnica formal**, no como guía de producción definitiva.


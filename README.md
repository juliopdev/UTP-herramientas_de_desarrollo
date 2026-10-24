# 🚀 BaaS Lite Platform

> **Proyecto Universitario:** Herramientas de Desarrollo — 8vo Ciclo  
> **Tema Central:** Colaboración en equipo, gestión de ramas concurrentes y resolución estratégica de conflictos en GitHub. 

---

## 📖 Descripción del Proyecto

**BaaS Lite** es una plataforma Backend-as-a-Service (BaaS) multi-tenant diseñada con una arquitectura ligera, desacoplada y enfocada en el flujo de trabajo colaborativo en Git. Permite la administración de organizaciones (tenants), colecciones dinámicas de datos, gestión de usuarios con roles y cálculo de reportes de consumo.

---

## 🌐 Proyecto Publicado

| | |
| :--- | :--- |
| **URL pública (Netlify)** | 👉 **<https://bass-lite.netlify.app>** *(se completa tras el primer deploy)* |
| **Health check** | `/api/health` |
| **Versión** | `v2.0.0` — Avance 2 |
| **Publicación** | Automática desde `main` (cada merge a `main` dispara un deploy en Netlify) |

> ⚠️ En Netlify la base SQLite vive en `/tmp` (disco efímero de la función serverless): se re-inicializa con `data/initialData.json` en cada arranque en frío. Es una demo; la persistencia real se obtiene ejecutando el proyecto en local.

---

## 🛠️ Stack Tecnológico

- **Entorno de Ejecución:** Node.js (ES Modules)
- **Framework Web:** Express
- **Motor de Vistas:** EJS
- **Estilos:** TailwindCSS (vía CDN)
- **Base de Datos:** SQLite 3 (`better-sqlite3`)
- **ORM:** Drizzle ORM (`drizzle-orm`)
- **Semillero de Datos:** JSON estructurado (`data/initialData.json`)
- **Publicación:** Netlify (Functions + `serverless-http`), despliegue continuo desde `main`

---

## 🌳 Arquitectura de Ramas (Total: 6 Ramas)

| Rama | Rol / Responsable | Módulo |
| :--- | :--- | :--- |
| `main` | **Producción / Release** | Rama base consolidada del proyecto. |
| `feat/owner-dashboard` | **Julio Pariona** | Panel Superadmin, salud de SQLite y métricas de plataforma. |
| `feat/tenant-management` | **Christian Muñoa** | Registro, activación, suspensión y listado de tenants. |
| `feat/tenant-data` | **Cristhian Palomino** | Almacén de colecciones y registros dinámicos no-code. |
| `feat/tenant-users` | **David Torre** | Gestión de usuarios por tenant, roles (Admin, Editor, Viewer). |
| `feat/tenant-reports` | **Geanpier Meza** | Reportes de consumo, métricas de almacenamiento y analítica. |

---

## ⚡ Instalación y Ejecución Local

Para levantar el proyecto en tu máquina:

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO> .

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start
```

El servidor estará disponible de inmediato en:
👉 **`http://localhost:3000`**

*(La base de datos SQLite `data/app.db` se creará e inicializará automáticamente con datos de prueba al arrancar el servidor por primera vez).*

---

## 🆕 Novedades del Avance 2 (`v2.0.0`)

**Flujo de trabajo y entrega**
- Pull Requests con revisión cruzada entre integrantes y aprobación antes de unir a `main`.
- Tablero Trello con tareas por responsable y espacio de comunicación del grupo (WhatsApp).
- Despliegue continuo en Netlify conectado al repositorio: se publica únicamente al unir cambios a `main`.
- Primera release etiquetada: `v2.0.0`.

**Funcionalidades incorporadas por módulo**

| Módulo | Responsable | Novedades |
| :--- | :--- | :--- |
| Owner / Dashboard | Julio Pariona | Métricas del sistema (`/api/health`: uptime, colecciones, tamaño de BD) y badge de modo superadmin en el navbar. |
| Tenants | Christian Muñoa | Suspensión/reactivación de tenants, listado ordenado por fecha y selector de organización en el navbar. |
| Datos | Cristhian Palomino | Inserción de registros en colecciones, controlador de consulta por colección y eliminación de colecciones. |
| Usuarios | David Torre | Actualización de rol, filtro por tenant y validación de email único por organización. |
| Reportes | Geanpier Meza | Resumen de consumo por tenant, exportación de reportes en JSON y reporte semilla `rep-002`. |

**Conflictos de merge resueltos** (conservando el código de ambas partes): `src/routes.js`, `src/config.js` y `views/partials/navbar.ejs`.

---

## ☁️ Despliegue en Netlify

1. Conectar el repositorio en Netlify (*Add new site → Import from Git*) y elegir la rama de producción `main`.
2. Netlify lee `netlify.toml` (no requiere comando de build ni variables adicionales).
3. Todas las rutas se redirigen a la función `netlify/functions/api.js`, que monta la misma app Express (`/`, `/api/health`, `/api/tenants`, `/api/data`, `/api/users`, `/api/reports`).

---

## 🔗 Endpoints Principales

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| GET | `/` | Dashboard Superadmin |
| GET | `/api/health` | Estado y métricas del sistema |
| GET | `/api/tenants` | Listar tenants |
| GET / POST | `/api/users` | Listar (filtro `?tenantId=`) / crear usuarios |
| GET | `/api/data/collections` | Listar colecciones |
| GET | `/api/reports` | Listar reportes |

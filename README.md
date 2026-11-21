# 🚀 BaaS Lite Platform

[![CI](https://github.com/juliopdev/UTP-herramientas_de_desarrollo/actions/workflows/ci.yml/badge.svg)](https://github.com/juliopdev/UTP-herramientas_de_desarrollo/actions/workflows/ci.yml)

> **Proyecto Universitario:** Herramientas de Desarrollo — 8vo Ciclo  
> **Tema Central:** Colaboración en equipo, gestión de ramas concurrentes y resolución estratégica de conflictos en GitHub. 

---

## 📖 Descripción del Proyecto

**BaaS Lite** es una plataforma Backend-as-a-Service (BaaS) multi-tenant diseñada con una arquitectura ligera, desacoplada y enfocada en el flujo de trabajo colaborativo en Git. Permite la administración de organizaciones (tenants), colecciones dinámicas de datos, gestión de usuarios con roles y cálculo de reportes de consumo.

---

## 🌐 Proyecto Publicado

| | |
| :--- | :--- |
| **URL pública (Netlify)** | 👉 **<https://bass-lite.netlify.app>** |
| **Health check** | `/api/health` |
| **Versión** | `v3.0.0` — Avance 3 (release etiquetado en GitHub) |
| **Publicación** | Automática desde `main` (cada merge a `main` dispara un deploy en Netlify) |

> ⚠️ En Netlify la base SQLite vive en `/tmp` (disco efímero de la función serverless): se re-inicializa con `data/initialData.json` en cada arranque en frío. Es una demo; la persistencia real se obtiene ejecutando el proyecto en local.

---

## 🛠️ Stack Tecnológico

- **Entorno de Ejecución:** Node.js 22+ (ES Modules)
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

Para levantar el proyecto en tu máquina (requiere **Node.js 22 o superior**):

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO> .

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start

# Verificación (la misma que ejecuta el CI)
npm run build
npm test
```

El servidor estará disponible de inmediato en:
👉 **`http://localhost:3000`**

*(La base de datos SQLite `data/app.db` se creará e inicializará automáticamente con datos de prueba al arrancar el servidor por primera vez).*

---

## 🆕 Novedades del Avance 3 (`v3.0.0`)

**Seguimiento de incidentes (GitHub Issues)**
- Pestaña Issues activada, con plantillas de formulario para **Reporte de error** y **Solicitud de mejora** (`.github/ISSUE_TEMPLATE/`).
- Etiquetas de tipo (`bug`, `enhancement`) y de prioridad (`P1-crítica`, `P2-alta`, `P3-media`, `P4-baja`); cada issue tiene un responsable y un comentario que justifica su prioridad.
- Cada corrección se hace en una rama `fix/issue-n` o `feat/issue-n` y su PR cierra el issue con `Closes #n`.

**Integración continua (GitHub Actions)**
- Workflow `.github/workflows/ci.yml`: en cada push y en cada PR hacia `main` ejecuta `npm install`, `npm run build` y `npm test` con Node 22 y 24.
- La regla «Proteger main» exige un PR con una aprobación y los dos checks del CI en verde antes de unir.

**Formularios de registro en el panel**: el panel superadmin ya no es solo de lectura; cada módulo tiene su formulario (tenants, usuarios, colecciones y reportes) que envía a la API y muestra el error si lo hay.

**Issues resueltos**

| Issue | Tipo / prioridad | Resumen | PR |
| :--- | :--- | :--- | :--- |
| #21 | Mejora · P2 | CI con build y pruebas en GitHub Actions | #22 |
| #23 | Bug · P3 | `/api/health` mostraba la versión `1.0.0` en vez de la de `package.json` | #24 |
| #25 | Mejora · P3 | Sección de formularios en el panel | #26 |
| #27 | Bug · P2 | `POST /api/reports/generate` inventaba `storageMb` y `apiCalls` | #31 |
| #28 | Bug · P3 | `POST /api/tenants` aceptaba subdominios con espacios o símbolos | #32 |
| #33 | Bug · P2 | `PATCH /api/users/:id/role` respondía 200 con un usuario inexistente | #41 |
| #38 | Bug · P1 | `GET /api/data/collections/:id/records` no estaba publicada (404) | #42 |
| #34 | Mejora · P3 | Formulario de tenants | #35 |
| #36 | Mejora · P3 | Formulario de reportes | #39 |
| #45 | Mejora · P3 | Formulario de usuarios | #43 |
| #46 | Mejora · P3 | Formulario de colecciones | #47 |

---

## 🆕 Novedades del Avance 2 (`v2.2.0`)

**Flujo de trabajo y entrega**
- Todo cambio de los integrantes llega a `main` mediante Pull Request, revisado y fusionado por el Owner.
- Tablero de seguimiento «Mesa» con tareas y reuniones por responsable, y grupo de WhatsApp como canal de comunicación.
- Despliegue continuo en Netlify conectado al repositorio: se publica únicamente desde la rama `main`.
- Primera release etiquetada: `v2.2.0`.

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

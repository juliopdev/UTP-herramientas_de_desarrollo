# 🚀 BaaS Lite Platform

> **Proyecto Universitario:** Herramientas de Desarrollo — 8vo Ciclo  
> **Tema Central:** Colaboración en equipo, gestión de ramas concurrentes y resolución estratégica de conflictos en GitHub. 

---

## 📖 Descripción del Proyecto

**BaaS Lite** es una plataforma Backend-as-a-Service (BaaS) multi-tenant diseñada con una arquitectura ligera, desacoplada y enfocada en el flujo de trabajo colaborativo en Git. Permite la administración de organizaciones (tenants), colecciones dinámicas de datos, gestión de usuarios con roles y cálculo de reportes de consumo.

---

## 🛠️ Stack Tecnológico

- **Entorno de Ejecución:** Node.js (ES Modules)
- **Framework Web:** Express
- **Motor de Vistas:** EJS
- **Estilos:** TailwindCSS (vía CDN)
- **Base de Datos:** SQLite 3 (`better-sqlite3`)
- **ORM:** Drizzle ORM (`drizzle-orm`)
- **Semillero de Datos:** JSON estructurado (`data/initialData.json`)

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

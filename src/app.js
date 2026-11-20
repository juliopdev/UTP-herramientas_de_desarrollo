import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiRouter } from './routes.js';
import { seedDatabaseIfEmpty } from './db/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// La app se construye aquí y se exporta: server.js la pone a escuchar y los tests la levantan en un puerto libre.
export const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Inicializar y sembrar base de datos si es necesario
seedDatabaseIfEmpty();

// Middleware de Métricas del Superadmin (JULIO PARIONA)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[METRICS] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Cargar rutas
app.use('/', apiRouter);

// Manejo básico de 404
app.use((req, res) => {
  res.status(404).render('index', {
    title: '404 - No Encontrado',
    currentModule: '404',
    stats: { totalTenants: 0, totalUsers: 0, totalReports: 0, systemStatus: '404' },
    tenants: [],
    users: [],
    reports: [],
    collections: []
  });
});

import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { apiRouter } from './routes.js';
import { seedDatabaseIfEmpty } from './db/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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
    reports: []
  });
});

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`🚀 Servidor BaaS Lite corriendo en: http://localhost:${config.port}`);
  console.log(`📊 Entorno: ${config.env}`);
});

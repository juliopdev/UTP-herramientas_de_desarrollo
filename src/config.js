/**
 * config.js - Configuración global de la plataforma BaaS Lite
 */
// La versión se toma de package.json: así /api/health y el dashboard siempre muestran la versión publicada
import pkg from '../package.json' with { type: 'json' };

export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  dbPath: process.env.DB_PATH || './data/app.db',
  appName: 'BaaS Lite Platform',
  version: pkg.version,

  // Configuración de límites y capacidades de módulos
  limits: {
    maxTenants: 50,
    maxRecordsPerTenant: 1000,
    defaultPageSize: 10,
    maxReportsPerTenant: 100,
    storageLimitMb: 500,
    allowedRoles: ['admin', 'editor', 'viewer']
  }
};

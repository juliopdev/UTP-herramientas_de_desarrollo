/**
 * config.js - Configuración global de la plataforma BaaS Lite
 */
export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  dbPath: process.env.DB_PATH || './data/app.db',
  appName: 'BaaS Lite Platform',
  version: '1.0.0',

  // Configuración de límites y capacidades de módulos
  limits: {
    maxTenants: 50,
    maxRecordsPerTenant: 1000,
    defaultPageSize: 10
  }
};

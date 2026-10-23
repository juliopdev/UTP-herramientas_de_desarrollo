import fs from 'node:fs';
import { db } from '../../db/index.js';
import { tenants, users, collections, reports } from '../../db/schema.js';
import { config } from '../../config.js';

export const ownerController = {
  // Renderizar la vista principal del dashboard
  async renderDashboard(req, res) {
    try {
      const allTenants = await db.select().from(tenants);
      const allUsers = await db.select().from(users);
      const allReports = await db.select().from(reports);

      const stats = {
        totalTenants: allTenants.length,
        totalUsers: allUsers.length,
        totalReports: allReports.length,
        activeTenants: allTenants.filter(t => t.status === 'active').length,
        systemStatus: 'Óptimo',
        dbPath: config.dbPath,
        version: config.version
      };

      res.render('index', {
        title: 'Panel Superadmin - BaaS Lite',
        currentModule: 'owner',
        stats,
        tenants: allTenants,
        users: allUsers,
        reports: allReports
      });
    } catch (error) {
      console.error('Error en renderDashboard:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  // Endpoint de salud del sistema / API de estado
  async getHealth(req, res) {
    try {
      const allTenants = await db.select().from(tenants);
      const allUsers = await db.select().from(users);
      const allReports = await db.select().from(reports);
      const allCollections = await db.select().from(collections);
      // Tamaño de BD leído en cada petición, no al arrancar el módulo
      const dbStats = fs.existsSync(config.dbPath) ? fs.statSync(config.dbPath) : null;
      const dbSizeBytes = dbStats ? dbStats.size : 0;
      // Cálculo de tiempo activo formateado
      const uptimeSeconds = Math.floor(process.uptime());
      const hours = Math.floor(uptimeSeconds / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      const seconds = uptimeSeconds % 60;
      const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;
      // Métricas globales del sistema
      const activeTenantsCount = allTenants.filter(t => t.status === 'active').length;
      const activeUsersCount   = allUsers.filter(u => u.status === 'active').length;
      res.json({
        status: 'ok',
        appName: config.appName,
        version: config.version,
        environment: config.env,
        timestamp: new Date().toISOString(),
        uptime: {
          seconds: uptimeSeconds,
          formatted: uptimeFormatted
        },
        database: 'connected',
        metrics: {
          totalTenants: allTenants.length,
          activeTenants: activeTenantsCount,
          totalUsers: allUsers.length,
          activeUsers: activeUsersCount,
          totalReports: allReports.length,
          totalCollections: allCollections.length,
          dbSizeKb: Math.round(dbSizeBytes / 1024)
        }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

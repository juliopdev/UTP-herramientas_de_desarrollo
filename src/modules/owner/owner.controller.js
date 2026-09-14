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
      res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'connected',
        totalTenants: allTenants.length
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

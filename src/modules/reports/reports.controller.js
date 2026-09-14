import { db } from '../../db/index.js';
import { reports } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const reportsController = {
  // Listar reportes
  async list(req, res) {
    try {
      const allReports = await db.select().from(reports);
      res.json({ success: true, data: allReports });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Generar reporte
  async generate(req, res) {
    try {
      const { tenantId, title, storageMb, apiCalls } = req.body;
      const newReport = {
        id: `rep-${Date.now()}`,
        tenantId: tenantId || 'tenant-001',
        title: title || 'Reporte de Actividad',
        storageMb: storageMb ? parseFloat(storageMb) : Math.round(Math.random() * 50 * 10) / 10,
        apiCalls: apiCalls ? parseInt(apiCalls) : Math.floor(Math.random() * 5000) + 500,
        status: 'generated',
        createdAt: new Date().toISOString()
      };
      await db.insert(reports).values(newReport);
      res.status(201).json({ success: true, data: newReport });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

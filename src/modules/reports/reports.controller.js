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
  },

  // Resumen de consumo
  async getUsageSummary(req, res) {
    try {
      const { tenantId } = req.params;
      const tenantReps = await db.select().from(reports).where(eq(reports.tenantId, tenantId));
      const totalStorage = tenantReps.reduce((acc, r) => acc + (r.storageMb || 0), 0);
      const totalCalls = tenantReps.reduce((acc, r) => acc + (r.apiCalls || 0), 0);
      res.json({
        success: true,
        tenantId,
        summary: { totalReports: tenantReps.length, totalStorageMb: totalStorage, totalApiCalls: totalCalls }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Exportar reporte en JSON estructurado
  async exportJson(req, res) {
    try {
      const { tenantId } = req.params;
      const tenantReps = await db.select().from(reports).where(eq(reports.tenantId, tenantId));
      if (tenantReps.length === 0) {
        return res.status(404).json({ success: false, error: 'No se encontraron reportes para este tenant.' });
      }
      const exportData = {
        exportedAt: new Date().toISOString(),
        tenantId,
        totalRecords: tenantReps.length,
        reports: tenantReps.map(r => ({
          id: r.id,
          title: r.title,
          storageMb: r.storageMb,
          apiCalls: r.apiCalls,
          status: r.status,
          createdAt: r.createdAt
        }))
      };
      res.setHeader('Content-Disposition', `attachment; filename="reports-${tenantId}.json"`);
      res.setHeader('Content-Type', 'application/json');
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

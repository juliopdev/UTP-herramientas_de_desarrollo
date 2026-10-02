import { db } from '../../db/index.js';
import { collections, records } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const dataController = {
  // Listar colecciones por tenant
  async listCollections(req, res) {
    try {
      const allCols = await db.select().from(collections);
      res.json({ success: true, data: allCols });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Crear colección dinámica
  async createCollection(req, res) {
    try {
      const { tenantId, name, schema } = req.body;
      const newCol = {
        id: `col-${Date.now()}`,
        tenantId: tenantId || 'tenant-001',
        name: name || 'items',
        schemaJson: JSON.stringify(schema || {}),
        createdAt: new Date().toISOString()
      };
      await db.insert(collections).values(newCol);
      res.status(201).json({ success: true, data: newCol });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Insertar registro dinámico
   async insertRecord(req, res) {
    try {
      const { collectionId } = req.params;
      const { tenantId, data } = req.body;
      const newRec = {
        id: `rec-${Date.now()}`,
        collectionId,
        tenantId: tenantId || 'tenant-001',
        dataJson: JSON.stringify(data || {}),
        createdAt: new Date().toISOString()
      };
      await db.insert(records).values(newRec);
      res.status(201).json({ success: true, data: newRec });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

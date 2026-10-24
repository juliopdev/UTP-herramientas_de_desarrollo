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
  },

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

  // Listar registros de una colección
  async listRecords(req, res) {
    try {
      const { collectionId } = req.params;
      const all = await db.select().from(records).where(eq(records.collectionId, collectionId));
      res.json({ success: true, data: all });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Eliminar colección por ID
  async deleteCollection(req, res) {
    try {
      const { collectionId } = req.params;
      const existing = await db.select().from(collections).where(eq(collections.id, collectionId));
      if (existing.length === 0) {
        return res.status(404).json({ success: false, error: 'Colección no encontrada.' });
      }
      await db.delete(collections).where(eq(collections.id, collectionId));
      res.json({ success: true, message: `Colección ${collectionId} eliminada correctamente.` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

};

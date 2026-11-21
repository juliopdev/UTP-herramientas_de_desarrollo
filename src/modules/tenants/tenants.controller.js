import { db } from '../../db/index.js';
import { tenants } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

export const tenantsController = {
  // Listar todos los tenants
  async list(req, res) {
    try {
      const allTenants = await db.select().from(tenants).orderBy(desc(tenants.createdAt));
      res.json({ success: true, data: allTenants });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Obtener tenant por ID
  async getById(req, res) {
    try {
      const tenant = await db.select().from(tenants).where(eq(tenants.id, req.params.id)).get();
      if (!tenant) return res.status(404).json({ success: false, message: 'Tenant no encontrado' });
      res.json({ success: true, data: tenant });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Crear nuevo tenant (Base inicial)
  async create(req, res) {
    try {
      const { name, subdomain, plan } = req.body;
      // Subdominio: minúsculas, números y guiones; 3 a 32 caracteres; sin guion al inicio ni al final
      if (subdomain !== undefined && !/^[a-z0-9](?:[a-z0-9-]{1,30})[a-z0-9]$/.test(subdomain)) {
        return res.status(400).json({ success: false, message: 'Subdominio inválido: usa minúsculas, números y guiones (3 a 32 caracteres).' });
      }
      const newTenant = {
        id: `tenant-${Date.now()}`,
        name: name || 'Nueva Organización',
        subdomain: subdomain || `sub-${Date.now()}`,
        status: 'active',
        plan: plan || 'starter',
        createdAt: new Date().toISOString()
      }
      const existing = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain)).get();
      if (existing) {
        return res.status(400).json({ success: false, message: 'El subdominio ya está en uso' });
      };
      await db.insert(tenants).values(newTenant);
      res.status(201).json({ success: true, data: newTenant });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Cambiar estado activo / suspendido
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const current = await db.select().from(tenants).where(eq(tenants.id, id)).get();
      if (!current) return res.status(404).json({ success: false, message: 'No encontrado' });
      const nextStatus = current.status === 'active' ? 'suspended' : 'active';
      await db.update(tenants).set({ status: nextStatus }).where(eq(tenants.id, id));
      res.json({ success: true, message: `Estado cambiado a ${nextStatus}` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

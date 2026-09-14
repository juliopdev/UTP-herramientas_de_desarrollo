import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const usersController = {
  // Listar usuarios
  async list(req, res) {
    try {
      const allUsers = await db.select().from(users);
      res.json({ success: true, data: allUsers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Crear nuevo usuario del tenant
  async create(req, res) {
    try {
      const { tenantId, name, email, role } = req.body;
      const newUser = {
        id: `usr-${Date.now()}`,
        tenantId: tenantId || 'tenant-001',
        name: name || 'Usuario Demo',
        email: email || `user-${Date.now()}@example.com`,
        role: role || 'viewer',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      await db.insert(users).values(newUser);
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

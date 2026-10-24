import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const usersController = {
  // Listar usuarios
  async list(req, res) {
    try {
      const { tenantId } = req.query;
      const query = tenantId
        ? db.select().from(users).where(eq(users.tenantId, tenantId))
        : db.select().from(users);
      const allUsers = await query;
      res.json({ success: true, data: allUsers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Crear nuevo usuario del tenant
  async create(req, res) {
    try {
      const { tenantId, name, email, role } = req.body;

      // Validar unicidad de email por organización
      if (email) {
        const existing = await db.select().from(users)
          .where(eq(users.email, email));
        const duplicate = existing.find(u => u.tenantId === (tenantId || 'tenant-001'));
        if (duplicate) {
          return res.status(409).json({
            success: false,
            message: `El email ${email} ya está registrado en esta organización.`
          });
        }
      }

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
  },

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const validRoles = ['admin', 'editor', 'viewer'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: 'Rol no válido' });
      }
      await db.update(users).set({ role }).where(eq(users.id, id));
      res.json({ success: true, message: `Rol actualizado a ${role}` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

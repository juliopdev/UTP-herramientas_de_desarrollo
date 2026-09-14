import { Router } from 'express';
import { ownerRouter } from './modules/owner/owner.routes.js';

export const apiRouter = Router();

/**
 * Registro de rutas principales del sistema
 */
// Módulo Superadmin / Owner
apiRouter.use('/', ownerRouter);

// ── Espacio reservado para registro de módulos del equipo ──
// [SEMANA 1]: Integrante 1 e Integrante 2 registrarán sus prefijos de ruta aquí:
// Ej: apiRouter.use('/api/tenants', tenantsRouter);
// Ej: apiRouter.use('/api/data', dataRouter);

import { dataRouter } from './modules/data/data.routes.js';
import { Router } from 'express';
import { ownerRouter } from './modules/owner/owner.routes.js';
import { tenantsRouter } from './modules/tenants/tenants.routes.js';

export const apiRouter = Router();

/**
 * Registro de rutas principales del sistema
 */
// Módulo Superadmin / Owner
apiRouter.use('/', ownerRouter);

//SEMANA 1 
apiRouter.use('/api/data',dataRouter);

// ── Espacio reservado para registro de módulos del equipo ──
apiRouter.use('/api/tenants', tenantsRouter);
apiRouter.use('/api/data', dataRouter);


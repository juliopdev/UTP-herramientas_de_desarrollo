import { dataRouter } from './modules/data/data.routes.js';
import { Router } from 'express';
import { ownerRouter } from './modules/owner/owner.routes.js';

export const apiRouter = Router();

/**
 * Registro de rutas principales del sistema
 */
// Módulo Superadmin / Owner
apiRouter.use('/', ownerRouter);

//SEMANA 1 
apiRouter.use('/api/data',dataRouter);
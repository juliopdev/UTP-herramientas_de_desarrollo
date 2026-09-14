import { Router } from 'express';
import { reportsController } from './reports.controller.js';

export const reportsRouter = Router();

// Endpoints del módulo de Reportes y Métricas (Integrante 4)
reportsRouter.get('/', reportsController.list);
reportsRouter.post('/generate', reportsController.generate);

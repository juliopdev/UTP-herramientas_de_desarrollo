import { Router } from 'express';
import { dataController } from './data.controller.js';

export const dataRouter = Router();

// Endpoints del módulo de Datos Dinámicos (Integrante 2)
dataRouter.get('/collections', dataController.listCollections);
dataRouter.post('/collections', dataController.createCollection);

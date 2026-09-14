import { Router } from 'express';
import { tenantsController } from './tenants.controller.js';

export const tenantsRouter = Router();

// Endpoints del módulo de Tenants (Integrante 1)
tenantsRouter.get('/', tenantsController.list);
tenantsRouter.get('/:id', tenantsController.getById);
tenantsRouter.post('/', tenantsController.create);
